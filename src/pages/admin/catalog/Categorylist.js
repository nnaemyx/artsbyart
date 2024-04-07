import React, { useState, useEffect } from "react";
import Head from "next/head";
import { toast } from "react-toastify";

const Categorylist = () => {
  const [categories, setCategories] = useState([]);

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this product category?")) {
      try {
        const response = await fetch(`/api/products/category?id=${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          // Handle successful deletion
          toast.success("Product category deleted successfully");
          // Remove the deleted category from the state
          setCategories(categories.filter(category => category.id !== id));
        } else {
          // Handle errors (e.g., show an error message)
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Failed to delete product category");
        }
      } catch (error) {
        // Handle any fetch-related errors
        console.error("Error deleting product category:", error.message);
        toast.error("Failed to delete product category");
      }
    }
  };

  useEffect(() => {
    // Fetch the product categories when the component mounts
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/products/category");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          throw new Error("Failed to fetch product categories");
        }
      } catch (error) {
        // Handle any fetch-related errors
        console.error("Fetch error:", error);
        toast.error("Failed to fetch product categories");
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <Head>
        <title>Artsbyart Admin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-12">
        <h2 className="text-center text-[25px] font-futura">Product Categories</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">{category.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
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
    </div>
  );
};

export default Categorylist;
