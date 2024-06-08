import UpdateModal from "@/components/IntegratedC/UpdateModal";
import { db, getIsVerified, updateIsVerified } from "@/utils/appwrite";
import React, { useState, useEffect } from "react";

const IntegratedC = () => {
  const [ics, setIcs] = useState([]);
  const [isVerified, setIsVerified] = useState(getIsVerified());
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
        setIsVerified(newValue);
      }
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto mt-8">
          <table className="table-auto min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
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
                <tr key={ic.$id}>
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
