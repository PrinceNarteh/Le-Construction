import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { format } from "libphonenumber-js";
import useMutate from "../../hooks/useMutate";
import { useUserSelector } from "../../hooks/useUserSelector";
import showPartial from "../../utils/showPartial";
import InputField from "../shared/InputField";
import Item from "../shared/Item";
import Modal from "../shared/Modal";

function SMS() {
  const { user } = useUserSelector();
  const [openModal, setOpenModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_id: user._id,
      name: "",
      sid: "",
      token: "",
      phone_number: "",
    },
  });

  const { mutate } = useMutate(["add-sms-gateway"]);
  const submitHandler = (data) => {
    const toastId = toast.loading("Updating SMS Gateway...");

    mutate(
      {
        url: "/thirdparty/sms/config",
        method: "PATCH",
        data,
      },
      {
        onSuccess(data) {
          toast.dismiss(toastId);
          toast.success("SMS Gateway updated successfully!");
          setOpenModal(false);
        },
      }
    );
  };

  return (
    <div className="px-20 mt-5">
      <div className="">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-semibold text-blue-900 text-3xl">SMS Gateway</h3>
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
            <Item label="Name" value={user.sms_config?.name ?? ""} />
            <Item label="SID" value={showPartial(user.sms_config?.sid ?? "")} />
            <Item
              label="Token"
              value={showPartial(user.sms_config?.token ?? "")}
            />
            <Item
              label="Phone Number"
              value={format(
                user.sms_config?.phone_number ?? "",
                "INTERNATIONAL"
              )}
            />
          </div>
        </div>
      </div>

      <Modal openModal={openModal} closeModal={setOpenModal}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="bg-white w-full rounded-xl p-5">
            <div className="text-blue-900 text-2xl font-bold leading-10 mb-5">
              SMS Gateway
            </div>
            <div className="space-y-2">
              <div className="w-full">
                <InputField
                  label="Name"
                  name="name"
                  register={register}
                  errors={errors}
                  placeholder="SMS Gateway Name"
                  required
                  errorMessage="SMS system name is required"
                />
              </div>
              <div className="w-full">
                <InputField
                  label="SID"
                  name="sid"
                  register={register}
                  errors={errors}
                  required
                  placeholder="SID"
                  errorMessage="SID is required"
                />
              </div>
              <div className="w-full">
                <InputField
                  label="Token"
                  name="token"
                  register={register}
                  errors={errors}
                  required
                  placeholder="Token"
                  errorMessage="Token is required"
                />
              </div>
              <div className="w-full">
                <InputField
                  label="Phone number"
                  name="phone_number"
                  register={register}
                  errors={errors}
                  required
                  placeholder="Phone number"
                  errorMessage="Phone number is required"
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

export default SMS;
