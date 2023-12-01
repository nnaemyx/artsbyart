import { base_url } from "@/utils/baseUrl";
import axios from "axios";

const login = async (admin) => {
  const response = await axios.post(`${base_url}admin/login`, admin);
  return response.data;
};


const adminService = {
    login,
};
  
export default adminService;