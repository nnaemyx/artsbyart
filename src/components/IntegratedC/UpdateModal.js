import React from "react";

const UpdateModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <div className={`modal ${isOpen ? "block" : "hidden"} fixed inset-0 z-50 flex items-center justify-center`}>
      <div className="bg-white p-4 z-10 rounded shadow-lg relative">
        <h3 className="text-lg font-bold mb-4">Update Verification Status</h3>
        <div className="flex gap-4 items-center">
          <button
            className="bg-blue-500 text-white rounded p-2"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm
          </button>
          <button className="modal-close text-[30px]" onClick={onClose}>
            ×
          </button>
        </div>
      </div>
      <div className="modal-overlay absolute inset-0 bg-gray-900 opacity-50"></div>
    </div>
  );
};

export default UpdateModal;
