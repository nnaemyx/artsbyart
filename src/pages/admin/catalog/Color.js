import Head from "next/head";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Color = () => {
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#000000");

  const handleColorNameChange = (e) => {
    setColorName(e.target.value);
  };

  const handleColorHexChange = (e) => {
    setColorHex(e.target.value);
  };

  const addColor = async (e) => {
    e.preventDefault();
    if (colorName.trim() === "") {
      // Handle validation or show an error message.
      return;
    }

    try {
      const response = await fetch("/api/products/color", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: colorName, hex: colorHex }),
      });

      if (!response.ok) {
        throw new Error("Failed to add color");
      }

      toast.success("Color added successfully");
      setColorName(""); // Clear the name input field
      setColorHex("#000000"); // Reset the color to default
    } catch (error) {
      console.error("Error adding color:", error);
      toast.error("Failed to add color");
    }
  };

  return (
    <div className="w-full">
      <Head>
        <title>Mma-Inspire Admin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2 className="text-center text-[25px] font-opensans mt-12">
        Add Color
      </h2>
      <form
        onSubmit={addColor}
        className="flex mb-4 flex-col mx-auto gap-8 mt-6 justify-center"
      >
        <input
          type="text"
          placeholder="Color Name"
          value={colorName}
          onChange={handleColorNameChange}
          className=" px-4 py-4 focus:outline-none  border border-dark border-solid"
        />
        <input
          type="color"
          value={colorHex}
          onChange={handleColorHexChange}
          className="w-full h-[70px]"
        />
        <button
          type="submit"
          className="mt-[24px]  text-[12px] md:text-[14px] font-semibold bg-dark text-white px-[0px] tracking-[1.5px] py-[18px]"
        >
          Add Color
        </button>
      </form>
    </div>
  );
};

export default Color;
