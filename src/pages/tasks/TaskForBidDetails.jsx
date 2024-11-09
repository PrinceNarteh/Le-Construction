import { formatDistanceToNowStrict } from "date-fns";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

import CustomSelect from "../../components/shared/CustomSelect";
import { queryKeys } from "../../constants";
import { useGetQuery } from "../../hooks/useGetQuery";
import useMutate from "../../hooks/useMutate";
import { useUserSelector } from "../../hooks/useUserSelector";

const TaskForBidDetails = ({ task = null, setOpenModal }) => {
  const { user } = useUserSelector();
  const [builder, setBuilder] = useState("");
  const { data, isLoading } = useGetQuery({
    queryKey: [queryKeys.Builders],
    url: "/my/builders",
    options: {
      headers: {
        companyid: user._id,
      },
    },
  });

  const { mutate } = useMutate([queryKeys.AssignTaskToBuilder]);
  const submit = (e) => {
    e.preventDefault();

    if (!builder) {
      toast.error("Please kindly select builder");
      return;
    }
    const toastId = toast.loading("Assigning task to builder...");

    mutate(
      {
        url: "/task/assign/builder",
        method: "POST",
        data: {
          builder_id: builder,
          project_id: task.project_id,
          task_id: task._id,
        },
      },
      {
        onSuccess(data) {
          toast.dismiss(toastId);
          toast.success("Task assigned to builder successfully");
          setOpenModal(false);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      }
    );
  };

  const builders = data?.message ?? [];
  const buildersData = builders.map((builder) => ({
    id: builder._id,
    label: `${builder.f_name} ${builder.l_name}`,
  }));

  const getBuilderName = (builderId) => {
    const builder = builders.find((builder) => builder._id === builderId);
    if (!builder) return "";
    return `${builder.f_name} ${builder.l_name}`;
  };

  return (
    <div className="px-12">
      <div className="h-36 bg-primary bg-[url('/public/images/wave.png')] rounded-xl relative">
        <div className=" ml-9 top-0 text-white text-2xl font-bold absolute mt-7">
          <h3 className="">Task For Bid Details</h3>
        </div>

        <div className="h-20 w-[97%] mr-10 bg-white/75 backdrop-blur-lg  rounded-xl  absolute ml-4 -bottom-10 border border-primary flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={task?.task_thumbnail}
              alt=""
              className="h-14 w-14 ml-5 object-cover rounded-lg"
            />
            <div className="ml-3">
              <div className="h-[25px] text-blue-900 text-lg font-bold leading-7">
                {task?.task_name}
              </div>
              <div className="text-slate-500 font-normal leading-tight">
                {task?.task_description}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white mt-14 p-5 rounded-md mx-auto">
        <div className="flex flex-col gap-10 items-center lg:flex-row ">
          <div className="shrink-0 basis-60">
            <img
              src={task?.task_thumbnail}
              alt=""
              className="rounded-xl object-cover w-full h-full"
            />
          </div>

          <div className="">
            <div className="w-fit mb-4 text-blue-900 text-2xl font-bold leading-[33.60px]">
              Bid Information
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <p className="text-slate-500 text-md font-normal leading-[27px] w-60">
                  Minimum Bid Amount:
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-blue-900 text-md font-bold leading-[27px] mr-2">
                    {task?.minimum_bid_amount}
                  </div>
                </div>
              </div>

              <div className="flex">
                <div className="text-slate-500 text-md font-normal leading-[27px] w-60">
                  Current Bid Amount:
                </div>
                <div className="text-blue-900 text-md font-bold leading-[27px]">
                  {task?.current_bid_amount}
                </div>
              </div>

              <div className="flex">
                <div className="text-slate-500 text-md font-normal leading-[27px] w-60">
                  Due Date:{" "}
                </div>
                <div className="text-blue-900 text-md font-bold leading-[27px]">
                  {formatDistanceToNowStrict(new Date(task?.bid_set_date), {
                    addSuffix: true,
                  })}
                </div>
              </div>

              <div className="flex">
                <div className="text-slate-500 text-md font-normal leading-[27px] w-60">
                  Project Location:
                </div>
                <div className="text-blue-900 text-md font-bold leading-[27px]">
                  {task?.address?.street}, {task?.address?.state},{" "}
                  {task?.address?.city}, {task?.address?.country}
                </div>
              </div>

              <div className="flex">
                <div className="text-slate-500 text-md font-normal leading-[27px] w-60">
                  Assigned Builder:
                </div>
                <div className="text-blue-900 text-md font-bold leading-[27px]">
                  <ul className="list-disc">
                    {task.assigned_builders.map((builder) => (
                      <li>{getBuilderName(builder)}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <form onSubmit={submit}>
                <div className="flex">
                  <div className="text-slate-500 text-md font-normal leading-[27px] w-60">
                    Assign Builder:
                  </div>
                  <div className="text-blue-900 text-md font-bold leading-[27px] flex-1">
                    <CustomSelect
                      placeholder="Select Builder..."
                      data={buildersData}
                      onChange={setBuilder}
                      loading={isLoading}
                    />
                  </div>
                </div>

                <div className="flex pt-3">
                  <div className="text-slate-500 text-md font-normal leading-[27px] w-60"></div>
                  <div className="flex gap-4">
                    <button className="py-2 px-5 bg-primary text-white rounded-md">
                      Review
                    </button>
                    <button className="py-2 px-5 bg-primary text-white rounded-md">
                      Assign
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForBidDetails;
