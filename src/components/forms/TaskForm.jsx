import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import CustomSelect from "../../components/shared/CustomSelect";
import TextArea from "../../components/shared/TextArea";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";
import { useUserSelector } from "../../hooks/useUserSelector";
import InputField from "../shared/InputField";
import TaskBidForm from "./TaskBidForm";
import { queryKeys } from "../../constants";
import { useQueryClient } from "@tanstack/react-query";
import CurrencyInput from "react-currency-input";
import { useCompanySettingsSelector } from "../../hooks/useCompanySettings";

const TaskForm = ({ task, refetch, closeModal, project_id = null }) => {
  const queryClient = useQueryClient();
  const { user } = useUserSelector();
  const { companySettings } = useCompanySettingsSelector();
  const [projectId, setProjectId] = useState("");
  const [view, setView] = useState("task-form");
  const [sendForBid, setSendForBid] = useState(false);
  const [taskForBidId, setTaskForBidId] = useState(null);
  const [amount, setAmount] = useState(0.0);

  const {
    clearErrors,
    setValue,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      company_id: user.company_id,
      project_id: project_id ?? "",
      task_name: task?.task_name ?? "",
      task_description: task?.task_description ?? "",
      maximum_bid_amount: "0.00",
    },
  });

  const { data: projects, isLoading: loadingProjects } = usePostQuery({
    queryKey: [queryKeys.ProjectsForCompany],
    url: "/projects/for/company",
    //enabled: Boolean(project_id),
  });

  const projectsData = projects?.message.map((project) => ({
    id: project._id,
    label: project.project_name,
  }));

  const { mutate } = useMutate([queryKeys.CreateTask]);
  const submitHandler = async (data) => {
    const toastId = toast.loading("Creating task...");

    mutate(
      {
        url: "/task/new",
        data,
      },
      {
        async onSuccess(data) {
          toast.dismiss(toastId);
          toast.success("Task created successfully");
          if (sendForBid) {
            setTaskForBidId(data.message._id);
            setView("task-for-bid-form");
          } else {
            if (project_id) {
              await queryClient.setQueryData(
                [queryKeys.Projects, project_id],
                (oldData) => {
                  if (oldData) {
                    return {
                      message: {
                        ...oldData.message,
                        task_objects: [
                          ...oldData.message.task_objects,
                          data.message,
                        ],
                      },
                    };
                  }
                  return oldData;
                }
              );
            } else {
              await queryClient.setQueryData(
                [queryKeys.TasksForCompany],
                (oldData) => {
                  if (oldData) {
                    return {
                      message: [...(oldData?.message ?? []), data.message],
                    };
                  }
                  return { message: [data.message] };
                }
              );
            }
            closeModal(false);
          }
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      }
    );
  };

  useEffect(() => {
    if (projectId) {
      setValue("project_id", projectId);
    }
  }, [projectId, setValue]);

  const handleChange = (_, maskedvalue) => {
    setValue(
      "maximum_bid_amount",
      parseFloat(maskedvalue?.replaceAll(",", ""))
    );
    setAmount(maskedvalue);
    clearErrors("maximum_bid_amount");
  };

  return (
    <div>
      {view === "task-form" ? (
        <div className="p-5">
          <div className="flex justify-between items-center mb-5">
            <div className="text-blue-900 text-3xl font-bold leading-10">
              Create Task
            </div>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-3">
            <div className="w-full">
              <InputField
                label="Task Title"
                name="task_name"
                placeholder="Enter task title"
                errors={errors}
                register={register}
                errorMessage="Task title is required"
                required
              />
            </div>

            {!project_id ? (
              <div className="w-full">
                <CustomSelect
                  label="Project"
                  placeholder="Select project..."
                  data={projectsData}
                  onChange={setProjectId}
                  loading={loadingProjects}
                />
              </div>
            ) : null}

            <div className=" w-full">
              <TextArea
                label="Task Description"
                name="task_description"
                errors={errors}
                register={register}
                errorMessage="Task description is required"
                required
              />
            </div>

            <div className="w-full">
              {/* Show budget input field only if the task is not open for bid */}
              {!sendForBid && (
                <>
                  <label className="block mb-1 text-blue-900 text-md font-semibold whitespace-nowrap">
                    Budget ({user.company.company_settings?.currency?.symbol})
                  </label>
                  <CurrencyInput
                    onChangeEvent={handleChange}
                    className="currency-input"
                    value={amount}
                    name="budget"
                  />
                </>
              )}
            </div>

            {!task?.is_opened_for_bid && (
              <div className=" w-[100%] mt-4">
                <div className="flex item-center">
                  <label className="relative inline-flex items-center mb-5 cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      onChange={(e) => setSendForBid(e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-gray-200  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.8px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-orange-700"></div>

                    <div className="text-blue-900 text-sm font-semibold leading-normal ml-2">
                      Open For Bid
                    </div>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="float-right text-white text-md font-bold leading-loose w-52 h-12 px-2 py-2 bg-gradient-to-r from-primary to-secondary rounded-md shadow"
            >
              Create task
            </button>
          </form>
        </div>
      ) : (
          <TaskBidForm
            budget={amount}
          refetch={refetch}
          taskId={taskForBidId}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default TaskForm;
