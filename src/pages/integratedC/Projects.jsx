import React, { useState, useEffect } from "react";
import { db } from "@/utils/appwrite";
import { useAuth } from "@/utils/AuthContent";
import Link from "next/link";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ICProjects = () => {
  const [assignedTickets, setAssignedTickets] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchAssignedTickets() {
      try {
        const response = await db.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_COMPLETEDTICKETS_COLLECTION_ID
        );

        // Filter assigned tickets based on IC ID
        const filteredTickets = response.documents.filter((ticket) => {
          return ticket.assignedICs.includes(user.$id);
        });

        // Fetch procedures and image for each ticket based on product name
        const ticketsWithDetails = await Promise.all(filteredTickets.map(async (ticket) => {
          try {
            const productResponse = await fetch(`/api/products/product?name=${ticket.productName}`);
            const productData = await productResponse.json();
            const productKey = Object.keys(productData)[0];
            const product = productData[productKey] || {};

            const proceduresArray = product.procedures?.map(proc => {
              const existingProcedure = JSON.parse(ticket.procedures || '[]').find(p => p.description === proc);
              return { description: proc, completed: existingProcedure ? existingProcedure.completed : false };
            }) || [];
            const image = product.images?.[0] || null; // Fetch only the first image

            return { 
              ...ticket, 
              procedures: proceduresArray,
              image
            };
          } catch (error) {
            console.error('Error fetching product details:', error);
            return ticket;
          }
        }));

        setAssignedTickets(ticketsWithDetails);
      } catch (error) {
        console.error("Error fetching assigned tickets:", error);
      }
    }

    if (user) {
      fetchAssignedTickets();
    }
  }, [user]);

  const handleProcedureChange = async (ticketId, procedureIndex) => {
    setAssignedTickets(prevTickets =>
      prevTickets.map(ticket => {
        if (ticket.$id === ticketId) {
          const updatedProcedures = ticket.procedures.map((proc, index) => {
            if (index === procedureIndex) {
              return { ...proc, completed: !proc.completed };
            }
            return proc;
          });

          const completedCount = updatedProcedures.filter(proc => proc.completed).length;
          const progress = (completedCount / updatedProcedures.length) * 100;

          // Update progress and procedures to the database
          updateProgressToDatabase(ticketId, JSON.stringify(updatedProcedures), progress.toString());

          return { ...ticket, procedures: updatedProcedures, progress };
        }
        return ticket;
      })
    );
  };

  const updateProgressToDatabase = async (ticketId, updatedProcedures, newProgress) => {
    try {
      await db.updateDocument(
        process.env.NEXT_PUBLIC_DB_ID,
        process.env.NEXT_PUBLIC_COMPLETEDTICKETS_COLLECTION_ID,
        ticketId,
        { procedures: updatedProcedures, progress: newProgress }
      );

      toast.success('Progress updated successfully');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  if (!assignedTickets) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Assigned Orders</h2>
      <div className="">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignedTickets.map((ticket) => (
            <li
              key={ticket.$id}
              className="border-b py-4 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="w-full md:w-3/4">
                <h3 className="text-lg font-semibold">{ticket.productName}</h3>
                {ticket.image && (
                  <div className="mt-2">
                    <img
                      src={ticket.image}
                      alt="Product"
                      className="w-full h-40 object-cover rounded"
                    />
                  </div>
                )}
                <p className="text-gray-700 mt-1">Procedures:</p>
                {ticket?.procedures?.length > 0 ? (
                  <ul className="list-disc ml-5">
                    {ticket.procedures.map((procedure, index) => (
                      <li key={index}>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={procedure.completed}
                            onChange={() => handleProcedureChange(ticket.$id, index)}
                            className="mr-2"
                          />
                          {procedure.description}
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No procedures available</p>
                )}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${ticket.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-full md:w-1/4 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mt-2 md:mt-0">
                <Link href={`/integratedC/Chat?icId=${ticket.assignedICs}`}>
                  <button className="bg-blue-500 text-white py-2 px-4 rounded">Chat</button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ICProjects;
