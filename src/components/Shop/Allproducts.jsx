import CustomCheckbox from "@/context/Customcheckbox";
import Toggle from "@/context/Customtoggle";
import React, { useState } from "react";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import Shop from "./Shop";

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
        <div className="flex-1">
            <Shop/>
        </div>
      </div>
    </div>
  );
};

export default Allproducts;
