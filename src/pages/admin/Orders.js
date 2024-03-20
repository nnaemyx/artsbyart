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
        <td>{ticket.$id}</td>
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
      const { $id, name, email, content, productName } = ticket;
      if (selectedICForTicket && selectedICForTicket.length > 0) {
        const selectedIC = selectedICForTicket[0];
        const selectedICObject = availableICs.find(ic => ic.$id === selectedIC.value);
  
        if (!selectedICObject) {
          console.error("Selected IC not found");
          return;
        }
  
        // Fetch the phone number of the selected IC
        const phoneNumber = selectedICObject.phone_num1;
  
        const updatedTicket = {
          assignedICs: selectedIC.value, // Assuming assignedICs expects an ID
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
  
        // Send SMS to the assigned IC
        await sendSMS(phoneNumber);
  
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
      // Update the ticket document with assigned ICs
      const { $id, name, email, content, productName } = ticket;
      const updatedTicket = {
        assignedICs: availableICs.map((ic) => `${ic.$id}:${ic.label}`),
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
