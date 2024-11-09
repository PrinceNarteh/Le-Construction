import { Icon } from "@iconify/react";
import {
  CategoryScale,
  Chart,
  LineElement,
  LinearScale,
  PointElement,
  defaults,
} from "chart.js";
import React, { useState } from "react";
import ActivitiesBuilder from "../../components/dashboard/ActivitiesBuilder";
import DisplayCard from "../../components/dashboard/DisplayCard";
import LineChart from "../../components/dashboard/LineChart";
import Heading from "../../components/layout/Heading";
import MapComponent from "../../components/shared/MapComponent";
import { queryKeys } from "../../constants";
import usePostQuery from "../../hooks/usePostQuery";
import { useUserSelector } from "../../hooks/useUserSelector";
import Modal from "../../components/shared/Modal";
import TaskForm from "../../components/forms/TaskForm";
import TaskCard from "../../components/shared/TaskCard";
import TaskDetails from "../tasks/TaskDetails";
import { setCompany } from "../../app/feature/company/companySlice";
import DashboardSkeleton from "../../components/skeleton/DashboardSkeleton";
import { useDispatch } from "react-redux";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);
defaults.responsive = true;

// TASK_STATUS:
//     UNASSIGNED, //1 - New
//     ASSIGNED, //2 - New
//     TODO, //3 - Running
//     STARTED, //4 - Running
//     WIP, //5 - Running
//     COMPLETED //6 - Completed

// PROJECTS_STATUS:
//     NEW = "New",
//     APPROVED = "Approved",
//     ASSIGNED = "Assigned",
//     STARTED = "Started",
//     WIP = "Wip",
//     COMPLETED = "Completed"

