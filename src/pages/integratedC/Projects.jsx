import React, { useState, useEffect } from "react";
import { account, db } from "@/utils/appwrite";
import { useAuth } from "@/utils/AuthContent";
import Link from "next/link";

const Projects = () => {
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
          console.log("Ticket ID:", ticket.assignedICs); // Log ticket ID
          return ticket.assignedICs.includes(user.$id);
        });

        console.log("Filtered Tickets:", filteredTickets); // Log filtered tickets

        setAssignedTickets(filteredTickets);
      } catch (error) {
        console.error("Error fetching assigned tickets:", error);
      }
    }

    if (user) {
      fetchAssignedTickets();
    }
  }, [user]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Assigned Orders</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <ul>
          {assignedTickets.map((ticket) => (
            <li
              key={ticket.$id}
              className="border-b py-4 flex justify-between items-center"
            >
              <div>
                <p className="text-black">{ticket.content}</p>
                {/* Render other ticket details as needed */}
              </div>
              <Link href="/integratedC/Chat" className="flex items-center space-x-4">
                <button className="focus:outline-none">Chat</button>
                {/* Add progress bar here */}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Projects;
