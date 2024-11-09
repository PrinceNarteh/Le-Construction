import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import useMutate from "../../hooks/useMutate";
import { useUserSelector } from "../../hooks/useUserSelector";
import showPartial from "../../utils/showPartial";
import InputField from "../shared/InputField";
import Item from "../shared/Item";
import Modal from "../shared/Modal";

function PushConfig() {
  const { user } = useUserSelector();
  const [openModal, setOpenModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_id: user._id,
      server_key: user.notification_config?.server_key ?? "",
      app_id: user.notification_config?.app_id ?? "",
      fcm_project_id: user.notification_config?.fcm_project_id ?? "",
      auth_domain: user.notification_config?.auth_domain ?? "",
      storage_bucket: user.notification_config?.storage_bucket ?? "",
      messaging_sender_id: user.notification_config?.messaging_sender_id ?? "",
      measurement_id: user.notification_config?.measurement_id ?? "",
    },
  });

  const { mutate } = useMutate(["add-email-gateway"]);
  const submitHandler = (data) => {
    const toastId = toast.loading("Updating Push Notification...");

    mutate(
      {
        url: "/thirdparty/push/config",
        method: "PATCH",
        data,
      },
      {
        onSuccess(data) {
          toast.dismiss(toastId);
          toast.success("Push Notification updated successfully!");
          setOpenModal(false);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      }
    );
  };

  return (
    <div className="px-20 mt-5">
      <div className="">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-semibold text-blue-900 text-3xl">Push Config</h3>
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
            <Item
              label="Server Key"
              value={showPartial(user.notification_config?.server_key ?? "")}
            />
            <Item label="App ID" value={user.notification_config?.app_id} />
            <Item
              label="FCM Project ID"
              value={user.notification_config?.fcm_project_id}
            />
            <Item
              label="Auth Domain"
              value={user.notification_config?.auth_domain}
            />
            <Item
              label="Storage Bucket"
              value={user.notification_config?.storage_bucket}
            />
            <Item
              label="Messaging Sender ID"
              value={user.notification_config?.messaging_sender_id}
            />
            <Item
              label="Measurement ID"
              value={user.notification_config?.measurement_id}
            />
          </div>
        </div>
      </div>

      <Modal
        openModal={openModal}
        closeModal={setOpenModal}
        width="max-w-4xl"
        className="place-content-start"
      >
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="bg-white w-full rounded-xl p-5">
            <div className="text-blue-900 text-2xl font-bold leading-10 mb-5">
              Push Config
            </div>
            <div className="space-y-2">
              <div className="form-row">
                <InputField
                  label="Server Key"
                  name="server_key"
                  register={register}
                  errors={errors}
                  required
                  placeholder="Server Key"
                  errorMessage="Server Key is required"
                />
              </div>
              <div className="form-row">
                <InputField
                  label="App ID"
                  name="app_id"
                  register={register}
                  errors={errors}
                  placeholder="App ID"
                />

                <InputField
                  label="FCM Project ID"
                  name="fcm_project_id"
                  register={register}
                  errors={errors}
                  required
                  placeholder="FCM Project ID"
                  errorMessage="FCM Project ID is required"
                />
              </div>
              <div className="form-row">
                <InputField
                  label="Auth Domain"
                  name="auth_domain"
                  register={register}
                  errors={errors}
                  placeholder="Auth Domain"
                />

                <InputField
                  label="Storage Bucket"
                  name="storage_bucket"
                  register={register}
                  errors={errors}
                  placeholder="Storage Bucket"
                />
              </div>
              <div className="form-row">
                <InputField
                  label="Messaging Sender ID"
                  name="messaging_sender_id"
                  register={register}
                  errors={errors}
                  required
                  placeholder="Messaging Sender ID"
                  errorMessage="Messaging Sender ID is required"
                />

                <InputField
                  label="Measurement ID"
                  name="measurement_id"
                  register={register}
                  errors={errors}
                  placeholder="Measurement ID"
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

export default PushConfig;
