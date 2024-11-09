import { useQuery } from "@tanstack/react-query";
import { usePostMutation } from "./useQueryFns";
import { useUserSelector } from "./useUserSelector";
import { useDispatch } from "react-redux";
import { setValue } from "../app/feature/loadingBar/loadingBarSlice";

const usePostQuery = ({
  url,
  queryKey = [],
  data = {},
  enabled = true,
  showLoadingBar = true,
}) => {
  const { user } = useUserSelector();
  const { postMutation } = usePostMutation();
  const dispatch = useDispatch();

  return useQuery({
    queryKey: [...queryKey],
    queryFn: () =>
      postMutation({
        url,
        data: {
          company_id: user.company._id,
          ...data,
        },
        ...(showLoadingBar && {
          onDownloadProgress: (progressEvent) => {
            const value = Math.floor(
              (progressEvent.loaded / progressEvent.total) * 100,
            );
            dispatch(setValue(value));
          },
        }),
      }),
    enabled,
  });
};

export default usePostQuery;
