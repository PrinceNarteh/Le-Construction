import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import FeaturesForm from "../../components/forms/website/FeaturesForm";
import Modal from "../../components/shared/Modal";
import { useCompanySelector } from "../../hooks/useCompanySelector";
import useConfirm from "../../hooks/useConfirm";
import useMutate from "../../hooks/useMutate";
import { useSetCompany } from "../../hooks/useSetCompany";
import { useWebsiteSelector } from "../../hooks/useWebsiteSelector";
import { setWebsite } from "../../app/feature/company/websiteSlice";

const Features = () => {
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const { company } = useCompanySelector();
  const [feature, setFeature] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { website } = useWebsiteSelector();

  const handleEdit = (feature) => {
    setFeature(feature);
    setOpenModal(true);
  };

  const setCompany = useSetCompany();
  const { mutate } = useMutate(["delete-feature"]);
  const handleDelete = async (feature) => {
    const isConfirmed = await confirm({
      title: "Are You Sure?",
      message: `Are you sure you want to delete "${feature?.title}"?`,
    });

    if (isConfirmed) {
      const toastId = toast.loading(`Deleting ${feature?.title}...`);
      const data = {
        company_id: company?.website_id,
        title: feature?.title,
      };

      mutate(
        {
          url: "/website/about/delete/feature",
          method: "PATCH",
          data,
        },
        {
          onSuccess(data) {
            if (data?.message?.message === "Website not found") {
              toast.dismiss(toastId);
              toast.error(data.message.message);
            } else {
              setWebsite(data.message);
              toast.dismiss(toastId);
              toast.success(`${feature?.title} deleted successfully`);
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
      setFeature(null);
    }
  }, [openModal]);

  return (
    <div className="mx-auto mt-10">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-semibold text-blue-900 text-3xl">Features</h3>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-primary text-white w-44 py-3 px-10 rounded-md text-xs font-bold"
        >
          + Add Feature
        </button>
      </div>

      <div className="bg-white rounded-lg p-5">
        <div className="flex px-2 text-slate-400 text-[14px] font-bold leading-tight">
          <div className="w-10">SN</div>
          <div className="w-24">Icon</div>
          <div className="flex-1">Title</div>
          <div className="flex-[2]">Description</div>
          <div className="w-24">Actions</div>
        </div>

        <div className="border-b p-3 w-[100%] flex justify-center border-slate-100"></div>

        {website?.about_us_features?.map((feature, idx) => (
          <div
            key={idx}
            className="flex items-center px-2 text-slate-400 text-[14px] font-bold leading-tight mt-3 border-b border-slate-100"
          >
            <div className="w-10">{idx + 1}</div>

            <div className="w-24 flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden text-blue-900 text-[15px] font-bold leading-snug">
                <img
                  src={feature.icon}
                  alt=""
                  className="h-20 w-36 object-cover rounded-md"
                />
              </div>
            </div>

            <div className="flex-1 text-blue-900 text-[15px] font-bold leading-snug capitalize">
              {feature.title}
            </div>

            <div className="flex-[2] text-blue-900 text-[15px] font-bold leading-snug">
              <h3 className="line-clamp-1">{feature.description}</h3>
            </div>

            <div className="w-24 flex gap-3 items-center cursor-pointer">
              <button
                onClick={() => handleEdit(feature)}
                className="py-2 text-left"
              >
                <Icon
                  icon="iconamoon:edit-light"
                  className="h-5 w-5 ml-3 text-blue-900"
                />
              </button>
              <button onClick={() => handleDelete(feature)} className="p-2">
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
        <FeaturesForm feature={feature} closeModal={setOpenModal} />
      </Modal>

      <ConfirmationDialog />
    </div>
  );
};

export default Features;
