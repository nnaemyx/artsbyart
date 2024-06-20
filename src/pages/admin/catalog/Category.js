import Head from "next/head";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Category = () => {
  const [categoryName, setCategoryName] = useState("");

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (categoryName.trim() === "") {
      // Handle validation or show an error message.
      return;
    }

    try {
      const response = await fetch("/api/products/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: categoryName }),
      });
      if (!response.ok) {
        throw new Error("Failed to add category");
      }
      const data = await response.json();
      toast.success("Product category added successfully");
      setCategoryName(""); // Clear the category name input field
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add product category");
    }
  };

  return (
    <div>
      <Head>
        <title>Artsbyart Admin</title>
        <meta name="description" content="Artsbyart is a premier creative agency specialized in branding and print solutions, serving businesses of all sizes and across all industries. We partner with our clients to develop, maintain, and enhance their brands through strategic planning, innovative design, and effective communication" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full">
        <h2 className="text-center text-[25px] font-opensans mt-12">
          Add Product Category
        </h2>
        <form
          onSubmit={addCategory}
          className="flex mb-4 flex-col mx-auto gap-8 mt-6 justify-center"
        >
          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={handleCategoryNameChange}
            className="px-4 py-4 focus:outline-none border border-dark border-solid"
          />
          <button
            type="submit"
            className="mt-[24px] text-[12px] md:text-[14px] font-semibold bg-dark text-white px-[0px] tracking-[1.5px] py-[18px]"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default Category;
