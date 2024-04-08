import { base_url } from "@/utils/baseUrl";
import axios from "axios";

const getProcedures = async () => {
  const response = await axios.get(`${base_url}products/procedures/`);

  return response.data;
};
const createProcedures = async (category) => {
  const response = await axios.post(`${base_url}products/procedures/`, category);

  return response.data;
};

const getProcedure = async (id) => {
  const response = await axios.get(`${base_url}products/procedures/${id}`);

  return response.data;
};

const deleteProcedure = async (id) => {
  const response = await axios.delete(`${base_url}products/procedures/${id}`);

  return response.data;
};
const updateProcedure = async (category) => {
  console.log(category);
  const response = await axios.put(
    `${base_url}products/procedures/${category.id}`,
    { title: category.pCatData.title },
  );

  return response.data;
};
const procedureService = {
  getProcedures,
  createProcedures,
  getProcedure,
  deleteProcedure,
  updateProcedure,
};

export default procedureService;
