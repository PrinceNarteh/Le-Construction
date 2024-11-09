import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import WebsiteProjectForm from "../../components/forms/website/WebsiteProjectForm";
import Modal from "../../components/shared/Modal";
import { useCompanySelector } from "../../hooks/useCompanySelector";
import useConfirm from "../../hooks/useConfirm";
import useMutate from "../../hooks/useMutate";
import { useSetCompany } from "../../hooks/useSetCompany";
import ProjectDetails from "./ProjectDetails";
import { useWebsiteSelector } from "../../hooks/useWebsiteSelector";
import { setWebsite } from "../../app/feature/company/websiteSlice";

const Projects = () => {
  const { company } = useCompanySelector();
  const [project, setProject] = useState(null);
  const [openProjectDetails, setOpenProjectDetails] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const { website } = useWebsiteSelector();

  //console.log('website:::', website);

  const handleDetails = (project) => {
    setOpenProjectDetails(true);
    setProject(project);
  };

  const setCompany = useSetCompany();
  const { mutate } = useMutate(["delete-feature"]);
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const handleDelete = async (project) => {
    const isConfirmed = await confirm({
      title: "Are You Sure?",
      message: `Are you sure you want to delete "${project?.title}"?`,
    });

    if (isConfirmed) {
      const toastId = toast.loading(`Deleting ${project?.title}...`);
      const data = {
        company_id: company?.website_id,
        title: project?.title,
      };

      mutate(
        {
          url: "/website/project/delete",
          method: "PATCH",
          data,
        },
        {
          onSuccess(data) {
            setWebsite(data.message);
            toast.dismiss(toastId);
            toast.success(`${project?.title} deleted successfully`);
            setIsOpen(false);
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
    if (!openProjectDetails) {
      setProject(null);
    }
  }, [openProjectDetails]);

  return (
    <div className="px-5 md:px-10">
      <div className="mb-10 flex justify-between items-center">
        <h3 className="font-semibold text-blue-900 text-3xl">
          Project Section
        </h3>

        <button
          onClick={() => setOpenForm(true)}
          className="bg-primary py-2 px-4 text-xs rounded-md text-white flex items-center gap-1"
        >
          <Icon icon="ant-design:plus-circle-outlined" className="font-bold" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid grid-auto-fit-md gap-5">
        {website?.projects.map((project, idx) => (
          <div
            key={idx}
            className="h-68 max-w-[400px] bg-white rounded-xl p-4 group"
          >
            <div className="h-[25px] flex justify-between items-center gap-1 mb-2">
              <p className="text-blue-900 text-md font-bold leading-normal line-clamp-1">
                {project.title}
              </p>
            </div>
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={project.thumbnail_image}
                alt=""
                className="h-32 w-full object-cover"
              />
            </div>
            <div className="justify-between items-center flex mt-2">
              <div className="flex items-center">
                <Icon
                  icon="mdi:map-marker-radius"
                  className=" h-4 w-4 text-slate-400 mr-1"
                />
                <div className="text-blue-900 text-xs font-semibold">
                  Location:
                </div>
              </div>
              <p className="text-xs text-gray-800 font-semibold">
                {project.info.location}
              </p>
            </div>
            <div className="w-full flex justify-between mt-2">
              <div className="flex items-center">
                <Icon
                  icon="lets-icons:user-cicrle"
                  className=" h-4 w-4 text-slate-400 mr-1"
                />
                <h6 className="text-blue-900 text-xs font-semibold">Client:</h6>
              </div>
              <p className="text-gray-800 text-xs font-semibold">
                {project.info.client}
              </p>
            </div>
            <div className="flex justify-center gap-10 pt-1 mt-3">
              <Icon
                onClick={() => handleDetails(project)}
                icon="icon-park-twotone:view-grid-detail"
                className="text-primary cursor-pointer"
                fontSize={20}
              />
              <Icon
                onClick={() => handleDelete(project)}
                icon="fluent:delete-28-regular"
                className="text-red-500 cursor-pointer"
                fontSize={20}
              />
            </div>
          </div>
        ))}
      </div>

      <Modal
        start
        width="max-w-3xl"
        openModal={openForm}
        disableClickedOutside
        closeModal={setOpenForm}
      >
        <WebsiteProjectForm setOpenForm={setOpenForm} />
      </Modal>

      {/* Project Details */}
      <Modal
        start
        openModal={openProjectDetails}
        closeModal={setOpenProjectDetails}
      >
        <ProjectDetails project={project} />
      </Modal>

      <ConfirmationDialog />
    </div>
  );
};

export default Projects;
