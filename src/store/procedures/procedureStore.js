import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import procedureService from "./procedureService";


const useProcedureStore = create(devtools(immer((set) => ({
  procedures: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
  createdProcedure: null,
  updatedProcedures: null,
  deletedProcedure: null,
  procedureName: null,
  getProcedures: async () => {
    set({ isLoading: true });
    try {
      const procedures = await procedureService.getProcedures();
      set({ procedures, isError: false, isLoading: false, isSuccess: true });
    } catch (error) {
      set({ isError: true, isLoading: false, isSuccess: false, message: error });
    }
  },
  createProcedure: async (categoryData) => {
    set({ isLoading: true });
    try {
      const createdProcedure = await procedureService.createProcedures(categoryData);
      set({
        createdProcedure,
        isError: false,
        isLoading: false,
        isSuccess: true,
      });
    } catch (error) {
      set({ isError: true, isLoading: false, isSuccess: false, message: error });
    }
  },
  updateProcedures: async (category) => {
    set({ isLoading: true });
    try {
      const updatedProcedures = await procedureService.updateProcedure(
        category
      );
      set({
        updatedProcedures,
        isError: false,
        isLoading: false,
        isSuccess: true,
      });
    } catch (error) {
      set({ isError: true, isLoading: false, isSuccess: false, message: error });
    }
  },
  deleteProcedure: async (id) => {
    set({ isLoading: true });
    try {
      const deletedProcedure = await procedureService.deleteProcedure(id);
      set({
        deletedProcedure,
        isError: false,
        isLoading: false,
        isSuccess: true,
      });
    } catch (error) {
      set({ isError: true, isLoading: false, isSuccess: false, message: error });
    }
  },
  getProcedure: async (id) => {
    set({ isLoading: true });
    try {
      const procedure = await procedureService.getProcedure(id);
      set({ procedureName: procedure.description, isError: false, isLoading: false, isSuccess: true });
    } catch (error) {
      set({ isError: true, isLoading: false, isSuccess: false, message: error });
    }
  },
}))));
export default useProcedureStore;
