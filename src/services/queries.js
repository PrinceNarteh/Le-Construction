import httpClient from "./api/httpClient";

export const getQuery = async (url, options = {}) => {
  const res = await httpClient.get(url, options);
  return res.data;
};
