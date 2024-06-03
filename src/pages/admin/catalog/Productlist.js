import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { toast } from "react-toastify";

const Productlist = () => {
  const [products, setProducts] = useState([]);

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`/api/product/product?id=${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Handle successful deletion
            toast.success("Product deleted successfully");
            // Remove the deleted product from the state
            setProducts(products.filter((product) => product._id !== id));
          } else {
            // Handle errors (e.g., show an error message)
            throw new Error(`Error deleting product: ${response.statusText}`);
          }
        })
        .catch((error) => {
          // Handle any fetch-related errors
          console.error("Fetch error:", error);
          toast.error("Failed to delete product");
        });
    }
  };

  useEffect(() => {
    // Fetch the products when the component mounts
    fetch("/api/products/product")
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

  return (
    <div className="mt-12">
      <Head>
        <title>Mma-Inspire Admin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2 className="text-[25px] font-semibold font-futura">Products</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              S/No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
          
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
        
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products?.map((product, index) => (
            <tr key={product._id}>
              <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
              <div className="flex items-center">
                <Image src={product.images[0]} className="my-4 border rounded-[4px] border-solid border-dark" width={60} height={60} alt="image"/>
                <td className="px-6 py-4 whitespace-nowrap">{product.title}</td> 
              </div>
              <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.price}</td>
             
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  className="text-red-600 hover:text-red-900"
                  onClick={() => handleDeleteProduct(product._id)}
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

export default Productlist;
