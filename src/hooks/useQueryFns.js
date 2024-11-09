import axios from "axios";
import { useUserSelector } from "./useUserSelector";

const baseURL = process.env.REACT_APP_BASE_URL_ADMIN;

export const useGetQuery = () => {
  const { user } = useUserSelector();

  const getQuery = async (
    url,
    options = {
      headers: {},
      params: {},
    },
  ) => {
    const res = await axios.get(`${baseURL}${url}`, {
      headers: {
        Authorization: `Bearer ${user?.auth_token}`,
        roleid: user?.role._id,
        ...options.headers,
      },
      params: {
        ...options.params,
      },
      onDownloadProgress: (progressEvent) => {
        console.log(progressEvent);
      },
    });
    return res.data;
  };

  return { getQuery };
};

export const usePostMutation = () => {
  const { user } = useUserSelector();

  const postMutation = async ({
    url,
    data,
    multipart = false,
    options = {
      headers: {},
      params: {},
    },
    ...props
  }) => {
    const res = await axios.post(`${baseURL}${url}`, data, {
      headers: {
        Authorization: `Bearer ${user?.auth_token}`,
        roleid: user?.role._id,
        ...(multipart && { "Content-Type": "multipart/form-data" }),
      },
      params: {
        ...options.params,
      },
      ...props,
    });
    return res.data;
  };

  return { postMutation };
};

export const usePatchMutation = () => {
  const { user } = useUserSelector();

  const patchMutation = async ({
    url,
    data,
    multipart = false,
    options = {},
  }) => {
    const res = await axios.patch(`${baseURL}${url}`, data, {
      headers: {
        Authorization: `Bearer ${user?.auth_token}`,
        roleid: user?.role._id,
        ...(multipart && { "Content-Type": "multipart/form-data" }),
      },
      ...options,
    });
    return res.data;
  };

  return { patchMutation };
};

export const useDeleteMutation = () => {
  const { user } = useUserSelector();

  const deleteMutation = async ({ url, data = {}, options = {} }) => {
    const res = await axios.delete(`${baseURL}${url}`, {
      data: {
        ...data,
      },
      headers: {
        Authorization: `Bearer ${user?.auth_token}`,
        roleid: user?.role._id,
      },
      ...options,
    });
    return res.data;
  };

  return { deleteMutation };
};
