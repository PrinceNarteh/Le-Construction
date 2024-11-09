import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

import { setCompany } from "../../app/feature/company/companySlice";
import TestimonialsForm from "../../components/forms/website/TestimonialsForm";
import Modal from "../../components/shared/Modal";
import { useCompanySelector } from "../../hooks/useCompanySelector";
import useConfirm from "../../hooks/useConfirm";
import useMutate from "../../hooks/useMutate";
import { useWebsiteSelector } from "../../hooks/useWebsiteSelector";
import { setWebsite } from "../../app/feature/company/websiteSlice";

function Testimonials() {
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const { company } = useCompanySelector();
  const { website } = useWebsiteSelector();
  const [openModal, setOpenModal] = useState(false);
  const [testimonial, setTestimonial] = useState(null);
  const dispatch = useDispatch();

  const { mutate } = useMutate(["delete-testimonial"]);
  const handleDelete = async (testimonial) => {
    const isConfirmed = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to delete "${testimonial.name}'s" testimony?`,
    });

    if (isConfirmed) {
      const toastId = toast.loading("Deleting testimony...");
      const data = {
        company_id: company.website_id,
        name: testimonial.name,
      };
      mutate(
        {
          url: "/website/testimonial/delete",
          method: "PATCH",
          data,
        },
        {
          onSuccess(data) {
            dispatch(setWebsite(data.message));
            toast.dismiss(toastId);
            toast.success("Testimonial deleted successfully");
            setIsOpen(false);
          },
          onError(error) {
            toast.dismiss(toastId);
            if (error.code === "ERR_NETWORK") {
              toast.error("Network Error!");
            } else {
              toast.error(error.response.data.message);
            }
          },
        }
      );
    }
  };

  useEffect(() => {
    if (!openModal) {
      setTestimonial(null);
    }
  }, [openModal]);

  return (
    <div>
      <div className="mx-6 mb-5 flex justify-between items-center">
        <h3 className="font-semibold text-blue-900 text-3xl">
          Testimonial Section
        </h3>
        <button
          onClick={() => setOpenModal(true)}
          className="w-44 py-3  bg-primary text-white rounded-md font-semibold"
        >
          + Add Testimonial
        </button>
      </div>
      <div className="flex justify-center gap-5 flex-wrap mb-10">
        {website?.testimonials?.map((testimonial, index) => (
          <div
            key={index}
            className="relative w-60 h-[280px] overflow-hidden bg-white p-5 flex flex-col items-center rounded-md capitalize group"
          >
            <div className="bottom-0 right-0 bg-gray-100 absolute transform translate-x-[90px] flex gap-1 items-center cursor-pointer group-hover:translate-x-0 duration-300">
              <button
                onClick={() => {
                  setTestimonial(testimonial);
                  setOpenModal(true);
                }}
                className="py-2 text-left hover:bg-gray-200"
              >
                <Icon
                  icon="iconamoon:edit-light"
                  className="h-5 w-10 text-blue-900"
                />
              </button>
              <button
                onClick={() => handleDelete(testimonial)}
                className="p-2 hover:bg-gray-200"
              >
                <Icon
                  icon="fluent:delete-28-regular"
                  className="h-5 w-5 text-red-500"
                />
              </button>
            </div>
            <img
              src={testimonial.profile_image}
              alt=""
              className="w-28 h-28 rounded-full border-2"
            />
            <div className="py-3 text-center">
              <h2 className="uppercase text-gray-700 font-semibold">
                {testimonial.name}
              </h2>
              <h3 className="text-xs tracking-widest">
                {testimonial.designation}
              </h3>
            </div>
            <div className="h-[60px] flex items-center">
              <p className="italic text-sm text-center line-clamp-3">
                {testimonial.description}
              </p>
            </div>
          </div>
        ))}
        <Modal start openModal={openModal} closeModal={setOpenModal}>
          <TestimonialsForm
            testimonial={testimonial}
            closeModal={setOpenModal}
          />
        </Modal>

        {ConfirmationDialog()}
      </div>
    </div>
  );
}

export default Testimonials;
