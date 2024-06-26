import React, { useState, useEffect } from "react";
import Head from "next/head";
import { toast } from "react-toastify";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this product category?")) {
      try {
        const response = await fetch(`/api/products/${categoryId}/category`, {
          method: "DELETE",
        });
        if (response.ok) {
          toast.success("Product category deleted successfully");
          setCategories(categories.filter((cat) => cat._id !== categoryId));
        } else {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Failed to delete product category");
        }
      } catch (error) {
        console.error("Error deleting product category:", error.message);
        toast.error("Failed to delete product category");
      }
    }
  };

  const handleUpdateCategory = async (categoryId) => {
    if (newCategoryName.trim() === "") {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`/api/products/${categoryId}/category`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newCategory: newCategoryName }),
      });

      if (response.ok) {
        toast.success("Product category updated successfully");
        setCategories(
          categories.map((cat) =>
            cat._id === categoryId ? { ...cat, title: newCategoryName } : cat
          )
        );
        setEditingCategory(null);
        setNewCategoryName("");
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to update product category");
      }
    } catch (error) {
      console.error("Error updating product category:", error.message);
      toast.error("Failed to update product category");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/products/category');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          throw new Error("Failed to fetch product categories");
        }
      } catch (error) {
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
        <meta name="description" content="Artsbyart is a premier creative agency specialized in branding and print solutions, serving businesses of all sizes and across all industries. We partner with our clients to develop, maintain, and enhance their brands through strategic planning, innovative design, and effective communication" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-12">
        <h2 className="text-center text-[25px] font-futura">Product Categories</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCategory === category._id ? (
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="New Category Name"
                    />
                  ) : (
                    category.title
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCategory === category._id ? (
                    <>
                      <button
                        onClick={() => handleUpdateCategory(category._id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingCategory(null);
                          setNewCategoryName("");
                        }}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingCategory(category._id);
                          setNewCategoryName(category.title);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;
