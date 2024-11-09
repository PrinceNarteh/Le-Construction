import { Icon } from "@iconify/react";
import { format } from "libphonenumber-js";
import React, { useState } from "react";
import DetailsCard from "../../components/shared/DetailsCard";
import { useUserSelector } from "../../hooks/useUserSelector";
import usePostQuery from "../../hooks/usePostQuery";
import { queryKeys } from "../../constants";
import TaskCard from "../../components/shared/TaskCard";
import TaskDetails from "../tasks/TaskDetails";

function BuilderDetails({
  builder,
  openDetails,
  closeDetails,
  handleDelete,
  handleEdit,
}) {
  const { user } = useUserSelector();
  const [task, setTask] = useState(null);
  const setOpenTask = useState(false)[1];

  const edit = () => {
    handleEdit(builder);
    closeDetails();
  };

  // Builders Groups
  const { data, isLoading } = usePostQuery({
    queryKey: [queryKeys.BuildersGroups, builder?.group?._id],
    url: "/builder/group",
    enabled: !!builder,
    data: {
      group_id: builder?.group?._id,
    },
  });

  return (
    <DetailsCard
      heading={"Sub Contractor Details"}
      image={builder?.profile_image}
      title={`${builder?.f_name} ${builder?.l_name}`}
      description={builder?.email}
      openDetails={openDetails}
      closeDetails={closeDetails}
      actionButtons={() => (
        <>
          <button onClick={() => edit()}>
            <Icon
              icon="iconamoon:edit-light"
              className="text-2xl cursor-pointer"
            />
          </button>
          <button onClick={() => handleDelete(builder)}>
            <Icon
              icon="fluent:delete-28-regular"
              className="text-2xl cursor-pointer text-red-500"
            />
          </button>
        </>
      )}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-14">
        <div className="w-full bg-white rounded-xl p-8 space-y-4">
          <div className="w-[457px] text-blue-900 text-2xl font-bold leading-[33.60px]">
            Sub Contractors's Information
          </div>

          <div className="space-y-3">
            <div className="w-full flex items-center">
              <div className="text-slate-500 text-md font-normal leading-[27px] w-32">
                Company:
              </div>
              <div className="flex-1 w-full flex justify-between">
                <div className="text-blue-900 text-md font-bold leading-[27px]">
                  {user.user_type === "company"
                    ? user.company_name
                    : user?.company.company_name}
                </div>
                <img
                  src={builder?.company_settings?.branding?.company_logo}
                  alt=""
                  className="h-10 w-10 object-cover rounded-full ml-2"
                />
              </div>
            </div>

            <div className="flex">
              <div className="text-slate-500 text-md font-normal leading-[27px] w-32">
                Email:
              </div>
              <div className="flex-1 text-blue-900 text-md font-bold leading-[27px]">
                {builder?.email}
              </div>
            </div>

            <div className="flex">
              <div className="text-slate-500 text-md font-normal leading-[27px] w-32">
                Group:
              </div>
              <div className="flex-1 text-blue-900 text-md font-bold leading-[27px]">
                {isLoading ? (
                  <li className="p-2 text-sm hover:bg-sky-600 hover:text-white rounded flex items-end">
                    <span>Loading</span>
                    <Icon
                      icon="eos-icons:three-dots-loading"
                      className="text-base"
                    />
                  </li>
                ) : (
                  <span>{data?.message.group_name}</span>
                )}
              </div>
            </div>

            <div className="flex">
              <div className="text-slate-500 text-md font-normal leading-[27px] w-32">
                Mobile:{" "}
              </div>
              <div className="flex-1 text-blue-900 text-md font-bold leading-[27px]">
                {builder ? format(builder.phone, "INTERNATIONAL") : ""}
              </div>
            </div>

            <div className="flex">
              <div className="text-slate-500 text-md font-normal leading-[27px] w-32">
                Address:
              </div>
              <div className="flex-1 text-blue-900 text-md font-bold leading-[27px]">
                {builder?.address?.state}, {builder?.address?.city}{" "}
                {builder?.address?.street}
              </div>
            </div>

            <div className="flex">
              <div className="text-slate-500 text-md font-normal leading-[27px] w-28">
                Zip:
              </div>
              <div className="ml-9 text-blue-900 text-md font-bold leading-[27px]">
                {builder?.address?.zip}
              </div>
            </div>
          </div>
        </div>

        <div className=" w-full bg-white rounded-xl p-8 space-y-4">
          <div>
            <div className=" h-[33.70px] text-blue-900 text-2xl font-bold leading-[33.60px]">
              Tasks
            </div>
          </div>

          <div className="space-y-3">
            {/* check if contractors has data, if true map through else show text No Contractors Yet */}
            {builder?.tasks?.length > 0 ? (
              builder?.tasks?.map((task, idx) => (
                <TaskCard key={idx} task={task} />
              ))
            ) : (
              <div className="text-blue-900 text-md font-bold leading-[27px]">
                No Projects Yet
              </div>
            )}
          </div>
        </div>

        {/* Task Details */}
        <TaskDetails task={task} setTask={setTask} setOpenTask={setOpenTask} />
      </div>
    </DetailsCard>
  );
}

export default BuilderDetails;
