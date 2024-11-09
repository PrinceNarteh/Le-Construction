import httpClient from "./api/httpClient";

export const postMutation = async ({ url, data }) => {
  const res = await httpClient.post(url, data);
  return res.data;
};

export const patchMutation = async (url, data) => {
  const res = await httpClient.patch(url, data);
  return res.data;
};

export const deleteMutation = async (url) => {
  const res = await httpClient.delete(url);
  return res.data;
};
