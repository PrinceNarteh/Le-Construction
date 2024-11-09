import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useCompanySelector } from "../../hooks/useCompanySelector";
import useMutate from "../../hooks/useMutate";
import { useUserSelector } from "../../hooks/useUserSelector";
import showPartial from "../../utils/showPartial";
import InputField from "../shared/InputField";
import Item from "../shared/Item";
import Modal from "../shared/Modal";
import { setCompany } from "../../app/feature/company/companySlice";
import { useDispatch } from "react-redux";

function PaymentGateway() {
  const { user } = useUserSelector();
  const { company } = useCompanySelector();
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();

  //console.log("company:::", company);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_id: company ? company?._id : user?.company_id,
      name: company?.payment_config.name, //company ? company?.payment_config.name : user?.company.payment_config?.name,
      public_key: company?.payment_config.public_key, //company ? company?.payment_config.public_key : user?.company.payment_config?.public_key,
      secret_key: company?.payment_config.secret_key, //company ? company?.payment_config.secret_key : user?.company.payment_config?.secret_key,
      webhook: company?.payment_config.webhook, //company ? company?.payment_config.webhook : user?.company.payment_config?.webhook,
    },
  });

  const { mutate } = useMutate(["add-payment-gateway"]);
  const submitHandler = (data) => {
    const toastId = toast.loading("Updating Payment Gateway...");
    data.company_id = user?.company_id;

    //console.log(data);
    mutate(
      {
        url: "/thirdparty/payment/config",
        method: "PATCH",
        data,
      },
      {
        onSuccess(data) {
          toast.dismiss(toastId);
          toast.success("Payment Gateway updated successfully!");
          dispatch(setCompany(data.message))
          setOpenModal(false);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error("Error adding payment option");
        },
      }
    );
  };

  return (
    <div className="px-20 mt-5">
      <div className="">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-semibold text-blue-900 text-3xl">
            Payment Gateway
          </h3>
          <button
            onClick={() => setOpenModal(true)}
            className="bg-primary flex items-center text-white py-2 px-7 rounded-md text-xs font-bold"
          >
            <Icon icon="iconamoon:edit-light" className="mr-2" />
            Edit
          </button>
        </div>
        <div className="bg-white rounded-lg p-10">
          <div>
            <Item label="Name" value={company?.payment_config?.name} />
            <Item
              label="Public Key"
              value={showPartial(company?.payment_config?.public_key ?? "")}
            />
            <Item
              label="Secret Key"
              value={showPartial(company?.payment_config?.secret_key ?? "")}
            />
            <Item
              label="Web Hook"
              value={showPartial(company?.payment_config?.webhook ?? "")}
            />
          </div>
        </div>
      </div>

      <Modal openModal={openModal} closeModal={setOpenModal}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="bg-white w-full rounded-xl p-5">
            <div className="text-blue-900 text-2xl font-bold leading-10 mb-5">
              Payment Gateway
            </div>
            <div className="space-y-2">
              <div className="w-full">
                <InputField
                  label="Name"
                  name="name"
                  register={register}
                  errors={errors}
                  placeholder="Payment Gateway Name"
                  required
                  errorMessage="Payment system name is required"
                />
              </div>
              <div className="w-full">
                <InputField
                  label="Public Key"
                  name="public_key"
                  register={register}
                  errors={errors}
                  required
                  placeholder="Public Key"
                  errorMessage="Public key is required"
                />
              </div>
              <div className="w-full">
                <InputField
                  label="Secret Key"
                  name="secret_key"
                  register={register}
                  errors={errors}
                  required
                  placeholder="Secret Key"
                  errorMessage="Secret key is required"
                />
              </div>
              <div className="w-full">
                <InputField
                  label="Web Hook"
                  name="webhook"
                  register={register}
                  errors={errors}
                  required
                  placeholder="Web Hook"
                  errorMessage="Web Hook is required"
                />
              </div>
            </div>

            <div className="flex gap-5 justify-end mr-">
              <div className="w-48 mt-5 h-12 py-5 bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex">
                <button className="text-white text-md font-bold leading-loose">
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default PaymentGateway;