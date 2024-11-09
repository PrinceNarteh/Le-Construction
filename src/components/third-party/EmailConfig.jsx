import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import useMutate from "../../hooks/useMutate";
import { useUserSelector } from "../../hooks/useUserSelector";
import InputField from "../shared/InputField";
import Item from "../shared/Item";
import Modal from "../shared/Modal";

function MailConfig() {
  const { user } = useUserSelector();
  const [openModal, setOpenModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_id: user._id,
      mailer_name: user.email_config?.mailer_name ?? "",
      host: user.email_config?.host ?? "",
      port: user.email_config?.port ?? "",
      driver: user.email_config?.driver ?? "",
      username: user.email_config?.username ?? "",
      email_id: user.email_config?.email_id ?? "",
      encryption: user.email_config?.encryption ?? "",
      password: user.email_config?.password ?? "",
    },
  });

  const { mutate } = useMutate(["add-email-gateway"]);
  const submitHandler = (data) => {
    const toastId = toast.loading("Updating SMTP Mail Setup...");

    mutate(
      {
        url: "/thirdparty/email/config",
        method: "PATCH",
        data,
      },
      {
        onSuccess(data) {
          toast.dismiss(toastId);
          toast.success("SMTP Mail Setup updated successfully!");
          setOpenModal(false);
        },
      }
    );
  };

  return (
    <div className="px-20 mt-5">
      <div className="">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-semibold text-blue-900 text-3xl">
            SMTP Mail Setup
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
            <Item label="Mailer Name" value={user.email_config?.mailer_name} />
            <Item label="Host" value={user.email_config?.host} />
            <Item label="Post" value={user.email_config?.port} />
            <Item label="Driver" value={user.email_config?.driver} />
            <Item label="Username" value={user.email_config?.username} />
            <Item label="Email ID" value={user.email_config?.email_id} />
            <Item label="Encryption" value={user.email_config?.encryption} />
            <div className="flex py-3">
              <div className="flex-1 text-blue-900 text-[15px] font-bold leading-snug capitalize">
                Password
              </div>
              <div className="flex-[3]">************</div>
            </div>
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
              SMTP Mail Setup
            </div>
            <div className="space-y-2">
              <div className="form-row">
                <InputField
                  label="Mailer Name"
                  name="mailer_name"
                  register={register}
                  errors={errors}
                  placeholder="Mailer Name"
                  required
                  errorMessage="Mailer name is required"
                />

                <InputField
                  label="Host"
                  name="host"
                  register={register}
                  errors={errors}
                  required
                  placeholder="Host"
                  errorMessage="Host is required"
                />
              </div>
              <div className="form-row">
                <InputField
                  label="Port"
                  name="port"
                  register={register}
                  errors={errors}
                  required
                  placeholder="Port"
                  errorMessage="Port is required"
                />

                <InputField
                  label="Driver"
                  name="driver"
                  register={register}
                  errors={errors}
                  required
                  placeholder="Driver"
                  errorMessage="Driver is required"
                />
              </div>
              <div className="form-row">
                <InputField
                  label="Username"
                  name="username"
                  register={register}
                  errors={errors}
                  required
                  placeholder="Username"
                  errorMessage="Username is required"
                />

                <InputField
                  type="email"
                  label="Email ID"
                  name="email_id"
                  register={register}
                  errors={errors}
                  required
                  placeholder="Email ID"
                  errorMessage="Email ID is required"
                />
              </div>
              <div className="form-row">
                <InputField
                  label="Encryption Type"
                  name="encryption"
                  register={register}
                  errors={errors}
                  required
                  placeholder="Encryption Type"
                  errorMessage="Encryption type is required"
                />

                <InputField
                  label="Password"
                  name="password"
                  register={register}
                  errors={errors}
                  required
                  placeholder="Password"
                  errorMessage="Password is required"
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

export default MailConfig;
