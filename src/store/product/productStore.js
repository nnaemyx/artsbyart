import { create } from 'zustand';
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import productService from './productService';

const useProductStore = create(devtools(immer((set) => ({
  products: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: '',
  createdProduct: null,
  selectedCurrency: 'NGN',
  exchangeRates: null,


  setCurrency: (currency) => {
    set({ userCurrency: currency });
  },

  setExchangeRates: (rates) => {
    set({ exchangeRates: rates });
  },

  getProducts: async () => {
    set({ isLoading: true });
    try {
      const products = await productService.getProducts(); // You should have productService defined
      set({ products, isError: false, isLoading: false, isSuccess: true });
    } catch (error) {
      set({ isError: true, isLoading: false, isSuccess: false, message: error });
    }
  },
  createProduct: async (productData) => {
    set({ isLoading: true });
    try {
      const createdProduct = await productService.createProduct(productData); // You should have productService defined
      set({
        createdProduct,
        isError: false,
        isLoading: false,
        isSuccess: true,
      });
    } catch (error) {
      set({ isError: true, isLoading: false, isSuccess: false, message: error });
    }
  },
  resetState: () => set({ ...initialState }), // initialState is defined below
}))));

const initialState = {
  products: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: '',
  createdProduct: null,
  selectedCurrency: 'NGN',
};

export default useProductStore;
