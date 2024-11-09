import React from "react";
import { Icon } from "@iconify/react";
import taskStatus from "../../utils/taskStatus";

const TaskCard = ({ task, setTask }) => {
  return (
    <div
      onClick={() => setTask(task)}
      className="w-full flex gap-2 bg-white p-2 rounded-lg border shadow-sm shadow-primary cursor-pointer"
    >
      <img
        src={task.icon_thumbnail}
        alt=""
        className="h-20 w-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <div className="flex justify-between items-center w-full">
          <h5 className="text-blue-900 text-sm font-bold leading-normal line-clamp-1">
            {task.task_name}
          </h5>
          {task.is_opened_for_bid ? (
            <div className="flex items-center">
              <img
                src="/images/hammer.png"
                alt=""
                className="h-6 w-6 object-cover"
              />
            </div>
          ) : (
            <Icon icon="carbon:task-tools" className="text-blue-800" />
          )}
        </div>
        <p className="mt-2 text-sm line-clamp-1 text-slate-500 text-[13px] font-normal leading-normal tracking-wide">
          {task.task_description}
        </p>
        <span className="float-right h-5 px-2 py-1 mt-2 bg-violet-50 rounded-md text-center text-purple-600 text-[8px] font-bold leading-3">
          {taskStatus(task.task_status)}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
