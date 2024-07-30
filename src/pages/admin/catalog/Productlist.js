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
  const [newImages, setNewImages] = useState([]);
  const [newVideo, setNewVideo] = useState(null);

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
            return response.text().then(text => { throw new Error(text) });
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          toast.error(`Failed to delete product: ${error.message}`);
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
    setNewImages(product.images);
    setNewVideo(product.video);
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

    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("category", newCategory);
    formData.append("price", newPrice);
    formData.append("description", newDescription);
    formData.append("available", newAvailability);
    if (newVideo) {
      formData.append("video", newVideo);
    }
    newImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await fetch(`/api/products/${productId}/product`, {
        method: "PUT",
        body: formData,
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
        setNewImages([]);
        setNewVideo(null);
        toast.success("Product updated successfully");
      } else {
        const errorMessage = await response.text();
        throw new Error(`Error updating product: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to update product");
    }
  };

  const handleDeleteImage = (productId, imageId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      fetch(`/api/products/${productId}/product`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId }),
      })
        .then((response) => {
          if (response.ok) {
            toast.success("Image deleted successfully");
            setProducts((products) =>
              products.map((product) =>
                product._id === productId
                  ? {
                      ...product,
                      images: product.images.filter((img) => img !== imageId),
                    }
                  : product
              )
            );
          } else {
            return response.text().then(text => { throw new Error(text) });
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          toast.error(`Failed to delete image: ${error.message}`);
        });
    }
  };
  
  const handleDeleteVideo = (productId, videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      fetch(`/api/products/${productId}/product`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId }),
      })
        .then((response) => {
          if (response.ok) {
            toast.success("Video deleted successfully");
            setProducts((products) =>
              products.map((product) =>
                product._id === productId
                  ? {
                      ...product,
                      video: null,
                    }
                  : product
              )
            );
          } else {
            return response.text().then(text => { throw new Error(text) });
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          toast.error(`Failed to delete video: ${error.message}`);
        });
    }
  };
  

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>

      <div className="">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Category</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Available</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="border border-gray-300 p-2">{product.title}</td>
                <td className="border border-gray-300 p-2">{product.category}</td>
                <td className="border border-gray-300 p-2">{product.price}</td>
                <td className="border border-gray-300 p-2">
                  {product.description}
                </td>
                <td className="border border-gray-300 p-2">
                  {product.available ? "Yes" : "No"}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
              <div>
                <label className="block mb-2 font-bold">Title</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-bold">Category</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-bold">Price</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-bold">Description</label>
                <textarea
                  className="w-full border border-gray-300 p-2 rounded"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-bold">Availability</label>
                <select
                  className="w-full border border-gray-300 p-2 rounded"
                  value={newAvailability}
                  onChange={(e) => setNewAvailability(e.target.value === "true")}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-bold">Images</label>
                {newImages.map((image, index) => (
                  <div key={index} className="relative inline-block mr-2">
                    <Image
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      width={100}
                      height={100}
                      className="border border-gray-300"
                    />
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                      onClick={() => handleDeleteImage(editingProduct, image)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <input
                  type="file"
                  className="w-full border border-gray-300 p-2 rounded mt-2"
                  onChange={(e) =>
                    setNewImages([...newImages, ...Array.from(e.target.files)])
                  }
                  multiple
                />
              </div>
              <div>
                <label className="block mb-2 font-bold">Video</label>
                {newVideo && (
                  <div className="relative inline-block mr-2">
                    <video
                      src={newVideo}
                      alt="Product Video"
                      width={200}
                      controls
                      className="border border-gray-300"
                    />
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                      onClick={() => handleDeleteVideo(editingProduct, newVideo)}
                    >
                      &times;
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  className="w-full border border-gray-300 p-2 rounded mt-2"
                  onChange={(e) => setNewVideo(e.target.files[0])}
                  accept="video/*"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => handleUpdateProduct(editingProduct)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Productlist;
