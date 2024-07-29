import UpdateModal from "@/components/IntegratedC/UpdateModal";
import { db, getIsVerified, updateIsVerified } from "@/utils/appwrite";
import React, { useState, useEffect } from "react";

const IntegratedC = () => {
  const [ics, setIcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    const fetchICs = async () => {
      try {
        const response = await db.listDocuments(
          process.env.NEXT_PUBLIC_DB_ID,
          process.env.NEXT_PUBLIC_REGISTRATION_COLLECTION_ID
        );
        setIcs(response.documents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ICs:", error);
      }
    };

    fetchICs();
  }, []);

  const handleToggle = (documentId) => {
    setSelectedDocumentId(documentId);
    setIsUpdateModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDocumentId(null);
    setIsUpdateModalOpen(false);
  };

  const handleConfirmUpdate = async () => {
    if (selectedDocumentId !== null) {
      const icToUpdate = ics.find((ic) => ic.$id === selectedDocumentId);
      if (icToUpdate) {
        const newValue = !icToUpdate.is_verified;
        await updateIsVerified(selectedDocumentId, newValue);
        setIcs((prevIcs) =>
          prevIcs.map((ic) =>
            ic.$id === selectedDocumentId
              ? { ...ic, is_verified: newValue }
              : ic
          )
        );

        // Send SMS after updating verification status
        const message = newValue
          ? "You are now a Verified IC at Artsbyart."
          : "Your account has been unverified.";
        if (icToUpdate.phone_num1) {
          await sendSMS(icToUpdate.phone_num1, message);
        }
        if (icToUpdate.phone_num2) {
          await sendSMS(icToUpdate.phone_num2, message);
        }
      }
    }
    handleCloseModal();
  };

  const sendSMS = async (phoneNumber, message) => {
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
          message,
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

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full mt-8">
          <table className="bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-[12px]">
                <th className="py-2 px-4">Office Address</th>
                <th className="py-2 px-4">CAC num</th>
                <th className="py-2 px-4">Business Name</th>
                <th className="py-2 px-4">Phonenum1</th>
                <th className="py-2 px-4">Phonenum2</th>
                <th className="py-2 px-4">Branches</th>
                <th className="py-2 px-4">Services</th>
                <th className="py-2 px-4">SmartPhone</th>
                <th className="py-2 px-4">Verify IC</th>
              </tr>
            </thead>
            <tbody>
              {ics.map((ic) => (
                <tr key={ic.$id} className="text-[12px]">
                  <td className="py-2 px-4">{ic.office_address}</td>
                  <td className="py-2 px-4">{ic.reg_num}</td>
                  <td className="py-2 px-4">{ic.bus_name}</td>
                  <td className="py-2 px-4">{ic.phone_num1}</td>
                  <td className="py-2 px-4">{ic.phone_num2}</td>
                  <td className="py-2 px-4">{ic.branches}</td>
                  <td className="py-2 px-4">{ic.services}</td>
                  <td className="py-2 px-4">{ic.smart_phone}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleToggle(ic.$id)}
                      className={`toggle-switch ${
                        ic.is_verified ? 'bg-blue-500 text-light px-2' : 'bg-gray-300'
                      }`}
                    >
                      {ic.is_verified ? 'Verified' : 'Not Verified'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmUpdate}
      />
    </div>
  );
};

export default IntegratedC;
