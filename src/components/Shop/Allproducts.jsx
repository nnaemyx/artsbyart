import CustomCheckbox from "@/context/Customcheckbox";
import Toggle from "@/context/Customtoggle";
import React, { useState } from "react";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import Products from "./Products";

const Allproducts = () => {
  const [priceRange, setPriceRange] = useState([0, 65000]);
  const [isEditing, setIsEditing] = useState([false, false]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleInputChange = (index, value) => {
    const updatedRange = [...priceRange];
    updatedRange[index] = value;
    setPriceRange(updatedRange);
  };

  const handleInputKeyDown = (e, index) => {
    if (e.key === "Enter") {
      const updatedRange = [...priceRange];
      updatedRange[index] = parseFloat(e.target.value) || 0;
      setPriceRange(updatedRange);
      setIsEditing([false, false]);
    }
  };

  const handleInputFocus = (index) => {
    setIsEditing((prev) => prev.map((_, i) => i === index));
  };

  const sliderStyles = {
    trackStyle: [{ backgroundColor: "black" }],
    handleStyle: [
      { borderColor: "#00d202", backgroundColor: "#00d202" },
      { borderColor: "#00d202", backgroundColor: "#00d202" },
    ],
    railStyle: { backgroundColor: "black" }, // Optional: Background color of the slider track
  };

  return (
    <div className="mb-8 ">
      <div className="flex gap-6">
        <div className="w-1/5 hidden lg:block">
          <h2 className="uppercase font-futura text-[18px]">Filters</h2>
          <hr className="w-full mt-4" />

          <Toggle label="Availability" defaultOpen={true}>
            <CustomCheckbox label="In Stock" />
            <CustomCheckbox label="Out of Stock (80)" />
          </Toggle>
          <hr className="w-full mt-4" />
          <Toggle label="Product Type">
            <CustomCheckbox label="Blouse (80)" />
            <CustomCheckbox label="Skirt (80)" />
          </Toggle>
          <hr className="w-full mt-4" />
          <Toggle label="Color">
            <CustomCheckbox label="Blue (80)" />
            <CustomCheckbox label="Red (80)" />
          </Toggle>
          <hr className="w-full mt-4" />
          <Toggle label="Price">
            <div className="mt-2">
              <Slider
                range
                min={0}
                max={65000}
                defaultValue={priceRange}
                tipFormatter={(value) => `$${value}`}
                onChange={handlePriceChange}
                {...sliderStyles}
              />
            </div>
            {/* Price Input Fields */}
            <div className="flex justify-between items-center mt-2">
              <input
                type="number"
                value={isEditing[0] ? "" : priceRange[0]}
                onChange={(e) => handleInputChange(0, e.target.value)}
                onKeyDown={(e) => handleInputKeyDown(e, 0)}
                onFocus={() => handleInputFocus(0)}
                className="border border-solid px-2 border-dark py-2 w-[40%] focus:outline-none"
                placeholder={` ₦${priceRange[0]}`}
                readOnly={!isEditing[0]}
              />
              <p>to</p>
              <input
                type="number"
                value={isEditing[1] ? "" : priceRange[1]}
                onChange={(e) => handleInputChange(1, e.target.value)}
                onKeyDown={(e) => handleInputKeyDown(e, 1)}
                onFocus={() => handleInputFocus(1)}
                className="border border-solid px-2 border-dark py-2 w-[40%] focus:outline-none"
                placeholder={` ₦${priceRange[1]}`}
                readOnly={!isEditing[1]}
              />
            </div>
          </Toggle>
        </div>
        <div className="flex-1">
            <Products/>
        </div>
      </div>
    </div>
  );
};

export default Allproducts;
