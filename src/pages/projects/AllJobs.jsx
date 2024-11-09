import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import Heading from "../../components/layout/Heading";
import Pagination from "../../components/shared/Pagination";
import { queryKeys } from "../../constants";
import useConfirm from "../../hooks/useConfirm";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";
import "@google/model-viewer/dist/model-viewer";
import Modal from "../../components/shared/Modal";
import ProjectForm from "../../components/forms/ProjectForm";
import { Skeleton } from "../../components/skeleton/Skeleton";

const filter = [
  { value: "All", label: "All " },
  { value: "New", label: "New" },
  { value: "Assigned", label: "Assigned" },
  { value: "Approved", label: "Approved" },
  { value: "Started", label: "Started" },
  { value: "wip", label: "Work In Progress" },
  { value: "Done", label: "Completed" },
];

function AllJobs() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("All");
  const [displayProjects, setDisplayProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [openProjectForm, setOpenProjectForm] = useState(false);
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();

  const { data: projects, isLoading } = usePostQuery({
    queryKey: [queryKeys.ProjectsForCompany],
    url: "/projects/for/company",
  });

  const { mutate } = useMutate(["delete-project"]);
  const handleDelete = async (project) => {
    const isConfirmed = await confirm({
      title: "Are You Sure?",
      message: `Are you sure you want to delete "${project.project_name}"?`,
    });

    if (isConfirmed) {
      const toastId = toast.loading(`Deleting ${project.project_name}...`);

      mutate(
        {
          url: "/project/delete",
          method: "DELETE",
          data: {
            project_id: project._id,
          },
        },
        {
          async onSuccess() {
            queryClient.setQueryData([queryKeys.AllJobs], (oldData) => ({
              message: (oldData?.message ?? []).filter(
                (item) => item._id !== project._id,
              ),
            }));
            toast.dismiss(toastId);
            toast.success(
              `Project "${project.project_name}" has been deleted successfully`,
            );
            setIsOpen(false);
          },
          onError(error) {
            toast.dismiss(toastId);
            toast.error(error.response.data.message);
            setIsOpen(false);
          },
        },
      );
    }
  };

  useEffect(() => {
    if (projects?.message) {
      if (active === "All") {
        setFilteredProjects(projects?.message);
      } else {
        setFilteredProjects(
          projects?.message.filter((project) => project.status === active),
        );
      }
    }
  }, [projects?.message, active]);

  useEffect(() => {
    if (search === "") {
      setFilteredProjects(projects?.message ?? []);
    } else {
      const data = projects?.message.filter((project) =>
        project.project_name.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredProjects(data);
    }
  }, [search, projects?.message]);

  return (
    <div className="">
      <div className=" px-8 flex justify-between items-center">
        <Heading label="All Projects" />
      </div>

      <div className="pb-10 px-8">
        <div className="flex justify-between items-center mt-5">
          <div className="text-blue-900 text-xl font-bold leading-10">
            Project Board
          </div>

          <button
            onClick={() => setOpenProjectForm(true)}
            className="text-gray-50 font-bold leading-snug bg-primary py-1.5 px-4 rounded"
          >
            <span className="mr-1">+</span>New project
          </button>
        </div>

        <div className="flex justify-between mt-5">
          <div className="h-11 w-72 bg-[#F4F6FB] flex ml-2 rounded-lg mr-3 border border-slate-600">
            <Icon icon="circum:search" className="mt-[0.8rem] h-5 w-5 ml-3" />

            <input
              type="search"
              name="name"
              placeholder="Search "
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#F4F6FB] w-10/12 outline-none p-2 placeholder:text-gray-700 text-sm placeholder:font-normal placeholder:mb-3"
            />
          </div>
          <div className="space-x-3">
            <div className="p-[7px] rounded-lg shadow border border-slate-300 justify-center items-center gap-2.5 inline-flex">
              <Icon
                icon="system-uicons:filter"
                className="h-6 w-6 text-slate-500"
              />

              <select
                name=""
                id=""
                onChange={(e) => setActive(e.target.value)}
                className="outline-none text-lg"
              >
                {filter.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            {/* <div className="w-[38px] h-[38px] p-[7px] rounded-lg shadow border border-slate-300 justify-center items-center gap-2.5 inline-flex">
              <Icon icon="uil:sort" className="h-6 w-6 text-slate-500" />
            </div>
            <div className="w-[38px] h-[38px] p-[7px] rounded-lg shadow border border-slate-300 justify-center items-center gap-2.5 inline-flex">
              <Icon
                icon="solar:calendar-date-outline"
                className="h-6 w-6 text-slate-500"
              />
            </div>
            <div className="w-[38px] h-[38px] p-[7px] rounded-lg shadow border border-slate-300 justify-center items-center gap-2.5 inline-flex">
              <Icon
                icon="fluent:table-edit-20-regular"
                className="h-6 w-6 text-slate-500"
              />
            </div> */}
          </div>
        </div>

        <div className="grid grid-auto-fit-md gap-5 mt-10">
          {isLoading && (
            <>
              {Array(7)
                .fill(null)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="h-68 min-w-full w-full bg-white/60 rounded-xl p-4 group"
                  >
                    <div className="h-[25px] flex justify-between items-center gap-1 mb-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-32 w-full rounded-lg" />
                    <div className="justify-between items-center flex mt-2">
                      <Skeleton className="w-20 h-4" />
                      <Skeleton className="w-20 h-4" />
                    </div>
                    <div className="justify-between items-center flex mt-2">
                      <Skeleton className="w-16 h-4" />
                      <Skeleton className="w-28 h-4" />
                    </div>
                  </div>
                ))}
            </>
          )}
          <>
            {displayProjects.map((project, index) => (
              <div
                key={index}
                className="h-68 mw-full w-full bg-white rounded-xl p-4 group"
              >
                <div className="h-[25px] flex justify-between items-center gap-1 mb-2">
                  <p className="text-blue-900 text-md font-bold leading-normal line-clamp-1">
                    {project.project_name}
                  </p>
                  <div className="text-sm text-orange-500 font-bold leading-normal whitespace-nowrap">
                    <Link to={`/projects/${project._id}`}>View details</Link>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg">
                  <button
                    onClick={() => handleDelete(project)}
                    className="absolute flex justify-center items-center w-12 rounded-l-3xl h-10 right-0 bottom-0 backdrop-blur-sm transform translate-x-12 bg-white/50 group-hover:translate-x-0 duration-300"
                  >
                    <Icon
                      icon="fluent:delete-28-regular"
                      className="text-[red] text-xl"
                    />
                  </button>
                  {project?.file_type === "usdz" ? (
                    <div className="h-32 w-full object-cover bg-black/50">
                      <model-viewer
                        src={project?.project_images[0]}
                        // ios-src="/images/scanned.usdz"
                        alt={project?.project_name}
                        shadow-intensity="1"
                        camera-controls
                        auto-rotate
                        ar
                        style={{ width: "100%", height: "100%" }}
                        camera-orbit="0deg 90deg 0deg 8.37364m"
                        ar-modes="webxr scene-viewer quick-look"
                        autoplay
                        interaction-prompt-threshold="0"
                        exposure="1.0"
                        seamless-poster
                        environment-image="neutral"
                        id="first"
                      ></model-viewer>
                    </div>
                  ) : (
                    <img
                      src={project?.project_images[0]}
                      alt=""
                      className="h-32 w-full object-cover"
                    />
                  )}
                  {/* {project?.project_images && (
                  <img
                    src={
                      project.has_ar
                        ? "/images/ar-placeholder.png"
                        : project?.project_images[0]
                    }
                    alt=""
                    className="h-32 w-full object-cover"
                  />
                )} */}
                </div>
                <div className="justify-between items-center flex mt-2">
                  <div className="flex items-center">
                    <Icon
                      icon="solar:calendar-date-outline"
                      className=" h-4 w-4 text-slate-400 mr-1"
                    />
                    <div className="text-blue-900 text-xs font-semibold">
                      Start Date:
                    </div>
                  </div>
                  <p className="text-xs text-gray-800 font-semibold">
                    {project.start_date}
                  </p>
                  {/* <div
                  className={`py-1.5 px-3 ${statusColor(
                    project.status
                  )} rounded-lg justify-center items-center gap-[6.21px] inline-flex`}
                >
                  <div className={`text-xs font-semibold leading-tight`}>
                    {project.status}
                  </div>
                </div> */}
                </div>
                <div className="w-full flex justify-between mt-2">
                  <div className="flex items-center">
                    <Icon
                      icon="lets-icons:user-cicrle"
                      className=" h-4 w-4 text-slate-400 mr-1"
                    />
                    <h6 className="text-blue-900 text-xs font-semibold">
                      Client:
                    </h6>
                  </div>
                  <p className="text-gray-800 text-xs font-semibold">
                    {`${project.client?.first_name} ${project.client?.last_name}`}
                  </p>
                </div>
              </div>
            ))}
          </>
        </div>

        {/* Pagination */}
        <Pagination
          data={filteredProjects}
          setDisplayProjects={setDisplayProjects}
        />
      </div>

      <Modal
        start={true}
        width="max-w-5xl"
        openModal={openProjectForm}
        closeModal={setOpenProjectForm}
        disableClickedOutside={true}
      >
        <ProjectForm setOpenProjectForm={setOpenProjectForm} />
      </Modal>

      {ConfirmationDialog()}
    </div>
  );
}

export default AllJobs;
