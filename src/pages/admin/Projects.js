import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '@/utils/appwrite';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [ics, setIcs] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjectsAndICs = async () => {
      try {
        // Fetch completed tickets
        const response = await db.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_COMPLETEDTICKETS_COLLECTION_ID
        );
        const tickets = response.documents;

        // Fetch IC details
        const icResponse = await db.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_REGISTRATION_COLLECTION_ID
        );
        const icData = icResponse.documents.reduce((acc, ic) => {
          acc[ic.$id] = ic.bus_name; 
          return acc;
        }, {});

        setIcs(icData);

        // Fetch product images and procedures for each ticket
        const projectsWithDetails = await Promise.all(tickets.map(async (ticket) => {
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
              image,
              progress: ticket.progress || 0
            };
          } catch (error) {
            console.error('Error fetching product details:', error);
            return { ...ticket, procedures: [], progress: ticket.progress || 0 };
          }
        }));

        setProjects(projectsWithDetails);
      } catch (error) {
        toast.error(`Error fetching projects or ICs: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsAndICs();
  }, []);

  const handleChat = (icId) => {
    router.push('/admin/chat/Chat');
  };

  const handleProcedureChange = async (ticketId, procedureIndex) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.$id === ticketId) {
          const updatedProcedures = project.procedures.map((proc, index) => {
            if (index === procedureIndex) {
              return { ...proc, completed: !proc.completed };
            }
            return proc;
          });

          const completedCount = updatedProcedures.filter(proc => proc.completed).length;
          const progress = (completedCount / updatedProcedures.length) * 100;

          // Update progress and procedures in the database
          updateProgressToDatabase(ticketId, JSON.stringify(updatedProcedures), progress.toString());

          return { ...project, procedures: updatedProcedures, progress };
        }
        return project;
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.$id} className="border p-4 rounded shadow-md bg-white">
            {project.image ? (
              <img
                src={project.image}
                alt={project.productName}
                className="w-full h-40 object-cover rounded"
              />
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded">
                <span>No Image Available</span>
              </div>
            )}
            <h2 className="text-xl font-semibold mt-2">{project.productName}</h2>
            <p className="text-gray-700 mt-1">Assigned to: {ics[project.assignedICs] || 'Unknown IC'}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 relative">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${project.progress}%` }}
              ></div>
              <span className="absolute right-0 top-8 text-sm text-gray-800">{`${project.progress}% completed`}</span>
            </div>
            <p className="text-gray-700 mt-1">Procedures:</p>
            {project.procedures && project.procedures.length > 0 ? (
              <ul className="list-disc ml-5">
                {project.procedures.map((procedure, index) => (
                  <li key={index}>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={procedure.completed}
                        onChange={() => handleProcedureChange(project.$id, index)}
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
            <button
              onClick={() => handleChat(project.assignedICs)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              Chat with IC
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
