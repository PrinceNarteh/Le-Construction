import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import PartnerForm from "../../components/forms/website/PartnerForm";
import Modal from "../../components/shared/Modal";
import { useCompanySelector } from "../../hooks/useCompanySelector";
import useConfirm from "../../hooks/useConfirm";
import useMutate from "../../hooks/useMutate";
import { useSetCompany } from "../../hooks/useSetCompany";
import { useWebsiteSelector } from "../../hooks/useWebsiteSelector";
import { setWebsite } from "../../app/feature/company/websiteSlice";

function Partners() {
  const { company } = useCompanySelector();
  const { website } = useWebsiteSelector();
  const [openModal, setOpenModal] = useState(false);

  const setCompany = useSetCompany();
  const { mutate } = useMutate(["delete-partner"]);
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const handleDelete = async (partner) => {
    const isConfirmed = await confirm({
      title: "Are You Sure?",
      message: `Are you sure you want to delete "${partner?.name}"?`,
    });

    if (isConfirmed) {
      const toastId = toast.loading(`Deleting ${partner?.name}...`);
      const data = {
        company_id: company?.website_id,
        name: partner?.name,
      };

      mutate(
        {
          url: "/website/about/delete/partner",
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
              toast.success(`${partner?.name} deleted successfully`);
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

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-blue-900 text-3xl">Partners</h3>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-primary text-white w-44 py-3 px-5 rounded-md text-xs font-bold"
        >
          + Add Partner
        </button>
      </div>
      <div className="bg-white rounded-lg p-5 mt-3">
        <div className="flex pl-3 pr-3  text-slate-400 text-[14px] font-bold leading-tight">
          <div className="w-10">SN</div>
          <div className="flex-1">Name</div>
          <div className="flex-1">Link</div>
          <div className="w-10">Actions</div>
        </div>

        <div className="border-b p-3 w-[100%] flex justify-center border-slate-100"></div>

        <div className=" px-2 pb-4 text-slate-400 text-[14px] font-bold leading-tight mt-3 border-b border-slate-100">
          {website?.about_us_partners?.map((partner, index) => (
            <div key={index} className="flex items-center py-2">
              <div className="w-10">{index + 1}</div>

              <div className="flex-1 flex items-center gap-3">
                <img
                  src={partner.image}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <h5 className="text-blue-900 text-[15px] font-bold leading-snug">
                  {partner.name}
                </h5>
              </div>

              <a
                href={partner.link}
                target="_blank"
                className="flex-1 cursor-pointer"
                rel="noreferrer"
              >
                {partner.link}
              </a>

              <div className="flex gap-5 items-center cursor-pointer ">
                <button onClick={() => handleDelete(partner)}>
                  <Icon
                    icon="fluent:delete-28-regular"
                    className="h-5 w-5 text-red-500"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal openModal={openModal} closeModal={setOpenModal}>
        <PartnerForm setOpenModal={setOpenModal} />
      </Modal>

      <ConfirmationDialog />
    </div>
  );
}

export default Partners;
