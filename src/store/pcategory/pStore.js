import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import pCategoryService from "./pcategoryService";


const useProductCategoryStore = create(devtools(immer((set) => ({
  pCategories: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
  createdCategory: null,
  updatedCategory: null,
  deletedCategory: null,
  categoryName: null,
  getCategories: async () => {
    set({ isLoading: true });
    try {
      const pCategories = await pCategoryService.getProductCategories();
      set({ pCategories, isError: false, isLoading: false, isSuccess: true });
    } catch (error) {
      set({ isError: true, isLoading: false, isSuccess: false, message: error });
    }
  },
  createCategory: async (categoryData) => {
    set({ isLoading: true });
    try {
      const createdCategory = await pCategoryService.createCategory(categoryData);
      set({
        createdCategory,
        isError: false,
        isLoading: false,
        isSuccess: true,
      });
    } catch (error) {
      set({ isError: true, isLoading: false, isSuccess: false, message: error });
    }
  },
  updateCategory: async (category) => {
    set({ isLoading: true });
    try {
      const updatedCategory = await pCategoryService.updateProductCategory(
        category
      );
      set({
        updatedCategory,
        isError: false,
        isLoading: false,
        isSuccess: true,
      });
    } catch (error) {
      set({ isError: true, isLoading: false, isSuccess: false, message: error });
    }
  },
  deleteCategory: async (id) => {
    set({ isLoading: true });
    try {
      const deletedCategory = await pCategoryService.deleteProductCategory(id);
      set({
        deletedCategory,
        isError: false,
        isLoading: false,
        isSuccess: true,
      });
    } catch (error) {
      set({ isError: true, isLoading: false, isSuccess: false, message: error });
    }
  },
  getCategory: async (id) => {
    set({ isLoading: true });
    try {
      const category = await pCategoryService.getProductCategory(id);
      set({ categoryName: category.title, isError: false, isLoading: false, isSuccess: true });
    } catch (error) {
      set({ isError: true, isLoading: false, isSuccess: false, message: error });
    }
  },
}))));
export default useProductCategoryStore;
