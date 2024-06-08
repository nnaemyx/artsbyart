import React, { useState } from 'react';
import { components } from 'react-select';

const CustomOption = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <components.Option {...props}>
      <div className="flex justify-between items-center">
        <span>{props.label}</span>
        <button onClick={toggleDropdown} className="ml-2">
          {isOpen ? '▲' : '▼'}
        </button>
      </div>
      {isOpen && (
        <div className="ml-4 mt-2">
          {props.data.reviews && props.data.reviews.length > 0 ? (
            <ul>
              {props.data.reviews.map((review, index) => (
                <li key={index} className="text-sm">
                  {review}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm">No reviews</div>
          )}
        </div>
      )}
    </components.Option>
  );
};

export default CustomOption;
