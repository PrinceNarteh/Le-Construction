// client milestones
//
// const { user } = useUserSelector();
// const baseUrl = useBaseUrl();
// const { data: milestones, isLoading } = useQuery({
//   queryKey: ["client-milestones"],
//   queryFn: async () => {
//     const res = await baseUrl.post(`/client/milestones`, {
//       client_id: "client_id",
//     });
//
//     return res.data;
//   },
// });
//
//
//
//
//
// Open task for bidding
//
// const {register, handleSubmit, formState: { errors } } = useForm({
//  defaultValues: {
//      task_id: "",
//      minimum_bid_amount: 0,
//      bid_duration: "",
//      builder_id: "",
//      builder_email: ""
//  }
// })
// const { postMutation } = usePostMutation()
// const { mutate } = useMutation({
//      mutationKey: ["open-task-for-bidding"],
//      mutationFn: postMutation
// })
// const submitHandler = (data) => {
//   const toastId = toast.loading("Opening task for bidding...");
//
//   mutate(
//     {
//       url: "/open/task/for/bid",
//       data,
//     },
//     {
//       onSuccess(data) {
//         toast.dismiss(toastId);
//         toast.success("Task open for bidding successfully");
//       },
//       onError(error) {
//         toast.dismiss(toastId);
//         toast.error(error.response.data.message);
//       },
//     }
//   );
// };
//
//
//
//
//
//
//
//
// Place task for bid
//
// const {register, handleSubmit, formState: { errors } } = useForm({
//  defaultValues: {
//      task_id: "",
//      builder_id: "",
//      bid_amount: 0,
//      bid_file: "",
//  }
// })
// const { postMutation } = usePostMutation()
// const { mutate } = useMutation({
//      mutationKey: ["place-task-for-bid"],
//      mutationFn: postMutation
// })
// const submitHandler = (data) => {
//   const toastId = toast.loading("Placing bid for task...");
//   const formData = new FormData()
//
//  Object.values(data).map(item => {
//      formData.append(...item)
//  })

//  for (let image in images) {
//      formData.append("bid_files", image)
//  }
//
//   mutate(
//     {
//       url: "/open/task/for/bid",
//       data,
//       multipart: true,
//     },
//     {
//       onSuccess(data) {
//         toast.dismiss(toastId);
//         toast.success("Bid place for task successfully");
//       },
//       onError(error) {
//         toast.dismiss(toastId);
//         toast.error(error.response.data.message);
//       },
//     }
//   );
// };
//
//
//
//
//
// Update Bid For Task
//
// const {register, handleSubmit, formState: { errors } } = useForm({
//  defaultValues: {
//      task_id: "",
//      builder_id: "",
//      bid_amount: 0,
//  }
// })
// const { mutate } = useMutation({
//      mutationKey: ["place-task-for-bid"],
//      mutationFn: async (data) => {
//      const res = await baseUrl.patch(`/client/milestones`, data);
//      return res.data;
//   }
// })
// const submitHandler = (data) => {
//   const toastId = toast.loading("Updating bid for task...");
//
//   mutate(data,
//     {
//       onSuccess(data) {
//         toast.dismiss(toastId);
//         toast.success("Bid updated successfully");
//       },
//       onError(error) {
//         toast.dismiss(toastId);
//         toast.error(error.response.data.message);
//       },
//     }
//   );
// };

// My Bids for Tasks
//
// const baseUrl = useBaseUrl()
// const { data: clients, isLoading } = useQuery({
//   queryKey: ["clients"],
//   queryFn: async () => {
//   const res = await baseUrl.post("/builder/my/bids", { builder_id: builder_id },
//   return res.data
// }
//     }),
// });
//
//
// Get Builder's Todos
//
// const baseUrl = useBaseUrl()
// const { data: todos, isLoading } = useQuery({
//   queryKey: ["builder-todos"],
//   queryFn: async () => {
//   const res = await baseUrl.post("/builder/tasks/todos", { builder_id: builder_id },
//   return res.data
// }
//     }),
// });
//
//
//
// Assign Task To Builder
//
// const {register, handleSubmit, formState: { errors } } = useForm({
//  defaultValues: {
//      project_id: "",
//      task_id: "",
//      builder_id: "",
//  }
// })
// const { postMutation } = usePostMutation()
// const { mutate } = useMutation({
//      mutationKey: ["assign-task-to-builder"],
//      mutationFn: postMutation
// })
// const submitHandler = (data) => {
//   const toastId = toast.loading("Assigning task to builder...");
//
//   mutate(
//     {
//       url: "/task/assign/builder",
//       data,
//     },
//     {
//       onSuccess(data) {
//         toast.dismiss(toastId);
//         toast.success("Task assigned to builder successfully");
//       },
//       onError(error) {
//         toast.dismiss(toastId);
//         toast.error(error.response.data.message);
//       },
//     }
//   );
// };
