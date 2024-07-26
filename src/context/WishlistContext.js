import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  saveWishlistToLocalStorage,
  getWishlistFromLocalStorage,
  clearWishlistFromLocalStorage,
} from "@/utils/Localstorage";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Load wishlist from localStorage on component mount
    const savedWishlist = getWishlistFromLocalStorage();
    if (savedWishlist) {
      setWishlist(savedWishlist);
    }
  }, []); // Only runs once on mount

  const fetchWishlist = async () => {
    try {
      const response = await axios.get("/api/wishlist");
      setWishlist(response.data.data.products);
      saveWishlistToLocalStorage(response.data.data.products); // Save to localStorage after fetching
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      await axios.post("/api/wishlist", { productId });
      fetchWishlist(); // Fetch wishlist again after adding
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`/api/wishlist/${productId}`);
      fetchWishlist(); // Fetch wishlist again after removing
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    clearWishlistFromLocalStorage(); // Clear localStorage
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
