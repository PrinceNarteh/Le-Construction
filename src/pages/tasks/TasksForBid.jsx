import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";

import Spinner from "../../components/Spinner";
import Heading from "../../components/layout/Heading";
import Modal from "../../components/shared/Modal";
import usePostQuery from "../../hooks/usePostQuery";
import TaskForBidDetails from "./TaskForBidDetails";
import TaskForBidingDetails from "./TaskForBidingDetails";

const TasksForBid = () => {
  const [openBids, setOpenBid] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const { data: tasks, isLoading } = usePostQuery({
    url: "/tasks/open/for/bid",
    queryKey: ["tasks-for-bid"],
  });

  useEffect(() => {
    if (!openModal) {
      setCurrentTask(null);
    }
  }, [openModal]);

  return (
    <div className="px-20 cursor-pointer">
      <div className="flex justify-between">
        <Heading label="Tasks Open For Bid" />
      </div>

      <div className="text-slate-400 text-sm font-normal mt-2">
        Welcome to the Bids Page
      </div>

      <div className="grid grid-cols-3 mt-5 mb-3">
        {isLoading && (
          <Spinner isSubmitting={isLoading} /> // Display the spinner
        )}
        {tasks?.message.map((task, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-3 px-4 space-y-2 w-80"
          >
            <div className="flex justify-between items-center w-full">
              <div className=" text-blue-900 text-[15px] font-semibold leading-relaxed line-clamp-1 capitalize">
                {task.task_name}
              </div>

              <div className="flex items-center">
                <img
                  src="/images/hammer.png"
                  alt=""
                  className="h-8 w-8 object-cover"
                />
              </div>
            </div>

            <div className="flex justify-between items-center w-full">
              <div className=" text-blue-900 text-[15px] font-bold leading-relaxed line-clamp-1 capitalize">
                Project
              </div>

              <div className="flex items-center">
                <div className="text-slate-500 text-[14px] font-semibold leading-normal">
                  School Building
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Icon
                  icon="solar:wallet-money-outline"
                  className="h-5 w-5 mr-1"
                />
                <div className="w-full text-blue-900 text-[15px] font-normal leading-loose">
                  Minimum Bid Amount
                </div>
              </div>
              <div className="w-[52.46px] text-right text-blue-900 text-[17px] font-bold leading-relaxed">
                {task.minimum_bid_amount}
              </div>
            </div>

            {/*<div className="flex items-center">
              <Icon icon="codicon:location" className="mr-1 h-9 w-9" />
              <div className="w-[513px] text-blue-900 text-[14px] font-normal leading-7">
                {task?.address.city}
              </div>
        </div> */}

            <button
              onClick={() => {
                setCurrentTask(task);
                setOpenModal(true);
              }}
              className=" text-center text-blue-600 text-[16px] font-bold leading-normal w-full h-10 rounded-lg border border-blue-600 justify-center items-center gap-[9.54px] inline-flex"
            >
              Assign
            </button>
            <div
              onClick={() => setOpenBid(true)}
              className="w-full h-10 rounded-lg border border-blue-600 justify-center items-center gap-[9.54px] inline-flex cursor-pointer"
            >
              <div className=" text-center text-blue-600 text-[16px] font-bold leading-normal">
                Invite
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal openModal={openModal} closeModal={setOpenModal} width="max-w-fxl">
        <TaskForBidDetails task={currentTask} setOpenModal={setOpenModal} />
      </Modal>
      <Modal openModal={openBids} closeModal={setOpenBid}>
        <TaskForBidingDetails />
      </Modal>
    </div>
  );
};

export default TasksForBid;
