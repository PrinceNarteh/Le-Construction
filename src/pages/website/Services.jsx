import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import ServicesForm from "../../components/forms/website/ServicesForm";
import Modal from "../../components/shared/Modal";
import { useCompanySelector } from "../../hooks/useCompanySelector";
import useConfirm from "../../hooks/useConfirm";
import { toast } from "react-hot-toast";
import useMutate from "../../hooks/useMutate";
import { useDispatch } from "react-redux";
import { setCompany } from "../../app/feature/company/companySlice";
import { useWebsiteSelector } from "../../hooks/useWebsiteSelector";
import { setWebsite } from "../../app/feature/company/websiteSlice";

function Services() {
  const { company } = useCompanySelector();
  const { website } = useWebsiteSelector();
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const [service, setService] = useState(null);
  const [openServiceDetails, setOpenServiceDetails] = useState(false);
  const [openServiceForm, setOpenServiceForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();

  const handleDetails = (service) => {
    setService(service);
    setOpenServiceDetails(true);
  };

  const handleEdit = (service) => {
    setService(service);
    setOpenServiceForm(true);
  };

  const { mutate } = useMutate();
  const handleDelete = async (service) => {
    const isConfirmed = await confirm({
      title: "Are You Sure?",
      message: `Are you sure you want to delete "${service.title}"?`,
    });

    if (isConfirmed) {
      const toastId = toast.loading(`Deleting ${service?.title}...`);
      const data = {
        company_id: company?.website_id,
        title: service?.title,
      };

      mutate(
        {
          url: "/website/feature/delete",
          method: "PATCH",
          data,
        },
        {
          onSuccess(data) {
            dispatch(setWebsite(data.message));
            toast.dismiss(toastId);
            toast.success(`${service?.title} deleted successfully`);
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
    if (!openServiceDetails && !openServiceForm) {
      setService(null);
    }
  }, [openServiceDetails, openServiceForm]);

  return (
    <div className="mx-auto mt-10">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-blue-900 text-3xl">Services</h3>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-primary text-white w-44 py-3 px-5 rounded-md text-xs font-bold"
        >
          + Add Services
        </button>
      </div>
      <div className="flex flex-wrap gap-5 place-content-center py-5">
        {website?.services?.map((service, index) => (
          <div
            key={index}
            className="p-3 flex gap-3 w-[360px] bg-white rounded-xl"
          >
            <img
              src={service.icon}
              alt=""
              className="w-24 h-28 shrink-0 object-cover object-center rounded-md"
            />
            <div>
              <h4 className="text-blue-900 font-bold line-clamp-1">
                {service.title}
              </h4>
              <p className="h-16 w-full line-clamp-3 text-sm mt-0.5">
                {service.description}
              </p>
              <div className="flex justify-between gap-5 pt-1 w-8/12 mx-auto">
                <Icon
                  onClick={() => handleDetails(service)}
                  icon="icon-park-twotone:view-grid-detail"
                  className="text-primary cursor-pointer"
                  fontSize={20}
                />
                <Icon
                  onClick={() => handleEdit(service)}
                  icon="iconamoon:edit-light"
                  className="text-primary cursor-pointer"
                  fontSize={20}
                />
                <Icon
                  onClick={() => handleDelete(service)}
                  icon="fluent:delete-28-regular"
                  className="text-red-500 cursor-pointer"
                  fontSize={20}
                />
              </div>
            </div>
          </div>
        ))}
        <Modal openModal={openModal} closeModal={setOpenModal}>
          <ServicesForm closeModal={setOpenModal} />
        </Modal>
      </div>

      {/* Service Details */}
      <Modal openModal={openServiceDetails} closeModal={setOpenServiceDetails}>
        <div>
          <img src={service?.icon} alt="" className="w-full h-80 rounded-md" />
          <h5 className="text-center text-2xl text-blue-900 font-bold mt-5 mb-2">
            {service?.title}
          </h5>
          <p className="leading-relaxed text-gray-700 text-justify">
            {service?.description}
          </p>
        </div>
      </Modal>

      {/* Service Form */}
      <Modal openModal={openServiceForm} closeModal={setOpenServiceForm}>
        <ServicesForm service={service} closeModal={setOpenServiceForm} />
      </Modal>

      {ConfirmationDialog()}
    </div>
  );
}

export default Services;
