import httpClient from "../services/api/httpClient";

export const getAllCompanies = async () => {
  const res = await httpClient("/company/all");
  return res.data;
};
