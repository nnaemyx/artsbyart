import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CustomContext = createContext();

export const useCustomContext = () => useContext(CustomContext);

export const CustomContextProvider = ({ children }) => {
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [isBottomOpen, setIsBottomOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const openLeft = () => setIsLeftOpen(true);
  const closeLeft = () => setIsLeftOpen(false);

  const openRight = () => setIsRightOpen(true);
  const closeRight = () => setIsRightOpen(false);

  const openBottom = () => setIsBottomOpen(true);
  const closeBottom = () => setIsBottomOpen(false);

  const fetchProductsAndCategories = async () => {
    try {
      const response = await axios.get("/api/products/product");
      const data = response.data;
  
      // Extract products and categories from the grouped data
      const extractedProducts = [];
      const extractedCategories = [];
  
      for (const category in data) {
        if (data.hasOwnProperty(category)) {
          extractedCategories.push({ title: category });
          data[category].products.forEach((product) => {
            extractedProducts.push({ ...product, category });
          });
        }
      }
  
      setProducts(extractedProducts);
      setCategories(extractedCategories);
    } catch (error) {
      console.error("Error fetching products and categories", error);
    }
  };
  

  useEffect(() => {
    fetchProductsAndCategories(); // Initial fetch
  }, []);

  return (
    <CustomContext.Provider
      value={{
        isLeftOpen,
        isRightOpen,
        isBottomOpen,
        openLeft,
        closeLeft,
        openRight,
        closeRight,
        openBottom,
        closeBottom,
        products,
        categories,
        fetchProductsAndCategories,
      }}
    >
      {children}
    </CustomContext.Provider>
  );
};
