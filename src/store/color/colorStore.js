import { create } from 'zustand';
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import colorService from './colorService';

const useColorStore = create(devtools(immer((set) => ({
  colors: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: '',

  getColors: async () => {
    try {
      set({ isLoading: true });
      const colors = await colorService.getColors();
      set({ colors, isLoading: false, isError: false, isSuccess: true });
    } catch (error) {
      set({ isLoading: false, isError: true, isSuccess: false, message: error });
    }
  },

  createColor: async (colorData) => {
    try {
      set({ isLoading: true });
      const createdColor = await colorService.createColor(colorData);
      set({ createdColor, isLoading: false, isError: false, isSuccess: true });

      const updatedColors = await colorService.getColors();
      set({ colors: updatedColors });
    } catch (error) {
      set({ isLoading: false, isError: true, isSuccess: false, message: error });
    }
  },

  getAColor: async (id) => {
    try {
      set({ isLoading: true });
      const colorName = await colorService.getColor(id);
      set({ colorName, isLoading: false, isError: false, isSuccess: true });
    } catch (error) {
      set({ isLoading: false, isError: true, isSuccess: false, message: error });
    }
  },

  updateAColor: async (color) => {
    try {
      set({ isLoading: true });
      const updatedColor = await colorService.updateColor(color);
      set({ updatedColor, isLoading: false, isError: false, isSuccess: true });
    } catch (error) {
      set({ isLoading: false, isError: true, isSuccess: false, message: error });
    }
  },

  deleteAColor: async (id) => {
    try {
      set({ isLoading: true });
      const deletedColor = await colorService.deleteColor(id);
      set({ deletedColor, isLoading: false, isError: false, isSuccess: true });
    } catch (error) {
      set({ isLoading: false, isError: true, isSuccess: false, message: error });
    }
  },

  resetState: () => {
    set({
      colors: [],
      isError: false,
      isLoading: false,
      isSuccess: false,
      message: '',
      createdColor: null,
      colorName: null,
      updatedColor: null,
      deletedColor: null,
    });
  },
}))));

export default useColorStore;
