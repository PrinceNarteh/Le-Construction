import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";

import TaskForm from "../../components/forms/TaskForm";
import Modal from "../../components/shared/Modal";
import { queryKeys } from "../../constants";
import usePostQuery from "../../hooks/usePostQuery";
import { capitalize } from "../../utils/capitalize";
import taskStatus from "../../utils/taskStatus";
import TaskCard from "../../components/shared/TaskCard";
import TaskDetails from "./TaskDetails";
import { Skeleton } from "../../components/skeleton/Skeleton";

const statuses = [
  {
    value: -2,
    label: "ALL",
  },
  {
    value: -1,
    label: "TASKS OPEN FOR BID",
  },
  {
    value: 0,
    label: "UNASSIGNED",
  },
  {
    value: 1,
    label: "ASSIGNED",
  },
  {
    value: 2,
    label: "TODO",
  },
  {
    value: 3,
    label: "STARTED",
  },
  {
    value: 4,
    label: "WORK IN PROGRESS",
  },
  {
    value: 5,
    label: "COMPLETED",
  },
  {
    value: 6,
    label: "BREAK",
  },
  {
    value: 7,
    label: "RESUME",
  },
];

function AllTasks() {
  const [openTask, setOpenTask] = useState(false);
  const [status, setStatus] = useState(-2);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [result, setResult] = useState([]);
  const [task, setTask] = useState(null);

  const { data, isLoading, refetch } = usePostQuery({
    queryKey: [queryKeys.TasksForCompany],
    url: "/task/for/company",
  });

  useEffect(() => {
    if (data?.message) {
      setAllTasks(data?.message);
      setFilteredTasks(data?.message);
    }
  }, [data]);

  useEffect(() => {
    switch (status) {
      case -2:
        setFilteredTasks(allTasks);
        break;
      case -1:
        setFilteredTasks(allTasks.filter((task) => task.is_opened_for_bid));
        break;
      default:
        setFilteredTasks(
          allTasks.filter((task) => task.task_status === status),
        );
        break;
    }
  }, [status, allTasks]);

  useEffect(() => {
    if (search || filteredTasks) {
      setResult(
        filteredTasks?.filter((task) =>
          task.task_name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    } else {
      setResult(filteredTasks);
    }
  }, [search, filteredTasks]);

  return (
    <div className="px-12">
      <div className="w-full h-16 bg-white mt-8 rounded-xl">
        <div className="flex justify-between items-center mx-5 h-16">
          <div>
            <h3 className="text-blue-900 text-2xl font-bold leading-10">
              Tasks
            </h3>
          </div>
          <div className="flex items-center">
            <div className="h-11 w-72 bg-[#F4F6FB] flex ml-2 rounded-lg mr-3 ">
              <Icon icon="circum:search" className="mt-[0.8rem] h-5 w-5 ml-3" />

              <input
                type="search"
                name="name"
                placeholder="Search "
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#F4F6FB] w-full outline-none p-2 placeholder:text-gray-700 text-sm placeholder:font-normal placeholder:mb-3"
              />
            </div>
            <div onClick={() => setOpenTask(true)}>
              <div className="w-[150px] h-12 py-[15px] bg-gradient-to-r from-primary to-secondary rounded-md shadow flex-col justify-center items-center gap-[7.25px] inline-flex">
                <div className="justify-start items-center gap-[7.25px] inline-flex">
                  <button className="text-gray-50 text-[13px] font-bold leading-snug px-5">
                    <span className="mr-2">+</span>New Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="flex justify-end mt-3 cursor-pointer gap-3">
          <div
            onClick={() => setFilter(!filter)}
            className="flex justify-center items-center gap-2 border border-primary  p-1 pr-2 rounded text-white font-semibold "
          >
            <div className="flex bg-primary items-center text-sm py-1 px-3 gap-2 rounded">
              <Icon
                icon="material-symbols:filter-list-rounded"
                className="text-white"
              />
              <span className="block">Filter</span>
            </div>
            <p className="text-primary">{taskStatus(status)}</p>
          </div>
        </div>

        {filter && (
          <ul className="absolute w-56 z-10 right-0 bg-white mt-2 overflow-y-auto border border-slate-400 shadow-md rounded-md px-2 pt-2 max-h-60 cursor-pointer">
            {statuses.map((item) => (
              <li
                key={item.value}
                onClick={() => {
                  setStatus(item.value);
                  setFilter(false);
                }}
                className={`flex items-center gap-2 px-4 py-1 rounded font-semibold ${
                  status === item.value ? "bg-primary text-white" : ""
                }`}
              >
                <span>{capitalize(item.label)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-auto-fit-lg gap-3 mt-5">
          {Array(15)
            .fill(null)
            .map(() => (
              <div className="w-full flex gap-2 bg-white/50 p-2 rounded-lg border shadow-sm cursor-pointer">
                <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
                <div className="w-full flex flex-col justify-between">
                  <div>
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4 w-28 mt-2" />
                  </div>
                  <Skeleton className="h-4 w-28 mt-2 self-end" />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <>
          <div className="grid grid-auto-fit-lg gap-3 mt-5">
            {result?.map((task, idx) => (
              <TaskCard key={idx} task={task} setTask={setTask} />
            ))}
          </div>

          {/* Task Details */}
          <TaskDetails
            task={task}
            setTask={setTask}
            setOpenTask={setOpenTask}
          />

          <Modal openModal={openTask} closeModal={setOpenTask}>
            <TaskForm
              task={task}
              project_id={task?.project_id}
              refetch={refetch}
              closeModal={setOpenTask}
            />
          </Modal>
        </>
      )}
    </div>
  );
}

export default AllTasks;
