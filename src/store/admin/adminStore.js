import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import adminService from "./adminService";

const useAdminStore = create(
  devtools(
    immer((set) => ({
      admin: null,
      isAdmin: false,
      isError: false,
      isLoading: false,
      isSuccess: false,
      message: "",

      // Async function for logging in
      login: async (adminData) => {
        try {
          // Simulate the login process; replace with actual logic
          const admin = await adminService.login(adminData);
          // Set the user in the store
          set({ admin, isAdmin:true });

          return admin;
        } catch (error) {
          // Handle login error
          set({ isError: true, message: error.message });
          throw error;
        }
      },

      // Function to clear the user state (log out)
      logout: () =>
        set({
          admin: null,
          isAdmin: false,
          isError: false,
          isLoading: false,
          isSuccess: false,
          message: "",
        }),
    }))
  )
);

export default useAdminStore;
