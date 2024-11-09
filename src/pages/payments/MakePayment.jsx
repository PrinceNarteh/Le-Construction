import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CurrencyInput from "react-currency-input";
import { toast } from "react-hot-toast";
import CustomSelect from "../../components/shared/CustomSelect";
import ErrorMessage from "../../components/shared/ErrorMessage";
import Modal from "../../components/shared/Modal";
import TextArea from "../../components/shared/TextArea";
import { queryKeys } from "../../constants";
import useConfirm from "../../hooks/useConfirm";
import useFormatCurrency from "../../hooks/useFormatCurrency";
import { useGetQuery } from "../../hooks/useGetQuery";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";
import { useUserSelector } from "../../hooks/useUserSelector";
import taskStatus from "../../utils/taskStatus";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useCompanySettingsSelector } from "../../hooks/useCompanySettings";
import { useNavigate } from "react-router-dom";
import { checkNullity } from "../../utils/checkNullity";

const schema = z.object({
  task_id: z.string().min(1, "Please select task"),
  builder_id: z.string().min(1, "Please select sub contractor"),
  company_id: z.string().min(1, "Please provide company ID"),
  amount: z.coerce.number().positive(),
  payment_message: z.string().optional(),
});

const MakePayment = () => {
  const { user } = useUserSelector();
  //const { companySettings } = useCompanySettingsSelector();
  const queryClient = useQueryClient();
  const { formatCurrency } = useFormatCurrency();
  const [openModal, setOpenModal] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [builderId, setBuilderId] = useState("");
  const [status, setStatus] = useState("");
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const [selectedTask, setSelectedTask] = useState(null);
  const [resetFields, setResetFields] = useState(false);
  const [amount, setAmount] = useState(0);
  const {
    reset,
    setError,
    setValue,
    register,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      task_id: "",
      builder_id: "",
      company_id: user?.user_type === "company" ? user?._id : user?.company._id,
      amount: selectedTask?.current_bid_amount ?? 0,
      payment_message: "",
    },
    resolver: zodResolver(schema),
  });

  // Get Tasks
  const { data: tasks, isLoading: loadingTasks } = usePostQuery({
    queryKey: [queryKeys.TasksForCompany],
    url: "/task/for/company",
  });
  const tasksData = tasks?.message
    //.filter((item) => !["0", "undefined"].includes(item.agreed_amount_to_pay))
    .map((task) => ({
      id: task._id,
      label: task.task_name,
    }));

  const handleChange = (_, maskedvalue) => {
    setAmount(maskedvalue);
    setValue("amount", parseFloat(maskedvalue?.replaceAll(",", "")));
    clearErrors("amount");
  };

  // Get Builder
  const { data: builders, isLoading: loadingBuilders } = useGetQuery({
    queryKey: [queryKeys.Builders],
    url: "/my/builders",
    options: {
      headers: {
        companyid: user.user_type === "company" ? user._id : user.company._id,
      },
    },
  });
  const buildersData = builders?.message
    .map((builder) => ({
      id: builder._id,
      label: `${builder.f_name} ${builder.l_name}`,
    }))
    .filter((builder) => {
      //console.log(builder);
      return selectedTask?.assigned_builders.includes(builder.id);
    });

  const navigate = useNavigate();
  const { mutate } = useMutate(["make-payment"]);
  const submit = async (data) => {
    if (!taskId) {
      setError("task_id", { message: "Please selected a task" });
      return;
    }

    if (!builderId) {
      setError("builder_id", { message: "Please selected a Sub-Contractor" });
      return;
    }

    if (![4, 5].includes(selectedTask.task_status)) {
      const isConfirm = await confirm({
        message: `The selected task is not marked as "WORK IN PROGRESS" or "COMPLETED". Only tasks marked as this can go through. Do you want change the status of the task?`,
        confirmButtonLabel: "Yes, change status",
      });

      if (isConfirm) {
        setIsOpen(false);
        setOpenModal(true);
      }
    } else {
      const subContractor = builders?.message.find(
        (builder) => builder._id === data.builder_id,
      );
      const isConfirm = await confirm({
        title: "Are you sure",
        message: `Are you sure you want to send "${formatCurrency(
          data.amount,
        )}" to ${subContractor?.f_name} ${subContractor?.l_name}?`,
        confirmButtonColor: "bg-primary",
        confirmButtonLabel: "Yes, Send!",
      });

      if (isConfirm) {
        const toastId = toast.loading("Making payment...");
        mutate(
          {
            url: "/payment/payout",
            data,
          },
          {
            onSuccess(data) {
              setResetFields(true);
              toast.dismiss(toastId);
              toast.success("Payment made successfully");
              reset();
              setSelectedTask(null);
              setResetFields(false);
              setIsOpen(false);
              navigate("/payment/transactions");
            },
            onError(error) {
              toast.dismiss(toastId);
              toast.error(error.response.data.message);
            },
          },
        );
      }
    }
  };

  const { mutate: statusMutate } = useMutate(["change-status"]);
  const submitStatus = async (e) => {
    e.preventDefault();
    if (!status) {
      toast.error("Please select status");
      return;
    }
    const toastId = toast.loading(`Changing ${selectedTask?.title} status...`);

    const data = {
      task_id: selectedTask?._id,
      task_status: parseInt(status),
    };

    statusMutate(
      {
        url: "/task/update/status",
        method: "PATCH",
        data,
      },
      {
        async onSuccess(data) {
          await queryClient.setQueryData(
            [queryKeys.TasksForCompany],
            (oldData) => {
              return {
                message: (oldData?.message ?? []).map((item) =>
                  item._id === selectedTask?._id ? data.message : item,
                ),
              };
            },
          );

          toast.dismiss(toastId);
          toast.success("Task status changed successfully!");
          setOpenModal(false);
          setSelectedTask(data.message);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error("Error changing task status");
          setOpenModal(false);
        },
      },
    );
  };

  useEffect(() => {
    if (taskId) {
      const task = tasks?.message.find((task) => task._id === taskId);
      if (
        task
      ) {
        setSelectedTask(task);
        setValue("task_id", taskId);
        setValue("amount", task?.current_bid_amount ?? 0);
        clearErrors("task_id");
      } else if (selectedTask !== null) {
        setSelectedTask(null);
      }
    }
  }, [taskId, clearErrors, setValue, tasks?.message, selectedTask]);  

  useEffect(() => {
    if (builderId) {
      setValue("builder_id", builderId);
      clearErrors("builder_id");
    }
  }, [builderId, clearErrors, setValue]);

  useEffect(() => {
    if (selectedTask && selectedTask?.agreed_amount_to_pay) {
      setAmount(selectedTask.agreed_amount_to_pay);
    }
  }, [selectedTask]);

  return (
    <div className="w-full px-12 pb-5">
      <div className="h-40 bg-primary bg-[url('/public/images/wave.png')] rounded-xl relative">
        <div className="ml-9 top-0 text-white text-2xl font-bold absolute mt-7">
          <h3>Make Payment</h3>
        </div>

        <div className="absolute -bottom-10  h-20 w-[95%] border border-primary mr-10 bg-white/75 backdrop-blur-lg  rounded-xl  ml-4 flex justify-between items-center">
          <div className="flex items-center px-5">
            <Icon icon="fluent:payment-32-regular" className="h-14 w-14" />
            <div className="ml-3">
              <div className="h-[25px] text-blue-900 text-lg font-bold leading-7">
                Payment
              </div>
              <div className="h-5 text-slate-600 text-sm font-normal leading-tight">
                Make payment for task completed
              </div>
            </div>
          </div>

          <div className="flex gap-5 mr-5"></div>
        </div>
      </div>
      <div className="mt-14 max-w-full">
        <div className="flex flex-col gap-5 lg:flex-row mt-5">
          <div className="flex-1 bg-white rounded-lg p-8">
            <form onSubmit={handleSubmit(submit)} className="space-y-3">
              <div>
                <CustomSelect
                  label="Tasks"
                  data={tasksData}
                  onChange={setTaskId}
                  loading={loadingTasks}
                  placeholder="Search tasks..."
                  reset={resetFields}
                />
                <ErrorMessage errors={errors} name="task_id" />
              </div>

              <div>
                <CustomSelect
                  label="Sub-Contractors"
                  data={buildersData}
                  onChange={setBuilderId}
                  loading={loadingBuilders}
                  placeholder="Search Sub-Contractor..."
                  reset={resetFields}
                />
                <ErrorMessage errors={errors} name="builder_id" />
              </div>

              <div className="flex-1 mt-2">
                <label className="block mb-1 text-blue-900 text-md font-semibold whitespace-nowrap">
                  Amount ({user.company.company_settings?.currency?.symbol})
                </label>
                <CurrencyInput
                  onChangeEvent={handleChange}
                  value={amount}
                  className="currency-input"
                />
              </div>

              <TextArea
                label="Message"
                name="payment_message"
                register={register}
                errors={errors}
              />
              <button className="float-right py-2 px-5 bg-primary text-white mt-5">
                Make Payment
              </button>
            </form>
          </div>

          <div className="flex-1 bg-white p-8 rounded-md space-y-5">
            <h3 className="whitespace-nowrap text-primary text-[20px] font-bold">
              Task Details:
            </h3>

            {selectedTask && (
              <div className="flex-1 pl-4 space-y-3">
                <Item label="Project Name" value={selectedTask?.task_name} />

                <Item
                  label="Project Description"
                  value={selectedTask?.task_description}
                />

                <Item
                  label="Project Location"
                  value={`${checkNullity(selectedTask?.address?.street)}
                    ${checkNullity(selectedTask?.address?.city)} ${checkNullity(
                      selectedTask?.address?.state,
                    )}`}
                />

                <Item
                  label="Project Status"
                  value={taskStatus(selectedTask?.task_status)}
                />

                <Item
                  label="Maximum Bid Amount"
                  value={selectedTask?.minimum_bid_amount}
                />

                <Item
                  label="Approved Amount"
                  value={selectedTask?.current_bid_amount}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {ConfirmationDialog()}

      <Modal openModal={openModal} closeModal={setOpenModal}>
        <form onSubmit={submitStatus} className="space-y-4 p-5">
          <h2 className="text-2xl border-b border-gray-400 pb-1 text-blue-900 font-bold">
            Change Task Status
          </h2>
          <div>
            <h3 className="text-blue-900 text-md font-semibold leading-loose block">
              Task
            </h3>
            <p className="pl-3 text-xl">{selectedTask?.task_name}</p>
          </div>
          <div>
            <h3 className="text-blue-900 text-md font-semibold leading-loose mb-1 block">
              Status
            </h3>
            <select
              onChange={(e) => setStatus(e.target.value)}
              className="bg-white w-full p-2.5 flex items-center justify-between border border-slate-400 shadow-md rounded-md pl-5"
            >
              <option value="">----- Select status -----</option>
              <option value="4">Work In Progress</option>
              <option value="5">Completed</option>
            </select>
          </div>
          <div className="pt-3 flex justify-end">
            <button className="px-8 py-2 bg-primary text-white rounded-md">
              Change Status
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const Item = ({ label, value }) => (
  <div className="flex">
    <h6 className="text-blue-900 font-bold w-48">{label}:</h6>
    <p className="flex-1">{value}</p>
  </div>
);

export default MakePayment;
