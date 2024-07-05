import React from 'react';
import Modal from 'react-modal';

const ModalContent = ({ isOpen, content, onRequestClose }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    ariaHideApp={false}
    contentLabel="Authentication Modal"
    style={{
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 9999,
      },
      content: {
        padding: 0,
        border: 'none',
        borderRadius: '8px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '90%',
        maxHeight: '90%',
        width: '100%',
        height: '100%',
      },
    }}
  >
    {content}
  </Modal>
);

export default ModalContent;
