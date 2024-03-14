import React, { useState, useEffect } from "react";
import { db } from "@/utils/appwrite";
import Select from "react-select";


const Orders = () => {
  const [completedTickets, setCompletedTickets] = useState([]);
  const [availableICs, setAvailableICs] = useState([]); // ICs dropdown data
  const [selectedIC, setSelectedIC] = useState(null); // Selected IC for assignment

  useEffect(() => {
    // Fetch tickets and available ICs when the component mounts
    fetchCompletedTickets();
    fetchICs();
  }, []);

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
      const verifiedICs = response.documents.filter((ic) => ic.is_verified === true);
  
      setAvailableICs(verifiedICs);
    } catch (error) {
      console.error("Error fetching verified ICs:", error);
    }
  };

 
  

  // Function to render ticket rows with dropdown and assignment button
  const renderCompletedTicketRows = (tickets) => {
    return tickets.map((ticket) => (
      <tr key={ticket.$id}>
        <td>{ticket.$id}</td>
        <td>{ticket.name}</td>
        <td>{ticket.content}</td>
        <td>{ticket.email}</td>
        <td>
          <Select
            options={options}
            isMulti
            value={selectedIC}
            onChange={(selectedOptions) => setSelectedIC(selectedOptions)}
          />
          <div className="flex gap-2 mt-2">
            <button className="bg-blue-500 px-4 text-light py-1" onClick={() => handleAssignJob(ticket)}>Assign</button>
            <button className="bg-blue-500 px-4 text-light py-1" onClick={() => handleSendToAll(ticket)}>Send to All</button>
          </div>
        </td>
      </tr>
    ));
  };

  const handleAssignJob = async (ticket) => {
    try {
        // Extracting necessary fields from the ticket data
        const { $id, name, email, content, productName } = ticket;

        // Update the ticket document with assigned ICs and selected fields
        const updatedTicket = {
            assignedICs: selectedIC.map((ic) => ic.value),
            name,
            email,
            content,
            productName,
        };

        await db.updateDocument(
            process.env.NEXT_PUBLIC_DB_ID,
            process.env.NEXT_PUBLIC_TICKETS_COLLECTION_ID,
            $id,
            updatedTicket
        );

        // Send SMS to the assigned ICs using Twilio
        // await Promise.all(
        //     selectedIC.map(async (ic) => {
        //         await sendSMSToIC(ic.phone, `You have a new job: ${productName}`);
        //     })
        // );

        console.log("Ticket assigned successfully!");
    } catch (error) {
        console.error("Error assigning ticket:", error);
    }
};


const handleSendToAll = async (ticket) => {
  try {
    // Update the ticket document with assigned ICs
    const updatedTicket = {
      ...ticket,
      assignedICs: availableICs.map((ic) => ({
        icId: ic.$id,
        projectName: ticket.content,
      })),
    };

    await db.updateDocument(
      process.env.NEXT_PUBLIC_DB_ID,
      process.env.NEXT_PUBLIC_TICKETS_COLLECTION_ID,
      ticket.$id,
      updatedTicket
    );

    // Send SMS to all available ICs using Twilio
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
            <th>Ticket ID</th>
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