function Dashboard() {
  const { user } = useUserSelector();
  const dispatch = useDispatch();
  //const { companySettings } = useCompanySettingsSelector();
  const [task, setTask] = useState(null);
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const { data, isLoading } = usePostQuery({
    url: "/dashboard/data",
  });

  const { data: company } = usePostQuery({
    queryKey: [queryKeys.Company, user.company_id],
    url: "/company/get",
    showLoadingBar: false,
  });

  //console.log("company:::", company.message);
  setCompany(company);

  const { data: tasks, refetch } = usePostQuery({
    queryKey: [queryKeys.TasksForCompany],
    url: "/task/for/company",
    showLoadingBar: false,
  });

  //console.log("tasks:::", tasks)

  const userData = {
    labels: data?.message.cash_flow.map((item) => item.year) || [],
    datasets: [
      {
        label: "Gain",
        data: data?.message.cash_flow.map((item) => item.userGain) || [],
        backgroundColor: "#0000FF",
        borderColor: "#0000FF",
      },
      {
        label: "Loss",
        data: data?.message.cash_flow.map((item) => item.userLost) || [],
        backgroundColor: "#FF0000",
        borderColor: "#FF0000",
      },
    ],
  };

  const lineChartOptions = {
    tension: 0.4,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          drawOnChartArea: true,
        },
      },
      y: {
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    elements: {
      bar: {
        barPercentage: 0.6, // Adjust the width of the bars
        categoryPercentage: 0.8, // Adjust the space between bars
      },
    },
  };

  return (
    <div className="">
      <div className="ml-9">
        <Heading label="Dashboard" />
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="grid grid-auto-fit-sm gap-2 px-5 mt-4">
            {data?.message.display_cards.map((card, index) => (
              <DisplayCard key={index} card={card} idx={index} />
            ))}
            {user?.user_type === "owner" && (
              <DisplayCard
                card={{
                  title: "Total Companies",
                  value: 128,
                  icon: "fluent:building-32-regular",
                  iconColor: "bg-gradient-to-b from-red-500 to-orange-300",
                }}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-5 px-5">
            <div className="mt-5 h-96 mb-5 bg-white p-4 rounded-xl">
              <MapComponent />
            </div>
            <div className="mt-5 mb-5 h-96  bg-white p-5 rounded-xl">
              <div className="flex justify-between items-center mb-5">
                <div className="text-xl text-blue-900 font-bold">Cash Flow</div>
                <div className="text-md text-blue-900 font-bold">
                  <span className="text-green-500">Incoming :</span>{" "}
                  {user.company.company_settings?.currency.code}
                </div>
                <div className="text-md text-blue-900 font-bold">
                  <span className="text-red-500">Outgoing :</span>{" "}
                  {user.company.company_settings?.currency.code}
                </div>
              </div>
              <div className="h-full">
                <LineChart chartData={userData} options={lineChartOptions} />
              </div>
            </div>
          </div>

          <ActivitiesBuilder activities={data?.message.activities} />

          {/* <div className="flex gap-5 px-5">
        <div className="w-[50%] mt-5 mb-5  bg-white p-7 rounded-xl">
          <div className="flex justify-between items-center mb-5">
            <div className="text-xl text-blue-900 font-bold">
              Project Deliveries
            </div>
          </div>
          <UpLineChart chartData={userData} />
        </div>
        <div className="w-[50%] mt-3 mb-5  bg-white p-7 rounded-xl">
          <div className="flex justify-between items-center mb-5">
            <div className="text-xl text-blue-900 font-bold">
              Client Statistics
            </div>
          </div>
          <UpLineChart chartData={userData} />
        </div>
      </div> */}

          <div className="grid grid-cols-3 gap-4 mt-3 px-5">
            {/* New */}
            <div>
              <div className=" bg-white h-fit w-full rounded-2xl p-4 overflow-y-auto cursor-pointer">
                <div className="flex justify-between">
                  <div className="text-blue-800 text-lg font-bold leading-loose">
                    New
                  </div>

                  <div className="px-4justify-start items-start inline-flex">
                    <button
                      onClick={() => setOpenTaskForm(true)}
                      className="w-20 h-8 bg-orange-200 rounded-md flex justify-center items-center"
                    >
                      <Icon icon="ic:round-plus" className="text-orange-500" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mt-3">
                {tasks?.message
                  .reverse()
                  .filter((task) => [1, 0].includes(task.task_status))
                  .slice(0, 8)
                  .map((task, idx) => {
                    //console.log("task:::", task);
                    return <TaskCard key={idx} task={task} setTask={setTask} />;
                  })}
              </div>
            </div>
            {/* Work In Progress */}
            <div>
              <div className=" bg-white h-fit w-full rounded-2xl p-4 overflow-y-auto cursor-pointer">
                <div className="flex justify-between">
                  <div className="text-blue-800 text-lg font-bold leading-loose">
                    Work In Progress
                  </div>
                </div>
              </div>
              <div className="space-y-3 mt-3">
                {tasks?.message
                  .reverse()
                  .filter((task) => [2, 3, 4].includes(task.task_status))
                  .slice(0, 8)
                  .map((task, idx) => (
                    <TaskCard key={idx} task={task} setTask={setTask} />
                  ))}
              </div>
            </div>
            {/* Completed */}
            <div>
              <div className=" bg-white h-fit w-full rounded-2xl p-4 overflow-y-auto cursor-pointer">
                <div className="flex justify-between">
                  <div className="text-blue-800 text-lg font-bold leading-loose">
                    Completed
                  </div>
                </div>
              </div>
              <div className="space-y-3 mt-3">
                {tasks?.message
                  .reverse()
                  .filter((task) => [5].includes(task.task_status))
                  .slice(0, 8)
                  .map((task, idx) => (
                    <TaskCard key={idx} task={task} setTask={setTask} />
                  ))}
              </div>
            </div>
          </div>

          <TaskDetails
            task={task}
            setTask={setTask}
            setOpenTask={setOpenTaskForm}
          />

          <Modal openModal={openTaskForm} closeModal={setOpenTaskForm}>
            <TaskForm refetch={refetch} closeModal={setOpenTaskForm} />
          </Modal>
        </>
      )}
    </div>
  );
}

export default Dashboard;
