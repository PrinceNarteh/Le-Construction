import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { queryKeys } from "../../constants/queryKeys";
import useMutate from "../../hooks/useMutate";
import { useUserSelector } from "../../hooks/useUserSelector";
import InputField from "../shared/InputField";
import { useQueryClient } from "@tanstack/react-query";

const AddBuildersGroupForm = ({ group = null, setOpenModal }) => {
  const { user } = useUserSelector();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      group_name: group ? group.group_name : "",
    },
  });

  const { mutate } = useMutate([
    group ? queryKeys.UpdateBuilderGroup : queryKeys.AddBuilderGroup,
  ]);

  const submit = (data) => {
    const toastId = toast.loading(
      `${group ? "Updating" : "Creating"} Builders Group...`
    );

    mutate(
      {
        url: `/builder/group/${group ? "update" : "new"}`,
        method: group ? "PATCH" : "POST",
        data: group
          ? {
              group_id: group._id,
              group_name: data.group_name,
            }
          : {
              company_id: user.company._id,
              group_name: data.group_name,
            },
      },
      {
        async onSuccess(responseData) {
          await queryClient.setQueryData(
            [queryKeys.BuildersGroups],
            (oldData) => {
              return {
                message: [responseData.message, ...(oldData?.message ?? [])],
              };
            }
          );
          toast.dismiss(toastId);
          toast.success(
            `Builder Group ${group ? "updated" : "added"} successfully`
          );
          setOpenModal(false);
        },
        onError() {
          toast.dismiss(toastId);
          toast.error(`Error ${group ? "updating" : "adding"} builder group`);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5 py-5">
      <h3 className="text-blue-900 text-2xl font-bold">
        {`${group ? "Update" : "Add"} Builders Group`}
      </h3>
      <InputField
        label="Group name"
        name="group_name"
        register={register}
        errors={errors}
        errorMessage="Please enter group name"
        required
      />
      <button className="py-2 px-5 bg-primary text-white rounded-md font-bold float-right">
        {group ? "Update" : "Add"} Group
      </button>
    </form>
  );
};

export default AddBuildersGroupForm;
