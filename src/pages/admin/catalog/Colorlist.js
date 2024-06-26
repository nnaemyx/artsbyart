import React, { useState, useEffect } from "react";
import Head from "next/head";
import { toast } from "react-toastify";

const Colorlist = () => {
  const [colors, setColors] = useState([]);

  const handleDeleteColor = async (id) => {
    if (window.confirm("Are you sure you want to delete this color?")) {
      try {
        const response = await fetch(`/api/products/color?id=${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          // Handle successful deletion
          toast.success("Color deleted successfully");
          // Remove the deleted color from the state
          setColors(colors.filter(color => color.id !== id));
        } else {
          // Handle errors (e.g., show an error message)
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Failed to delete color");
        }
      } catch (error) {
        // Handle any fetch-related errors
        console.error("Error deleting color:", error.message);
        toast.error("Failed to delete color");
      }
    }
  };

  useEffect(() => {
    // Fetch the colors when the component mounts
    const fetchColors = async () => {
      try {
        const response = await fetch("/api/products/color");
        if (response.ok) {
          const data = await response.json();
          setColors(data);
        } else {
          throw new Error("Failed to fetch colors");
        }
      } catch (error) {
        // Handle any fetch-related errors
        console.error("Fetch error:", error);
        toast.error("Failed to fetch colors");
      }
    };
    fetchColors();
  }, []);

  return (
    <div className="mt-12">
      <Head>
        <title>Artsbyart Admin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2 className="text-center text-[25px] font-futura">Colors</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hex
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {colors.map((color) => (
            <tr key={color.id}>
              <td className="px-6 py-4 whitespace-nowrap">{color.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className="bg-gray-200 text-gray-800 rounded-full px-2 py-1 text-xs font-semibold"
                  style={{ backgroundColor: color.hex }}
                >
                  {color.hex}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleDeleteColor(color.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Colorlist;
