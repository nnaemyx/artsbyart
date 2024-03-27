"use client"
import React, { useState, useEffect } from "react";
import { db } from "@/utils/appwrite";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = () => {
  const [completedTickets, setCompletedTickets] = useState([]);
  const [availableICs, setAvailableICs] = useState([]); // ICs dropdown data
  const [selectedIC, setSelectedIC] = useState(null); // Selected IC for assignment
  const [ics, setIcs] = useState([]);

  useEffect(() => {
    const fetchIcs = async () => {
      try {
        const response = await db.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_REGISTRATION_COLLECTION_ID
        );
        setIcs(response.documents);
      } catch (error) {
        console.error("Error fetching ICs:", error);
      }
    };
    fetchIcs();
  }, []);

  useEffect(() => {
    // Fetch tickets and available ICs when the component mounts
    fetchCompletedTickets();
    fetchICs();
  }, []);

  const sendSMS = async (phoneNumber) => {
    try {
      const response = await fetch("/api/sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
        })
      });
  
      // Handle response
      if (response.ok) {
        console.log("SMS sent successfully!");
      } else {
        console.error("Failed to send SMS");
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  };
  


  const fetchCompletedTickets = async () => {
    try {
      const response = await db.listDocuments(
        process.env.NEXT_PUBLIC_DB_ID,
        process.env.NEXT_PUBLIC_TICKETS_COLLECTION_ID
      );
      const tickets = response.documents;
      const completedTickets = tickets.filter(
        (ticket) => ticket.status === "completed"
      );
      setCompletedTickets(completedTickets);
    } catch (error) {
      console.error("Error fetching completed tickets:", error);
    }
  };

  const fetchICs = async () => {
    try {
      const response = await db.listDocuments(
        process.env.NEXT_PUBLIC_DB_ID,
        process.env.NEXT_PUBLIC_REGISTRATION_COLLECTION_ID
      );

      // Filter documents based on the 'verified' status
      const verifiedICs = response.documents.filter(
        (ic) => ic.is_verified === true
      );

      setAvailableICs(verifiedICs);
    } catch (error) {
      console.error("Error fetching verified ICs:", error);
    }
  };

  // Function to render ticket rows with dropdown and assignment button
  const CompletedTicketRow = ({ ticket }) => {
    const [selectedICForTicket, setSelectedICForTicket] = useState(null);

    return (
      <tr key={ticket.$id}>
        <td>{ticket.name}</td>
        <td>{ticket.content}</td>
        <td>{ticket.email}</td>
        <td>
          <Select
            options={options}
            isMulti
            value={selectedICForTicket}
            onChange={(selectedOptions) =>
              setSelectedICForTicket(selectedOptions)
            }
          />
          <div className="flex gap-2 mt-2">
            <button
              className="bg-blue-500 px-4 text-light py-1"
              onClick={() => handleAssignJob(ticket, selectedICForTicket)}
            >
              Assign
            </button>
            <button
              className="bg-blue-500 px-4 text-light py-1"
              onClick={() => handleSendToAll(ticket)}
            >
              Send to All
            </button>
            <button
              className="bg-blue-500 px-4 text-light py-1"
              onClick={() => handleUpdate(ticket,selectedICForTicket)}
            >
              Update
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const renderCompletedTicketRows = (tickets) => {
    return tickets.map((ticket) => (
      <CompletedTicketRow key={ticket.$id} ticket={ticket} />
    ));
  };

  const handleAssignJob = async (ticket, selectedICForTicket) => {
    try {
      // Extracting necessary fields from the ticket data
      const { $id, name, email, content, productName, assignedICs } = ticket;
  
      // Extract IDs of already assigned ICs, if any
      const currentAssignedICs = assignedICs || [];
  
      if (selectedICForTicket && selectedICForTicket.length > 0) {
        // Extract IDs of selected ICs
        const selectedIC = selectedICForTicket.map((ic) => ic.value);
  
        // Fetch IC objects for selected IC IDs
        const selectedICObjects = availableICs.filter((ic) =>
          selectedIC.includes(ic.$id)
        );
  
        // Fetch the phone numbers of the selected ICs
        const phoneNumbers = selectedICObjects.map((ic) => ic.phone_num1);
  
        // Combine current and newly selected ICs
        const updatedAssignedICs = [...new Set([...currentAssignedICs, ...selectedIC])];
  
        const updatedTicket = {
          assignedICs: updatedAssignedICs, // Assigning an array of IC IDs
          name,
          email,
          content,
          productName,
        };
  
        await db.createDocument(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_COMPLETEDTICKETS_COLLECTION_ID,
          $id,
          updatedTicket
        );
  
        // Send SMS to each newly assigned IC
        for (const phoneNumber of phoneNumbers) {
          await sendSMS(phoneNumber);
        }
  
        toast.success("Ticket assigned successfully!");
      } else {
        console.log("No ICs selected. Ticket assignment skipped.");
      }
    } catch (error) {
      toast.error("Error assigning ticket:", error);
    }
  };
  

 const handleSendToAll = async (ticket) => {
  try {
    const { $id, name, email, content, productName } = ticket;
    const updatedTicket = {
      assignedICs: availableICs.map((ic) => ic.$id), // Assign all available ICs
      name,
      email,
      content,
      productName,
    };

    // Update the ticket document with assigned ICs
    await db.createDocument(
      process.env.NEXT_PUBLIC_DB_ID,
      process.env.NEXT_PUBLIC_COMPLETEDTICKETS_COLLECTION_ID,
      $id,
      updatedTicket
    );

    // Send SMS notifications to each assigned IC
    // await Promise.all(
    //   availableICs.map(async (ic) => {
    //     await sendSMSToIC(ic.phone_num1, `You have a new job: ${ticket.name}`);
    //   })
    // );

    console.log("Ticket sent to all ICs successfully!");
  } catch (error) {
    console.error("Error sending ticket to all ICs:", error);
  }
};

// Function to update the assigned ICs for a ticket and send SMS notifications
const handleUpdate = async (ticket, selectedICForTicket) => {
  try {
    const { $id, name, email, content, productName, assignedICs } = ticket;
    const selectedIC = selectedICForTicket.map((ic) => ic.value);

    // Combine current and newly selected ICs
    const updatedAssignedICs = [...new Set([...assignedICs, ...selectedIC])];

    const updatedTicket = {
      assignedICs: updatedAssignedICs, // Assign newly selected ICs
      name,
      email,
      content,
      productName,
    };

    // Update the ticket document with newly assigned ICs
    await db.updateDocument(
      process.env.NEXT_PUBLIC_DB_ID,
      process.env.NEXT_PUBLIC_COMPLETEDTICKETS_COLLECTION_ID,
      $id,
      updatedTicket
    );

    // Send SMS notifications to newly assigned ICs
    // await Promise.all(
    //   selectedICsForTicket.map(async (ic) => {
    //     await sendSMSToIC(ic.phone_num1, `You have a new job: ${ticket.name}`);
    //   })
    // );

    toast.success("Ticket updated and sent to newly assigned ICs successfully!");
  } catch (error) {
    toast.error("Error updating and sending ticket to newly assigned ICs:", error);
  }
};


  

  const options = availableICs.map((ic) => ({
    value: ic.$id,
    label: ic.bus_name,
  }));

  return (
    <div>
      <h2 className="mb-4 text-[20px] font-futura font-semibold mt-8">
        Completed Tickets
      </h2>
      <table className="table-auto min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th>Name</th>
            <th>ProductName</th>
            <th>Email</th>
            <th>Action</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>{renderCompletedTicketRows(completedTickets)}</tbody>
      </table>
    </div>
  );
};

export default Orders;
