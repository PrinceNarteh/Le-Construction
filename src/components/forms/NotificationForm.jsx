import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { queryKeys } from "../../constants";
import useMutate from "../../hooks/useMutate";
import { useUserSelector } from "../../hooks/useUserSelector";
import Heading from "../layout/Heading";
import InputField from "../shared/InputField";
import SelectField from "../shared/SelectField";

function NotificationForm({ closeModal, refetch }) {
  const { user } = useUserSelector();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_id: user._id,
      title: "",
      message: "",
      type: "",
    },
  });

  const { mutate } = useMutate([queryKeys.SendNotification]);
  const submitHandler = (data) => {
    const toastId = toast.loading("Submitting notification...");
    mutate(
      {
        url: "/send/push",
        data,
      },
      {
        onSuccess: async (data) => {
          await refetch();
          toast.dismiss(toastId);
          toast.success("Notification sent successfully!");
          closeModal();
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      }
    );
  };

  return (
    <div className="p-5">
      <div className="mb-3">
        <Heading label="Send Notification" />
      </div>

      <form onSubmit={handleSubmit(submitHandler)}>
        <InputField
          label="Notification Title"
          name="title"
          errors={errors}
          register={register}
          errorMessage="Notification Title is required"
          required
        />
        <InputField
          label="Notification Message"
          name="message"
          errors={errors}
          register={register}
          errorMessage="Notification Message is required"
          required
        />

        <div className="mt-4 flex w-full items-center cursor-pointer">
          <SelectField
            label="Send to"
            name="type"
            errors={errors}
            register={register}
            required
            errorMessage="Please select those the message is sent to"
          >
            <option value="">--Select Sender--</option>
            <option value="builder">Builder</option>
            <option value="client">Client</option>
          </SelectField>

          <div className="flex items-center ml-5 w-[10%] h-10 mt-10">
            <input
              id="all"
              type="checkbox"
              className="h-20 w-20 accent-primary cursor-pointer"
            />
            <label
              htmlFor="all"
              className="mb-1 mt-1 ml-2 block text-blue-900 text-md font-semibold leading-loose"
            >
              All
            </label>
          </div>
        </div>

        <div className="flex gap-5 justify-end">
          <button className="mt-5 py-1.5 px-12 text-white text-md font-bold leading-loose bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default NotificationForm;
