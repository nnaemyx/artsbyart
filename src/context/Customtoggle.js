// components/Toggle.js
import React, { useEffect, useState } from 'react';


const Toggle = ({ label, defaultOpen, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mt-8">
      <button
        onClick={toggle}
        className="flex items-center justify-between w-full focus:outline-none"
      >
        <span className="text-[15px] font-semibold font-opensans">{label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          stroke="currentColor"
          className={` transition-transform transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="mt-4 px-2">{children}</div>}
    </div>
  );
};

export default Toggle;
