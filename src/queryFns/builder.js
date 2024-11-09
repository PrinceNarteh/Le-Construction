import httpClient from "../services/api/httpClient";

export const createBuilder = async (data) => {
  const res = await httpClient.post("/builder/register", data);
  return res.data;
};
