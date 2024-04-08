import { base_url } from "@/utils/baseUrl";
import axios from "axios";

const getProducts = async () => {
  const response = await axios.get(`${base_url}product/product`);

  return response.data;
};
const createProduct = async (product) => {
  const response = await axios.post(`${base_url}product/product`, product);

  return response.data;
};

const productService = {
  getProducts,
  createProduct,
};

export default productService;
