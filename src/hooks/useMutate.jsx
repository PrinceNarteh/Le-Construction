import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useUserSelector } from "./useUserSelector";

const baseURL = process.env.REACT_APP_BASE_URL_ADMIN;

const useMutate = (mutationKey = []) => {
  const { user } = useUserSelector();

  return useMutation({
    mutationKey: [...mutationKey],
    mutationFn: async ({
      url,
      data = {},
      method = "POST",
      multipart = false,
      options = {
        headers: {},
        params: {},
      },
    }) => {
      const info = {
        url: `${baseURL}${url}`,
        method,
        data,
        headers: {
          Authorization: `Bearer ${user?.auth_token}`,
          roleid: user?.role._id,
          "Content-Type": multipart
            ? "multipart/form-data"
            : "application/json",
        },
        params: options.params,
      };

      //console.log(info);

      const res = await axios(info);

      //console.log(info, res.data);
      return res.data;
    },
  });
};

export default useMutate;
