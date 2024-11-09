import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { queryKeys } from "../../constants/queryKeys";
import { useGetQuery } from "../../hooks/useGetQuery";
import useMutate from "../../hooks/useMutate";
import { useUserSelector } from "../../hooks/useUserSelector";
import CustomSelect from "../shared/CustomSelect";

const AddBuildersGroupMemberForm = ({ groupId, setOpenModal, setBuilders }) => {
  const { user } = useUserSelector();
  const [builder, setBuilder] = useState("");

  const { setValue, setError, handleSubmit } = useForm({
    defaultValues: {
      builder_id: "",
    },
  });

  const { data, isLoading } = useGetQuery({
    queryKey: [queryKeys.Builders],
    url: "/my/builders",
    options: {
      headers: {
        companyid: user.user_type === "company" ? user._id : user.company._id,
      },
    },
  });

  const { mutate } = useMutate(["add-builders-group-member"]);
  const submit = (data) => {
    if (!builder) {
      setError("builder_id", "Please kindly select a builder");
      return;
    }
    const toastId = toast.loading("Adding a new builder...");
    const submitData = {
      group_id: groupId,
      builder_id: data.builder_id,
    };

    mutate(
      {
        url: "/builder/group/add/member",
        method: "POST",
        data: submitData,
      },
      {
        onSuccess(newBuilder) {
          toast.dismiss(toastId);
          toast.success("New member added successfully");
          setOpenModal(false);
          setBuilders((prevBuilders) => [...prevBuilders, newBuilder]);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error("Error adding new member");
          setOpenModal(false);
        },
      }
    );
  };

  const builders = data?.message.map((builder) => ({
    id: builder._id,
    label: `${builder.f_name} ${builder.l_name}`,
  }));

  useEffect(() => {
    if (builder) {
      setValue("builder_id", builder);
    }
  }, [builder, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5 py-5">
      <h3 className="text-blue-900 text-2xl font-bold">Add Member</h3>
      <CustomSelect
        label="Select Member"
        data={builders}
        loading={isLoading}
        placeholder="Select Builder..."
        onChange={setBuilder}
      />
      <button className="py-2 px-5 bg-primary text-white rounded-md font-bold float-right">
        Submit
      </button>
    </form>
  );
};

export default AddBuildersGroupMemberForm;
