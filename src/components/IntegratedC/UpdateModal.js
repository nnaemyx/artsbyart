import React from "react";

const UpdateModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <div className={`modal ${isOpen ? "block" : "hidden"}`}>
     
      <div className="modal-container relative z-10 bg-white w-1/2 mx-auto mt-16 p-4">
        {/* Your modal content */}
          <h3 className="text-lg font-bold mb-4">Update Verification Status</h3>
        <div className="p-4 flex gap-4 items-center">
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
      <div className="modal-overlay absolute z-0 w-full top-0 left-0 h-full bg-gray-900 opacity-50 pointer-events-none"></div>
    </div>
  );
};

export default UpdateModal;
