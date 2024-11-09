import axios from "axios";
import { useUserSelector } from "./useUserSelector";
import { useQuery } from "@tanstack/react-query";

const baseURL = process.env.REACT_APP_SOCKET_URL;

// // const response = await axios.post(
// //   `${baseURL}/chat/messages`,
// //   {
// //     user1_id: user_1,
// //     user2_id: user_2,
// //   },
// //   {
// //     headers: {
// //       Authorization: `Bearer ${user?.auth_token}`,
// //       roleid: user?.role._id,
// //       "Content-Type": "application/json",
// //     },
// //   }
// // );
// // return response.data.message;

// const { user } = useUserSelector();
// const { postMutation } = usePostMutation();
// return useQuery({
//   queryKey: [...queryKey],
//   queryFn: () =>
//     postMutation({
//       url,
//       data: {
//         // company_id: "64dab6840dfc8961c4a5525e",
//         company_id: user.user_type === "company" ? user._id : user.company._id,
//         ...data,
//       },
//     }),
//   enabled,
// });

// const { user } = useUserSelector();

// const postMutation = async ({
//   url,
//   data,
//   multipart = false,
//   options = {
//     headers: {},
//     params: {},
//   },
// }) => {};

// return { postMutation };

const useBaseUrl = ({ data }) => {
  const { user } = useUserSelector();

  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await axios.post(`${baseURL}`, data, {
        headers: {
          Authorization: `Bearer ${user?.auth_token}`,
          roleid: user?.role._id,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
  });
};

export default useBaseUrl;
