import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

import FunFactForm from "../../components/forms/website/FunFactForm";
import Modal from "../../components/shared/Modal";
import { useCompanySelector } from "../../hooks/useCompanySelector";
import useConfirm from "../../hooks/useConfirm";
import useMutate from "../../hooks/useMutate";
import { useSetCompany } from "../../hooks/useSetCompany";
import { useWebsiteSelector } from "../../hooks/useWebsiteSelector";
import { setWebsite } from "../../app/feature/company/websiteSlice";

function FunFacts() {
  const { company } = useCompanySelector();
  const { website } = useWebsiteSelector();
  const [openModal, setOpenModal] = useState(false);

  const setCompany = useSetCompany();
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const { mutate } = useMutate(["delete-fun-fact"]);
  const handleDelete = async (funFact) => {
    const isConfirmed = await confirm({
      title: "Are You Sure?",
      message: `Are you sure you want to delete "${funFact?.title}"?`,
    });

    if (isConfirmed) {
      const toastId = toast.loading(`Deleting ${funFact?.title}...`);
      const data = {
        company_id: company?.website_id,
        title: funFact?.title,
      };


      mutate(
        {
          url: "/website/about/delete/funfact",
          method: "PATCH",
          data,
        },
        {
          onSuccess(data) {
            setWebsite(data.message);
            toast.dismiss(toastId);
            toast.success(`${funFact?.title} deleted successfully`);
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
    <div className="px-7">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-semibold text-blue-900 text-3xl">
          Fun Facts Section
        </h3>
        <button
          onClick={() => setOpenModal(true)}
          className="w-44 py-3 px-5 bg-primary text-white text-sm rounded-md font-semibold"
        >
          + Add Fun Fact
        </button>
      </div>
      <div className="bg-white rounded-lg p-5 mt-5 mx-auto">
        <div className="flex px-2 text-slate-400 text-[14px] font-bold leading-tight">
          <div className="w-10">SN</div>
          <div className="flex-1">Title</div>
          <div className="w-40">Count</div>
          <div className="w-40">Icon</div>
          <div className="w-24 text-center">Actions</div>
        </div>

        <div className="border-b p-3 w-[100%] flex justify-center border-slate-100"></div>

        {website?.about_us_fun_facts?.map((fun, idx) => (
          <div
            key={idx}
            className="flex items-center px-2 text-slate-400 text-[14px] font-bold leading-tight mt-3 border-b border-slate-100"
          >
            <div className="w-10">{idx + 1}</div>

            <div className="flex-1 text-blue-900 text-[15px] font-bold leading-snug capitalize">
              {fun.title}
            </div>

            <div className="w-40 text-blue-900 text-[15px] font-bold leading-snug">
              <h3 className="truncate">{fun.count}</h3>
            </div>
            <div className="w-40 flex items-center">
              <div className="w-14 h-14 rounded-full overflow-hidden text-blue-900 text-[15px] font-bold leading-snug">
                <img
                  src={fun.icon}
                  alt=""
                  className="h-20 w-36 object-cover rounded-md"
                />
              </div>
            </div>

            <div className="w-24 flex justify-center text-center">
              <Link onClick={() => handleDelete(fun)} className="p-2">
                <Icon
                  icon="fluent:delete-28-regular"
                  className="h-5 w-5 text-red-500"
                />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Modal openModal={openModal} closeModal={setOpenModal}>
        <FunFactForm closeModal={setOpenModal} />
      </Modal>

      <ConfirmationDialog />
    </div>
  );
}

export default FunFacts;
