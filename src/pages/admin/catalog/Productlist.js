"use client";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { toast } from "react-toastify";

const Productlist = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAvailability, setNewAvailability] = useState(true);

  useEffect(() => {
    fetch("/api/products/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      });
  }, []);

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`/api/products/${productId}/product`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            toast.success("Product deleted successfully");
            setProducts((products) =>
              products.filter((product) => product._id !== productId)
            );
          } else {
            throw new Error(`Error deleting product: ${response.statusText}`);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          toast.error("Failed to delete product");
        });
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product._id);
    setNewTitle(product.title);
    setNewCategory(product.category);
    setNewPrice(product.price);
    setNewDescription(product.description);
    setNewAvailability(product.available);
  };

  const handleUpdateProduct = async (productId) => {
    if (
      newTitle.trim() === "" ||
      newCategory.trim() === "" ||
      newPrice.trim() === "" ||
      newDescription.trim() === ""
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}/product`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newProduct: {
            title: newTitle,
            category: newCategory,
            price: newPrice,
            description: newDescription,
            available: newAvailability,
          },
        }),
      });

      if (response.ok) {
        const { updatedProduct } = await response.json();
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId ? updatedProduct : product
          )
        );
        setEditingProduct(null);
        setNewTitle("");
        setNewCategory("");
        setNewPrice("");
        setNewDescription("");
        setNewAvailability(true);
        toast.success("Product updated successfully");
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error.message);
      toast.error("Failed to update product");
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setNewTitle("");
    setNewCategory("");
    setNewPrice("");
    setNewDescription("");
    setNewAvailability(true);
  };

  return (
    <div className="mt-12 mx-4 md:mx-12">
      <Head>
        <title>Artsbyart Admin</title>
        <meta
          name="description"
          content="Artsbyart is a premier creative agency specialized in branding and print solutions, serving businesses of all sizes and across all industries. We partner with our clients to develop, maintain, and enhance their brands through strategic planning, innovative design, and effective communication"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2 className="text-[25px] font-semibold font-futura mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border rounded-lg p-4">
            <div className="flex items-center mb-4">
              <Image
                src={product.images[0]}
                className="border rounded-[4px] border-solid border-dark"
                width={40}
                height={40}
                alt="image"
              />
              {editingProduct === product._id ? (
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="border p-2 ml-4 w-full"
                />
              ) : (
                <div className="ml-4">{product.title}</div>
              )}
            </div>
            <div className="mb-4">
              <strong>Category:</strong>{" "}
              {editingProduct === product._id ? (
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="border p-2 w-full"
                />
              ) : (
                product.category
              )}
            </div>
            <div className="mb-4">
              <strong>Price:</strong>{" "}
              {editingProduct === product._id ? (
                <input
                  type="text"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="border p-2 w-full"
                />
              ) : (
                product.price
              )}
            </div>
            <div className="mb-4">
              <strong>Description:</strong>{" "}
              {editingProduct === product._id ? (
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="border p-2 w-full"
                />
              ) : (
                <p className="truncate">{product.description}</p>
              )}
            </div>
            <div className="mb-4">
              <strong>Availability:</strong>{" "}
              {editingProduct === product._id ? (
                <select
                  value={newAvailability}
                  onChange={(e) =>
                    setNewAvailability(e.target.value === "true")
                  }
                  className="border p-2 w-full"
                >
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              ) : product.available ? (
                "Available"
              ) : (
                "Not Available"
              )}
            </div>
            <div className="flex justify-between">
              {editingProduct === product._id ? (
                <>
                  <button
                    onClick={() => handleUpdateProduct(product._id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-red-600 hover:text-red-900 ml-4"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 ml-4"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productlist;
