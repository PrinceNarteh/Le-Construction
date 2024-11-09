import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL_ADMIN;

export const login = async ({ url, data }) => {
  const res = await axios.post(`${baseUrl}${url}`, data);
  return res.data;
};
