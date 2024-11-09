import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

import { setCompany } from "../../app/feature/company/companySlice";
import FaqForm from "../../components/forms/website/FaqForm";
import Modal from "../../components/shared/Modal";
import { useCompanySelector } from "../../hooks/useCompanySelector";
import useConfirm from "../../hooks/useConfirm";
import useMutate from "../../hooks/useMutate";
import { useWebsiteSelector } from "../../hooks/useWebsiteSelector";
import { setWebsite } from "../../app/feature/company/websiteSlice";

function FAQ() {
  const { confirm, ConfirmationDialog, setIsOpen } = useConfirm();
  const { company } = useCompanySelector();
  const { website } = useWebsiteSelector();
  const [faq, setFaq] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const dispatch = useDispatch();
  const { mutate } = useMutate(["delete-faq"]);
  const handleDelete = async (question) => {
    const yes = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to delete "${question}"`,
    });

    if (yes) {
      const toastId = toast.loading("Deleting FAQ...");
      mutate(
        {
          url: "/website/faq/delete",
          method: "PATCH",
          data: {
            question,
            company_id: company.website_id,
          },
        },
        {
          onSuccess(data) {
            dispatch(setWebsite(data.message));
            toast.dismiss(toastId);
            toast.success("FAQ deleted successfully");
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
    if (!openModal) {
      setFaq(null);
    }
  }, [openModal]);

  return (
    <div className="px-7">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-semibold text-blue-900 text-3xl">FAQ Section</h3>
        <button
          onClick={() => setOpenModal(true)}
          className="w-44 py-3 px-5 bg-primary text-white text-sm rounded-md font-semibold"
        >
          + Add FAQ
        </button>
      </div>
      <div className="bg-white rounded-lg p-5 mt-7">
        <div className="flex pl-3 pr-3  text-slate-400 text-[14px] font-bold leading-tight">
          <div className="w-10">SL</div>
          <div className="flex-1">Question</div>
          <div className="flex-[2]">Answer</div>
          <div className="w-24">Actions</div>
        </div>

        <div className="border-b p-3 w-[100%] flex justify-center border-slate-100"></div>
        {website?.plans_faq?.map((faq, index) => (
          <div
            key={index}
            className="flex items-center px-2 pb-4 text-slate-400 text-[14px] font-bold leading-tight mt-3 border-b border-slate-100"
          >
            <div className="flex items-center w-10">
              <div className=" text-blue-900 text-[15px] font-bold leading-snug">
                {index + 1}
              </div>
            </div>

            <div className="flex-1 text-blue-900 text-[15px] font-bold leading-snug">
              <h3 className="truncate">{faq.question}</h3>
            </div>
            <div className="flex-[2] text-blue-900 text-[15px] font-bold leading-snug">
              <h3 className="truncate">{faq.answer}</h3>
            </div>

            <div className="flex gap-5 items-center cursor-pointer w-24">
              <button
                onClick={() => {
                  setFaq(faq);
                  setOpenModal(true);
                }}
                className="py-2 text-left hover:bg-gray-200"
              >
                <Icon
                  icon="iconamoon:edit-light"
                  className="h-5 w-10 text-blue-900"
                />
              </button>
              <button onClick={() => handleDelete(faq.question)}>
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
        <FaqForm faq={faq} closeModal={setOpenModal} />
      </Modal>
      {ConfirmationDialog()}
    </div>
  );
}

export default FAQ;
