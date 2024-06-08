"use client"
import React, { useState, useEffect } from "react";
import { db } from "@/utils/appwrite";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomOption from "@/components/Admin/CustomOption";

const Orders = () => {
  const [completedTickets, setCompletedTickets] = useState([]);
  const [availableICs, setAvailableICs] = useState([]);
  const [selectedIC, setSelectedIC] = useState(null);
  const [ics, setIcs] = useState([]);
  const [reviews, setReviews] = useState({}); // State to store reviews

  useEffect(() => {
    fetchCompletedTickets();
    fetchICs();
    fetchReviews();
  }, []);

  const sendSMS = async (phoneNumber) => {
    const formattedPhoneNumber = phoneNumber.startsWith("0")
      ? `+234${phoneNumber.slice(1)}`
      : phoneNumber;

    try {
      const response = await fetch("/api/sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formattedPhoneNumber,
        }),
      });

      if (response.ok) {
        console.log("SMS sent successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send SMS");
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

      const verifiedICs = response.documents.filter(
        (ic) => ic.is_verified === true
      );

      setAvailableICs(verifiedICs);
    } catch (error) {
      console.error("Error fetching verified ICs:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await db.listDocuments(
        process.env.NEXT_PUBLIC_DB_ID,
        process.env.NEXT_PUBLIC_REVIEWS_COLLECTION_ID
      );
      const reviewDocs = response.documents;

      // Organize reviews by IC ID for easy lookup
      const reviewsData = {};
      reviewDocs.forEach((review) => {
        if (!reviewsData[review.integratedID]) {
          reviewsData[review.integratedID] = [];
        }
        reviewsData[review.integratedID].push(review.reviewtext);
      });
      console.log(reviewsData);

      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const CompletedTicketRow = ({ ticket }) => {
    const [selectedICForTicket, setSelectedICForTicket] = useState(null);

    return (
      <tr key={ticket.$id}>
        <td>{ticket.name}</td>
        <td>{ticket.productName}</td>
        <td>{ticket.email}</td>
        <td>{ticket.phoneNumber}</td>
        <td>
          <Select
            options={options}
            isMulti
            value={selectedICForTicket}
            onChange={(selectedOptions) =>
              setSelectedICForTicket(selectedOptions)
            }
            components={{ Option: CustomOption }}
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
              onClick={() => handleUpdate(ticket, selectedICForTicket)}
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
      const {
        $id,
        name,
        email,
        content,
        productName,
        assignedICs,
        phoneNumber,
      } = ticket;
      const currentAssignedICs = assignedICs || [];

      if (selectedICForTicket && selectedICForTicket.length > 0) {
        const selectedIC = selectedICForTicket.map((ic) => ic.value);
        const selectedICObjects = availableICs.filter((ic) =>
          selectedIC.includes(ic.$id)
        );
        const phoneNumbers = selectedICObjects.map((ic) => ic.phone_num1);
        const updatedAssignedICs = [
          ...new Set([...currentAssignedICs, ...selectedIC]),
        ];

        const updatedTicket = {
          assignedICs: updatedAssignedICs,
          name,
          email,
          content,
          productName,
          phoneNumber,
        };

        await db.createDocument(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_COMPLETEDTICKETS_COLLECTION_ID,
          $id,
          updatedTicket
        );

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
      const { $id, name, email, content, productName, phoneNumber } = ticket;
      const updatedTicket = {
        assignedICs: availableICs.map((ic) => ic.$id),
        name,
        email,
        content,
        productName,
        phoneNumber,
      };

      await db.createDocument(
        process.env.NEXT_PUBLIC_DB_ID,
        process.env.NEXT_PUBLIC_COMPLETEDTICKETS_COLLECTION_ID,
        $id,
        updatedTicket
      );

      await Promise.all(
        availableICs.map(async (ic) => {
          await sendSMS(ic.phone_num1, `You have a new job: ${ticket.name}`);
        })
      );

      console.log("Ticket sent to all ICs successfully!");
    } catch (error) {
      console.error("Error sending ticket to all ICs:", error);
    }
  };

  const handleUpdate = async (ticket, selectedICForTicket) => {
    try {
      const {
        $id,
        name,
        email,
        content,
        productName,
        assignedICs,
        phoneNumber,
      } = ticket;
      const selectedIC = selectedICForTicket.map((ic) => ic.value);

      const updatedAssignedICs = [...new Set([...assignedICs, ...selectedIC])];

      const updatedTicket = {
        assignedICs: updatedAssignedICs,
        name,
        email,
        content,
        productName,
        phoneNumber,
      };

      await db.updateDocument(
        process.env.NEXT_PUBLIC_DB_ID,
        process.env.NEXT_PUBLIC_COMPLETEDTICKETS_COLLECTION_ID,
        $id,
        updatedTicket
      );

      await Promise.all(
        selectedICForTicket.map(async (ic) => {
          await sendSMS(ic.phone_num1, `You have a new job: ${ticket.name}`);
        })
      );

      toast.success(
        "Ticket updated and sent to newly assigned ICs successfully!"
      );
    } catch (error) {
      toast.error(
        "Error updating and sending ticket to newly assigned ICs:",
        error
      );
    }
  };

  const options = availableICs.map((ic) => ({
    value: ic.$id,
    label: `${ic.bus_name} (${reviews[ic.$id] ? reviews[ic.$id].join(", ") : "No reviews"})`,
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
            <th>Phone Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{renderCompletedTicketRows(completedTickets)}</tbody>
      </table>
    </div>
  );
};

export default Orders;
