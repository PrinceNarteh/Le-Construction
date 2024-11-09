import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { format } from "libphonenumber-js";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { z } from "zod";
import "@google/model-viewer/dist/model-viewer";

import { setCompany } from "../../app/feature/company/companySlice";
import Spinner from "../../components/Spinner";
import TaskForm from "../../components/forms/TaskForm";
import Heading from "../../components/layout/Heading";
import ImageGallery from "../../components/shared/ImageGallery";
import InputField from "../../components/shared/InputField";
import Modal from "../../components/shared/Modal";
import SelectField from "../../components/shared/SelectField";
import { queryKeys } from "../../constants";
import { useGetQuery } from "../../hooks/useGetQuery";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";
import { useUserSelector } from "../../hooks/useUserSelector";
import { capitalize } from "../../utils/capitalize";
import TaskDetails from "../tasks/TaskDetails";
import ExtraImages from "../../components/shared/ExtraImages";
import { pdfjs } from "react-pdf";
import { Link } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

const schema = z.object({
  project_id: z.string().min(1, "Project ID is required"),
  company_id: z.string().min(1, "Please select a company"),
});

function JobDetails() {
  const { projectId } = useParams();
  const { user } = useUserSelector();
  const [task, setTask] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openBidModal, setOpenBidModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [view2D, setView2D] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const dispatch = useDispatch();

  // Clients
  const { data: clients } = usePostQuery({
    url: "/company/clients",
    queryKey: [queryKeys.Clients],
  });

  // Get project
  const {
    data,
    isLoading: projectLoading,
    refetch,
    isRefetching,
  } = useGetQuery({
    queryKey: [queryKeys.Projects, projectId],
    url: `/project/${projectId}`,
  });

  // Approve Project
  const {
    register: approveRegister,
    handleSubmit: handleApproveSubmit,
    formState: { errors: approveErrors },
  } = useForm({
    defaultValues: {
      client_id: "",
      project_id: projectId,
      project_type: "NoBid",
    },
  });
  const approveMutation = useMutate([queryKeys.ApproveProject]);
  const submitApproval = (data) => {
    const toastId = toast.loading("Approving project...");
    approveMutation.mutate(
      {
        url: "/project/approve",
        data,
      },
      {
        onSuccess(data) {
          dispatch(setCompany(data.message));
          toast.dismiss(toastId);
          toast.success("Project approved successfully");
          setOpenApproveModal(false);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      },
    );
  };

  // Open Bid
  const {
    register: bidRegister,
    handleSubmit: handleBidSubmit,
    formState: { errors: bidErrors },
  } = useForm({
    defaultValues: {
      company_id: user.company_id,
      project_id: projectId,
      bid_duration: 0,
    },
  });
  const openBidMutation = useMutate([queryKeys.OpenBid]);
  const bidSubmit = (formData) => {
    const data = {
      ...formData,
      bid_duration: Number(formData.bid_duration),
    };
    const toastId = toast.loading("Opening bid...");
    openBidMutation.mutate(
      {
        url: "/project/open/bid",
        data,
      },
      {
        onSuccess() {
          toast.dismiss(toastId);
          toast.success("Bid open successfully");
          setOpenBidModal(false);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      },
    );
  };

  // Get all companies/builders
  const { data: builders, isLoading } = useGetQuery({
    queryKey: [queryKeys.Builders],
    url: "/companies/all",
    enabled: openModal,
    showLoadingBar: false,
  });

  // Assign project
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      project_id: projectId,
      company_id: "",
    },
    resolver: zodResolver(schema),
  });
  const assignMutation = useMutate([queryKeys.AssignProjectToBuilder]);

  const submitHandler = async (data) => {
    const toastId = toast.loading("Assigning Project...");
    assignMutation.mutate(
      {
        url: "/project/assign",
        method: "PATCH",
        data,
      },
      {
        onSuccess() {
          refetch();
          toast.dismiss(toastId);
          toast.success("Project assigned successfully");
          setOpenModal(false);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      },
    );
  };

  const project = data?.message;

  return (
    <div className="min-h-screen mt-2">
      <div className="mx-10 flex items-center justify-between">
        <Heading label="Project Details" />

        <div className="flex gap-5">
          {project?.is_approved ? (
            <div className="px-5 py-2 bg-indigo-100 rounded-lg justify-center items-center">
              <div className="w-28 text-center text-blue-600 text-[16px] font-bold leading-normal">
                Approved
              </div>
            </div>
          ) : (
            <button
              onClick={() => setOpenApproveModal(true)}
              className="bg-primary text-xs text-white py-2 px-4 rounded-md font-semibold whitespace-nowrap"
            >
              Approve Project
            </button>
          )}

          {/* {!project.bid_duration ? (
            <button
            onClick={() => setOpenBidModal(true)}
            className="bg-primary text-sm font-bold text-white py-2 px-4 rounded-md whitespace-nowrap"
            >
              Open For Bid
              </button>
          ) : null} */}
        </div>
      </div>
      {projectLoading ? (
        <Spinner isSubmitting={projectLoading} />
      ) : (
        <div className="px-10">
          <div className="grid grid-cols-12 gap-5 mt-5 ">
            <div className="col-span-12 md:col-span-6 max-h-fit bg-white rounded-xl p-6 space-y-3">
              <div className="flex justify-between items-center w-full">
                <div className=" text-blue-900 text-[20px] font-bold leading-10">
                  {project?.project_name}
                </div>
                <div className="flex items-center">
                  <Icon
                    icon="solar:calendar-date-outline"
                    className="h-4 w-4 text-slate-400 mr-1"
                  />
                  <div className="text-blue-900 text-[16.19px] font-semibold">
                    Date: {project?.created_at.split("T")[0]}
                  </div>
                </div>
              </div>

              <div className="relative">
                {project?.original_image_file ? (
                  <button
                    onClick={() => setView2D(true)}
                    className="absolute rounded z-10 flex items-center top-2 right-2 bg-primary p-2"
                  >
                    <Icon
                      icon="material-symbols:eye-tracking-outline"
                      className="text-white"
                    />
                    <span className="font-bold ml-2 text-white text-sm tracking-wider">
                      View 2D
                    </span>
                  </button>
                ) : null}
                <ImageGallery
                  images={project?.project_images}
                  file_type={project?.file_type}
                />
              </div>

              <div>
                <div className="w-[684px] text-blue-900 text-[20px] font-bold leading-9">
                  Description
                </div>
              </div>

              <div>
                <div className="w-full text-slate-500 text-[14px] font-normal leading-7 tracking-wide">
                  {project?.project_description}
                </div>
              </div>

              <div className="flex justify-end items-center mt-12 ">
                <div className="flex gap-5">
                  <div className="px-5 py-2 bg-indigo-100 rounded-lg  w-28 text-center text-blue-600 text-[16px] font-bold leading-normal">
                    {project?.status}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 max-h-fit bg-white rounded-xl p-6 space-y-3">
              <div className="w-[545px] text-blue-900 text-[20px] font-bold leading-9">
                Client Information
              </div>

              <div>
                <div className="flex items-center">
                  <div className="text-slate-500 text-md font-semibold leading-loose mr-2">
                    Name:
                  </div>

                  <div className="text-blue-600 text-md font-bold leading-9">
                    {`${project?.client?.first_name} ${project?.client?.last_name}`}
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="text-slate-500 text-md font-semibold leading-loose mr-2">
                    Email:
                  </div>

                  <div className="text-slate-500 text-md font-bold leading-9">
                    {project?.client?.email}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-slate-500 text-md font-semibold leading-loose mr-2">
                    Phone:
                  </div>

                  <div className="text-slate-500 text-md font-bold leading-9">
                    {project
                      ? format(project?.client?.phone, "INTERNATIONAL")
                      : null}
                  </div>
                </div>
              </div>

              <div className="w-[545px] text-blue-900 text-[20px] font-bold leading-9">
                Project Location
              </div>

              <div className="flex items-center">
                <Icon icon="codicon:location" className="mr-2" />
                <div className="w-[513px] text-blue-900 text-[14px] font-normal leading-7">
                  {`
                    ${project?.project_address?.zip
                      ? `${project?.project_address?.zip} `
                      : ""
                    }
                      ${project?.project_address?.street ? `${project?.project_address?.street}` : ""}
                    ${project?.project_address?.country
                      ? `${project?.project_address?.country}, `
                      : ""
                    } ${project?.project_address?.city ? `${project?.project_address?.city}, ` : ""} ${project?.project_address?.state
                      ? `${project?.project_address?.state}`
                      : ""
                    }`}
                </div>
              </div>

              <div className="flex items-center justify-between ">
                <p className="w-[545px] text-blue-900 text-[20px] font-bold leading-9">
                  Project Tasks
                </p>
                <button
                  onClick={() => setOpenTaskModal(true)}
                  className="bg-primary text-xs text-white py-2 px-4 rounded-md font-semibold whitespace-nowrap"
                >
                  + Add Task
                </button>
              </div>
              {isRefetching ? (
                <Spinner isSubmitting={isRefetching} />
              ) : (
                <div className="grid grid-auto-fit-sm gap-3 p-2 max-h-80 bg-gray-50 rounded-md overflow-y-auto">
                  {project?.task_objects?.map((task, index) => (
                    <div
                      key={index}
                      onClick={() => setTask(task)}
                      className="bg-white block max-w-[300px] border-2 shadow-md rounded-xl p-4 cursor-pointer"
                    >
                      <h6 className="text-blue-900 border-b mb-5 capitalize text-sm font-bold leading-normal line-clamp-1">
                        {task.task_name}
                      </h6>

                      <div className="text-slate-500 text-[13px] font-normal leading-normal line-clamp-2">
                        {task.task_description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="col-span-12 md:col-span-6 bg-white rounded-xl p-5">
              <h3 className="text-blue-900 text-[20px] font-bold leading-9">
                Extra Images
              </h3>
              <ExtraImages images={data?.message.extra_images || []} />
            </div>
            <div className="col-span-12 md:col-span-6 bg-white rounded-xl p-5">
              <h3 className="text-blue-900 text-[20px] font-bold leading-9">
                Extra Notes
              </h3>
              <div>{data?.message.notes}</div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      <Modal openModal={openApproveModal} closeModal={setOpenApproveModal}>
        <form onSubmit={handleApproveSubmit(submitApproval)} className="px-2">
          <div>
            <p className="text-gray-500 font-bold">Assign Project:</p>
            <h3 className="text-xl font-bold text-blue-900 line-clamp-1">
              {project?.project_name}
            </h3>
          </div>
          <div className="mt-5">
            <p className="text-gray-500 font-bold mb-2">Client:</p>
            <SelectField
              name="client_id"
              register={approveRegister}
              errors={approveErrors}
              required
              errorMessage="Please select client"
            >
              <option value="">Select Client</option>
              {clients?.message.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.first_name} {client.last_name}
                </option>
              ))}
            </SelectField>
          </div>
          <button className="px-10 font-semibold rounded-md py-2 bg-primary mt-5 text-white">
            Approve
          </button>
        </form>
      </Modal>

      {/* Bid Modal */}
      <Modal openModal={openBidModal} closeModal={setOpenBidModal}>
        <form onSubmit={handleBidSubmit(bidSubmit)} className="px-2">
          <div>
            <p className="text-gray-500 font-bold text-xl">Open Bid For:</p>
            <h3 className="text-xl font-bold text-blue-900 line-clamp-1">
              {project?.project_name}
            </h3>
          </div>
          <div className="mt-5">
            <InputField
              type="number"
              label="Bid Duration (in hours)"
              name="bid_duration"
              errors={bidErrors}
              register={bidRegister}
              required
              errorMessage="Bid duration is required"
            />
          </div>
          <button className="px-10 font-semibold rounded-md py-2 bg-primary mt-5 text-white">
            Open Bid
          </button>
        </form>
      </Modal>

      {/* Task Modal */}
      <Modal openModal={openModal} closeModal={setOpenModal}>
        <form onSubmit={handleSubmit(submitHandler)} className="px-2">
          <div>
            <p className="text-gray-500 font-bold">Assign Project:</p>
            <h3 className="text-xl font-bold text-blue-900 line-clamp-1">
              {project?.project_name}
            </h3>
          </div>
          <div className="mt-5">
            <p className="text-gray-500 font-bold mb-2">To:</p>
            <SelectField name="company_id" register={register} errors={errors}>
              <option value="">Select Company</option>
              {isLoading && <option value="">Loading...</option>}
              {builders?.message.map((builder) => (
                <option key={builder._id} value={builder._id}>
                  {capitalize(builder.company_name, " ")}
                </option>
              ))}
            </SelectField>
          </div>
          <button className="px-10 font-semibold rounded-md py-2 bg-primary mt-5 text-white">
            Assign
          </button>
        </form>
      </Modal>

      {/* Task Details */}
      <TaskDetails
        task={task}
        projectId={projectId}
        setTask={setTask}
        setOpenTask={setOpenTaskModal}
      />

      {/* Task Form */}
      <Modal openModal={openTaskModal} closeModal={setOpenTaskModal}>
        <TaskForm
          task={task}
          project_id={projectId}
          refetch={refetch}
          closeModal={setOpenTaskModal}
        />
      </Modal>

      {/* View in 2D and 3D */}
      <Modal openModal={view2D} closeModal={setView2D} width="max-w-5xl" start>
        <Link
          to={project?.original_pdf_file}
          download
          target="_self"
          className="flex items-center gap-2 bg-primary py-1 px-2 w-fit text-white rounded mb-2 float-right"
        >
          <Icon icon="material-symbols:cloud-download-outline" />
          <span className="text-sm">Download</span>
        </Link>
        <img src={project?.original_image_file} alt="" />
      </Modal>
    </div>
  );
}

export default JobDetails;
