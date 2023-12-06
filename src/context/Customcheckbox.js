// components/CustomCheckbox.js
import { useState } from "react";

const CustomCheckbox = ({ label, checked, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked || false);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
    if (onChange) {
      onChange(!isChecked);
    }
  };

  return (
    <label className="flex mt-2 items-center  gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="hidden"
          checked={isChecked}
          onChange={toggleCheckbox}
        />
        <div
          className={`w-4 h-4 border border-dark ${
            isChecked ? "border-dark" : "bg-dark"
          }`}
        ></div>
        {isChecked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            className="absolute top-0 left-0 w-4 h-4 text-white"
          >
            <path
              d="M10.0007 15.1709L19.1931 5.97852L20.6073 7.39273L10.0007 17.9993L3.63672 11.6354L5.05093 10.2212L10.0007 15.1709Z"
              fill="rgba(255,255,255,1)"
            ></path>
          </svg>
        )}
      </div>
      <span className="font-opensans text-[15px]">{label}</span>
    </label>
  );
};

export default CustomCheckbox;
