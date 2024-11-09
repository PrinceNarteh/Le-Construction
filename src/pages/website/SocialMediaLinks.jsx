import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import SocialMediaLinkForm from "../../components/forms/website/SocialMediaLinkForm";
import Modal from "../../components/shared/Modal";
import { useCompanySelector } from "../../hooks/useCompanySelector";
import useConfirm from "../../hooks/useConfirm";
import useMutate from "../../hooks/useMutate";
import { useSetCompany } from "../../hooks/useSetCompany";
import { useWebsiteSelector } from "../../hooks/useWebsiteSelector";
import { setWebsite } from "../../app/feature/company/websiteSlice";

function SocialMediaLinksTable() {
  const { company } = useCompanySelector();
  const { website } = useWebsiteSelector();
  const [openSocialLink, setOpenSocialLink] = useState(false);

  const setCompany = useSetCompany();
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const { mutate } = useMutate(["delete-social-media-link"]);
  
  const handleDelete = async (link) => {
    const isConfirmed = await confirm({
      title: "Are You Sure?",
      message: `Are you sure you want to delete "${link?.name}"?`,
    });

    if (isConfirmed) {
      const toastId = toast.loading(`Deleting ${link?.name}...`);
      const data = {
        company_id: company?.website_id,
        name: link?.name,
      };

      mutate(
        {
          url: "/website/socialmedia/delete/link",
          method: "PATCH",
          data,
        },
        {
          onSuccess(data) {
            setWebsite(data.message);
            toast.dismiss(toastId);
            toast.success(`${link?.name} deleted successfully`);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-semibold text-blue-900 text-3xl">
          Social Links Section
        </h3>
        <button
          onClick={() => setOpenSocialLink(true)}
          className="bg-primary text-white w-44 py-3 px-5 rounded-md text-xs font-bold"
        >
          + Add Social Link
        </button>
      </div>

      <div className="bg-white rounded-lg p-5 mt-7">
        <div className="flex pl-3 pr-3  text-slate-400 text-[14px] font-bold leading-tight">
          <div className="w-10">SL</div>
          <div className="w-40">Socials Name</div>
          <div className="flex-1">Socials Links</div>
          <div className="w-10">Actions</div>
        </div>

        <div className="border-b p-3 w-[100%] flex justify-center border-slate-100"></div>

        <div className="px-2 pb-4 text-slate-400 text-[14px] font-bold leading-tight mt-3 border-b border-slate-100">
          {website?.social_media_links?.map((link, index) => (
            <div key={index} className="flex py-2">
              <div className=" text-blue-900 text-[15px] font-bold leading-snug w-10">
                {index + 1}
              </div>

              <div className="w-40 text-blue-900 text-[15px] font-bold leading-snug">
                {link.name}
              </div>
              <div className="flex-1 text-blue-900 text-[15px] font-bold leading-snug line-clamp-1">
                {link.link}
              </div>

              <button
                onClick={() => handleDelete(link)}
                className="w-10 flex gap-5 items-center cursor-pointer "
              >
                <Icon
                  icon="fluent:delete-28-regular"
                  className="h-5 w-5 text-red-500"
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Modal openModal={openSocialLink} closeModal={setOpenSocialLink}>
        <SocialMediaLinkForm closeModal={setOpenSocialLink} />
      </Modal>

      <ConfirmationDialog />
    </div>
  );
}

export default SocialMediaLinksTable;
