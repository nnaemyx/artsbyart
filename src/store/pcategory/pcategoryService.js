import { base_url } from "@/utils/baseUrl";
import axios from "axios";

const getProductCategories = async () => {
  const response = await axios.get(`${base_url}products/category/`);

  return response.data;
};
const createCategory = async (category) => {
  const response = await axios.post(`${base_url}products/category/`, category);

  return response.data;
};

const getProductCategory = async (id) => {
  const response = await axios.get(`${base_url}products/category/${id}`);

  return response.data;
};

const deleteProductCategory = async (id) => {
  const response = await axios.delete(`${base_url}products/category/${id}`);

  return response.data;
};
const updateProductCategory = async (category) => {
  console.log(category);
  const response = await axios.put(
    `${base_url}products/category/${category.id}`,
    { title: category.pCatData.title },
  );

  return response.data;
};
const pCategoryService = {
  getProductCategories,
  createCategory,
  getProductCategory,
  deleteProductCategory,
  updateProductCategory,
};

export default pCategoryService;
