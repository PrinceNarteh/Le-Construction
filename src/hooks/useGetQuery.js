import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUserSelector } from "./useUserSelector";
import { useDispatch } from "react-redux";
import { setValue } from "../app/feature/loadingBar/loadingBarSlice";

const baseURL = process.env.REACT_APP_BASE_URL_ADMIN;

export const useGetQuery = ({
  queryKey = [],
  url,
  options = {
    headers: {},
    params: {},
  },
  enable = true,
  showLoadingBar = true,
}) => {
  const { user } = useUserSelector();
  const dispatch = useDispatch();

  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await axios.get(`${baseURL}${url}`, {
        headers: {
          Authorization: `Bearer ${user?.auth_token}`,
          roleid: user?.role._id,
          ...options.headers,
        },
        params: {
          ...options.params,
        },
        ...(showLoadingBar && {
          onDownloadProgress: (progressEvent) => {
            const value = Math.floor(
              (progressEvent.loaded / progressEvent.total) * 100,
            );
            dispatch(setValue(value));
          },
        }),
      });
      return res.data;
    },
    enabled: enable,
  });
};
