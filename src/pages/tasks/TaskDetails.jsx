import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomSelect from "../../components/shared/CustomSelect";
import DetailsCard from "../../components/shared/DetailsCard";
import Modal from "../../components/shared/Modal";
import { queryKeys } from "../../constants";
import useConfirm from "../../hooks/useConfirm";
import { useGetQuery } from "../../hooks/useGetQuery";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";
import { useUserSelector } from "../../hooks/useUserSelector";
import taskStatus from "../../utils/taskStatus";
import { useCompanySettingsSelector } from "../../hooks/useCompanySettings";
import { checkNullity } from "../../utils/checkNullity";

function TaskDetails({
  task = null,
  projectId = null,
  setTask,
  setOpenTask = () => {},
}) {
  //console.log({ task });
  const { user } = useUserSelector();
  const { companySettings } = useCompanySettingsSelector();
  const queryClient = useQueryClient();
  const [inviteId, setInviteId] = useState("");
  const [builderId, setBuilderId] = useState("");
  const [sendTo, setSendTo] = useState("builder");
  const [assignModal, setAssignModal] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const [category, setCategory] = useState({
    category: "builder",
    id: "",
  });

  const { data, isLoading } = useGetQuery({
    queryKey: [queryKeys.Builders],
    url: "/my/builders",
    options: {
      headers: {
        companyid: user.user_type === "company" ? user._id : user.company._id,
      },
    },
  });
  const taskBuilders = data
    ? data?.message.filter((builder) =>
        task?.assigned_builders.includes(builder._id)
      )
    : [];

  // Builders
  const builders = data
    ? data?.message
        .filter((builder) => !task?.assigned_builders.includes(builder._id))
        .map((builder) => ({
          id: builder._id,
          label: `${builder.f_name} ${builder.l_name}`,
        }))
    : [];

  // Builders Groups
  const { data: buildersGroupsData } = usePostQuery({
    queryKey: [queryKeys.BuildersGroups],
    url: "/builder/groups",
  });
  const buildersGroups = buildersGroupsData?.message.map((item) => ({
    id: item._id,
    label: `${item.group_name}`,
  }));

  const { mutate } = useMutate([queryKeys.AssignTaskToBuilder]);
  const handleMutation = (data) => {
    const toastId = toast.loading(`Assigning task to Sub-Contractor...`);

    mutate(
      {
        url: "/task/assign/builder",
        data,
      },
      {
        async onSuccess(data) {
          await queryClient.setQueryData(
            [queryKeys.TasksForCompany],
            (oldData) => {
              return {
                message: (oldData?.message ?? []).map((item) => {
                  if (item._id === data.message._id) {
                    return data.message;
                  }
                  return item;
                }),
              };
            }
          );
          setTask(data.message);
          toast.dismiss(toastId);
          toast.success("Task assigned Sub-Contractor successfully");
          setAssignModal(false);
          setIsOpen(false);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
          setIsOpen(false);
        },
      }
    );
  };

  const assignedSubmit = (e) => {
    e.preventDefault();

    if (!builderId) {
      toast.error("Please select a Sub-Contractor");
      return;
    }

    const data = {
      task_id: task?._id,
      builder_id: builderId,
      project_id: task?.project_id,
    };

    handleMutation(data);
  };

  const assignBuilder = async (bider) => {
    const data = {
      task_id: task?._id,
      builder_id: bider?._id,
      project_id: task?.project_id,
    };

    const isConfirmed = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to assign "${task?.task_name}" to ${bider?.f_name} ${bider?.l_name}?`,
      confirmButtonLabel: "Yes, Assign",
      fullWidth: true,
    });

    if (isConfirmed) {
      handleMutation(data);
    }
  };

  const submitInvite = (e) => {
    e.preventDefault();
    if (sendTo === "builder" && category.id === "") {
      toast.error("Please select which Sub-Contractor to submit");
      return;
    } else if (sendTo === "group" && category.id === "") {
      toast.error("Please select which group to submit");
      return;
    }

    const toastId = toast.loading("Submitting invite...");

    const data = {
      task_id: task._id,
      ...(category.category === "builder"
        ? { builder_id: category.id }
        : { group_id: category.id }),
    };

    mutate(
      {
        url: "/invite/builder/to/task",
        data,
      },
      {
        async onSuccess(data) {
          await queryClient.setQueryData(
            [queryKeys.TasksForCompany],
            (oldData) => {
              return {
                message: (oldData?.message ?? []).map((item) => {
                  if (item._id === data.message._id) {
                    return data.message;
                  }
                  return item;
                }),
              };
            }
          );
          setTask(data.message);
          toast.dismiss(toastId);
          toast.success("Invitation sent successfully");
          setInviteModal(false);
        },
        async onError(error) {
          // await refetch();
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
          setInviteModal(false);
        },
      }
    );
  };

  const deleteTask = async (task) => {
    const isConfirmed = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to delete "${task?.task_name}"?`,
      fullWidth: true,
    });

    if (isConfirmed) {
      const toastId = toast.loading(`Deleting ${task?.task_name}...`);
      mutate(
        {
          url: "/task/delete",
          data: {
            task_id: task._id,
          },
          method: "DELETE",
        },
        {
          async onSuccess(data) {
            await queryClient.setQueryData(
              projectId
                ? [queryKeys.Projects, projectId]
                : [queryKeys.TasksForCompany],
              (oldData) => {
                if (projectId) {
                  return {
                    message: {
                      ...oldData.message,
                      task_objects: oldData?.message.task_objects.filter(
                        (item) => item._id !== task._id
                      ),
                    },
                  };
                } else {
                  return {
                    message: (oldData?.message ?? []).filter(
                      (item) => item._id !== task._id
                    ),
                  };
                }
              }
            );
            toast.dismiss(toastId);
            toast.success(`${task.task_name} deleted successfully`);
            setIsOpen(false);
            setTask(null);
          },
          onError(error) {
            toast.dismiss(toastId);
            toast.error(error.response.data.message);
            setIsOpen(false);
          },
        }
      );
    }
  };

  useEffect(() => {
    if (inviteId) {
      setCategory({
        category: sendTo,
        id: inviteId,
      });
    }
  }, [inviteId, sendTo]);

  return (
    <DetailsCard
      heading={"Task Details"}
      image={task?.icon_thumbnail}
      title={`${task?.task_name}`}
      description={task?.task_description}
      openDetails={!!task}
      closeDetails={() => setTask(null)}
      actionButtons={() => (
        <>
          <button
            disabled={task?.assigned_builders.length === 0 ? false : true}
            onClick={() => setAssignModal(true)}
            className="font-bold tracking-widest border border-primary rounded-md text-primary text-xs py-1 px-3 hover:text-white hover:bg-primary duration-300"
          >
            {task?.assigned_builders.length === 0 ? "Assign" : "Assigned"}
          </button>
          {task?.is_opened_for_bid === 0 ? (
            <></>
          ) : task?.assigned_builders.length === 0 ? (
            <button
              onClick={() => setInviteModal(true)}
              className="font-bold tracking-widest border border-primary rounded-md text-primary text-xs py-1 px-3 hover:text-white hover:bg-primary duration-300"
            >
              Invite
            </button>
          ) : (
            <></>
          )}

          <button onClick={() => setOpenTask(true)}>
            <Icon
              icon="iconamoon:edit-light"
              className="text-2xl cursor-pointer text-orange-900"
            />
          </button>
          <button onClick={() => deleteTask(task)}>
            <Icon
              icon="fluent:delete-28-regular"
              className="text-2xl cursor-pointer text-red-500"
            />
          </button>
        </>
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row mt-5">
        <div className="flex-1 bg-white rounded-lg p-8">
          <div className="flex justify-end mb-3">
            <p className="px-5 py-3 bg-violet-50 rounded-md text-center text-purple-600 text-[15px] font-bold leading-3">
              {taskStatus(task?.task_status)}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <h4 className="text-blue-900 text-[18px] w-60 font-bold leading-[33px]">
                Location:
              </h4>
              <p className="text-right text-slate-600">
                {`${checkNullity(task?.address?.street)} `}{""}
                {`${checkNullity(task?.address?.city)} `}{" "}
                {`${checkNullity(task?.address?.state)} `}{" "}
                {checkNullity(task?.address?.country)}
              </p>
            </div>

            <div className="flex justify-between">
              <h4 className="text-blue-900 text-[18px] w-60 font-bold leading-[33px]">
                Client:
              </h4>
              <p className="text-right text-slate-600">
                {task?.client_data ? task?.client_data.first_name : ""}{" "}
                {task?.client_data ? task?.client_data.last_name : ""}
              </p>
            </div>
          </div>

          {task?.is_opened_for_bid === 0 ? (
            <></>
          ) : (
            <>
              <div className="mt-5">
                <div className="capitalize text-blue-900 text-2xl font-bold leading-[45px]">
                  Bid Info
                </div>
              </div>

              {!task?.minimum_bid_amount ? (
                <p className="ml-3">No Bid Yet</p>
              ) : (
                <div>
                  <div className="flex justify-between">
                    <h4 className="text-blue-900 text-[16px] w-60 font-bold leading-[33px]">
                      Company's Budget:
                    </h4>
                    <p className="text-right text-slate-600">
                      {companySettings?.currency?.symbol}
                      {task?.minimum_bid_amount}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <h4 className="text-blue-900 text-[16px] w-60 font-bold leading-[33px]">
                      Current Bid Amount:
                    </h4>
                    <p className="text-right text-slate-600">
                      {companySettings?.currency?.symbol}
                      {task?.current_bid_amount}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <h4 className="text-blue-900 text-[16px] w-60 font-bold leading-[33px]">
                      Bid Duration:
                    </h4>
                    <p className="text-right text-slate-600">
                      {task?.bid_duration}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <h4 className="text-blue-900 text-[16px] w-60 font-bold leading-[33px]">
                      Bid Set Date:
                    </h4>
                    <p className="text-right text-slate-600">
                      {task?.bid_set_date
                        ? formatDistanceToNowStrict(
                            new Date(task?.bid_set_date),
                            {
                              addSuffix: true,
                            }
                          )
                        : ""}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex-1 bg-white p-8 rounded-md space-y-5">
          <div className="mt-5 flex items-start">
            <div className="whitespace-nowrap w-32 text-blue-900 text-[18px] font-bold">
              Assigned to:
            </div>

            {task?.assigned_builders.length > 0 ? (
              <div className="flex-1">
                {isLoading ? (
                  <div className="flex items-end text-lg">
                    <span>Loading</span>
                    <Icon
                      icon="eos-icons:three-dots-loading"
                      className="text-base"
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex gap-2 flex-wrap">
                    {taskBuilders.map((builder, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex items-center gap-2 border rounded-md w-40 p-1">
                          <div>
                            <img
                              src={builder.profile_image}
                              alt=""
                              className="h-8 w-8 object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <div className="text-blue-900 text-sm font-semibold leading-[18px]">
                              {builder.f_name} {builder.l_name}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs px-5 py-2 bg-indigo-50 rounded-lg text-center text-blue-600 text-[16px] font-bold leading-normal">
                UNASSIGNED
              </div>
            )}
          </div>

          {task?.is_opened_for_bid === 0 ? (
            <></>
          ) : (
            <>
              <div className="flex">
                <p className="w-32 whitespace-nowrap text-blue-900 text-[18px] font-bold">
                  Sent to:
                </p>
                {task?.bidders_sent_to.length === 0 ? (
                  <span>Not sent to any builder yet</span>
                ) : (
                  <span>{`${task?.bidders_sent_to.length} builder${
                    task?.bidders_sent_to.length === 1 ? "" : "s"
                  }`}</span>
                )}
              </div>

              <div>
                <div className=" text-blue-900 text-[24px] font-bold leading-[42px] mt-5">
                  Biders
                </div>

                <div className="space-y-2">
                  {task?.biders.length === 0 ? (
                    <p className="ml-3">No Bider Yet</p>
                  ) : (
                    <>
                      {task?.bids.map((bider, idx) => (
                        <div>
                          <div className="flex items-center">
                            <div className="flex justify-center items-center gap-2 border w-10 h-10 rounded-full p-2">
                              <Icon icon="fluent-mdl2:check-mark" />
                            </div>
                            <div className="flex items-center mt-2">
                              <img
                                src={bider.builder?.profile_image}
                                alt=""
                                className="h-8 w-8  object-cover rounded-md ml-2 mr-2"
                              />
                              <div>
                                <span className="text-blue-900 text-md font-bold leading-[27px]">
                                  {bider.builder?.f_name}{" "}
                                  {bider.builder?.l_name}
                                </span>
                                <span className="text-blue-900 text-md font-normal leading-[27px] ml-2">
                                  has a bid of ${bider.bid_amount}.
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="border-l h-10 ml-5">
                            <div className="text-slate-500 text-sm font-normal leading-normal ml-7">
                              Bid time as at {bider.updated_at}
                              <button
                                disabled={
                                  task?.assigned_builders.length === 0
                                    ? false
                                    : true
                                }
                                onClick={() =>
                                  assignBuilder({
                                    _id: bider?.builder?._id,
                                    f_name: bider?.builder?.f_name,
                                    l_name: bider?.builder?.l_name,
                                  })
                                }
                                className="ml-2 border border-primary rounded-md text-primary text-xs py-1 px-3 hover:text-white hover:bg-primary duration-300"
                              >
                                {task?.assigned_builders.length === 0
                                  ? "Assign"
                                  : "Assigned"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Assign Task */}
      <Modal openModal={assignModal} closeModal={setAssignModal} fullWidth>
        <form onSubmit={assignedSubmit} className="space-y-3">
          <div>
            <div className=" text-blue-900 font-bold">Assign:</div>
            <p className="text-xl pl-5 pt-2">{task?.task_name}</p>
          </div>

          <CustomSelect
            data={builders}
            label="Sub-Contractor"
            onChange={setBuilderId}
            placeholder="Select Sub-Contractor"
            loading={isLoading}
          />

          <button className="float-right bg-primary py-2 px-5 text-white font-bold tracking-widest rounded-md">
            Assign
          </button>
        </form>
      </Modal>

      {/* Invite Builder or Group*/}
      <Modal openModal={inviteModal} closeModal={setInviteModal} fullWidth>
        <form onSubmit={submitInvite} className="space-y-3">
          <div>
            <div className=" text-blue-900 font-bold text-2xl">Invite:</div>
            <p className="text-xl pl-5 pt-2">{task?.task_name}</p>
          </div>

          <div className="flex justify-between items-center pt-4 gap-10">
            <h3 className="mb-1 block text-blue-900 text-md font-semibold leading-loose whitespace-nowrap">
              Send Invite To:
            </h3>
            <div className="relative h-8 w-8/12 flex ring-1 rounded-full ring-offset-4">
              <div
                className={`absolute w-1/2 top-0 ${
                  sendTo === "builder" ? "translate-x-0" : "translate-x-full"
                } h-full px-5 py-2 bg-primary rounded-full shadow transform  duration-500`}
              ></div>
              <button
                type="button"
                className={`text-blue-900 bg-transparent flex-1 z-10 font-bold ${
                  sendTo === "builder" && "text-white"
                } duration-500`}
                onClick={() => setSendTo("builder")}
              >
                Sub-Contractor
              </button>
              <button
                type="button"
                className={`text-blue-900 bg-transparent flex-1 z-10 font-bold ${
                  sendTo === "group" && "text-white"
                } duration-500`}
                onClick={() => setSendTo("group")}
              >
                Group
              </button>
            </div>
          </div>

          {sendTo === "builder" ? (
            <CustomSelect
              data={builders}
              label="Sub-Contractors"
              placeholder="Select Sub-Contractor"
              onChange={setInviteId}
            />
          ) : (
            <CustomSelect
              data={buildersGroups}
              label="Groups"
              placeholder="Select Group"
              onChange={setInviteId}
            />
          )}

          <button className="float-right bg-primary py-2 px-5 text-white font-bold tracking-widest rounded-md">
            Send Invite
          </button>
        </form>
      </Modal>

      {ConfirmationDialog()}
    </DetailsCard>
  );
}

export default TaskDetails;
