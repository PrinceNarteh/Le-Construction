import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ExperienceForm from "../../components/forms/website/ExperienceForm";
import Modal from "../../components/shared/Modal";
import { useCompanySelector } from "../../hooks/useCompanySelector";
import useConfirm from "../../hooks/useConfirm";
import useMutate from "../../hooks/useMutate";
import { useSetCompany } from "../../hooks/useSetCompany";
import { useWebsiteSelector } from "../../hooks/useWebsiteSelector";
import { setWebsite } from "../../app/feature/company/websiteSlice";

const Experiences = () => {
  const { company } = useCompanySelector();
  const [openModal, setOpenModal] = useState(false);
  const [experience, setExperience] = useState(false);
  const { website } = useWebsiteSelector();

  const handleEdit = (experience) => {
    setExperience(experience);
    setOpenModal(true);
  };

  const setCompany = useSetCompany();
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const { mutate } = useMutate(["delete-about-experience"]);
  const handleDelete = async (experience) => {
    const isConfirmed = await confirm({
      title: "Are You Sure?",
      message: `Are you sure you want to delete "${experience?.title}"?`,
    });

    if (isConfirmed) {
      const toastId = toast.loading(`Deleting ${experience?.title}...`);
      const data = {
        company_id: company?.website_id,
        title: experience?.title,
      };

      mutate(
        {
          url: "/website/about/delete/experience",
          method: "PATCH",
          data,
        },
        {
          onSuccess(data) {
            if (data?.message?.message === "Website not found") {
              toast.dismiss(toastId);
              setIsOpen(false);
              toast.error(data.message.message);
            } else {
              setWebsite(data.message);
              toast.dismiss(toastId);
              toast.success(`${experience?.title} deleted successfully`);
              setIsOpen(false);
            }
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
    if (!openModal) {
      setExperience(null);
    }
  }, [openModal]);

  return (
    <div className="mx-auto mt-10">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-semibold text-blue-900 text-3xl">Experiences</h3>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-primary text-white w-44 py-3 px-5 rounded-md text-xs font-bold"
        >
          + Add Experience
        </button>
      </div>
      <div className="bg-white rounded-lg p-5">
        <div className="flex px-2 text-slate-400 text-[14px] font-bold leading-tight">
          <div className="w-10">SN</div>
          <div className="w-28">Image</div>
          <div className="flex-1">Title</div>
          <div className="flex-[2]">Description</div>
          <div className="w-24">Actions</div>
        </div>

        <div className="border-b p-3 w-full flex justify-center border-slate-100"></div>

        {website?.about_us_experience?.map((experience, idx) => (
          <div
            key={idx}
            className="flex items-center px-2 text-slate-400 text-[14px] font-bold leading-tight mt-3 border-b border-slate-100"
          >
            <div className="w-10">{idx + 1}</div>

            <div className="w-28">
              <div className="w-10 h-10 rounded-full overflow-hidden text-blue-900 text-[15px] font-bold leading-snug">
                <img
                  src={experience.image}
                  alt=""
                  className="h-20 w-36 object-cover rounded-md"
                />
              </div>
            </div>

            <div className="flex-1 text-blue-900 text-[15px] font-bold leading-snug capitalize">
              {experience.title}
            </div>

            <div className="flex-[2] text-blue-900 text-[15px] font-bold leading-snug">
              <h3 className="line-clamp-1">{experience.description}</h3>
            </div>

            <div className="w-24 flex gap-3 items-center cursor-pointer">
              <button
                onClick={() => handleEdit(experience)}
                className="py-2 text-left"
              >
                <Icon
                  icon="iconamoon:edit-light"
                  className="h-5 w-5 ml-3 text-blue-900"
                />
              </button>
              <button onClick={() => handleDelete(experience)} className="p-2">
                <Icon
                  icon="fluent:delete-28-regular"
                  className="h-5 w-5 text-red-500"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal openModal={openModal} closeModal={setOpenModal}>
        <ExperienceForm experience={experience} closeModal={setOpenModal} />
      </Modal>

      <ConfirmationDialog />
    </div>
  );
};

export default Experiences;
