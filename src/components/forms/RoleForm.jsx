import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import Spinner from "../../components/Spinner";
import InputField from "../../components/shared/InputField";
import { queryKeys } from "../../constants";
import { useGetQuery } from "../../hooks/useGetQuery";
import useMutate from "../../hooks/useMutate";
import { useUserSelector } from "../../hooks/useUserSelector";
import Chips from "../shared/Chips";

const schema = z.object({
  name: z.string().min(1, "Role name is required"),
  permissions: z
    .string()
    .array()
    .nonempty({ message: "At lease one permission is required" }),
  status: z.number(),
  created_by: z.string().min(1, "Created company is required"),
});

export default function RoleForm({ role, setOpenModal }) {
  const { user } = useUserSelector();
  const queryClient = useQueryClient();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: role
      ? role
      : {
          name: "",
          permissions: [],
          status: 1,
          created_by: user._id,
        },
    resolver: zodResolver(schema),
  });
  const [permissions, setPermissions] = useState([]);

  const { data, isLoading: loadingPermission } = useGetQuery({
    queryKey: [queryKeys.Permissions],
    url: "/permissions",
  });

  const handleChange = (incomingPermission) => {
    if (permissions.includes(incomingPermission)) {
      setPermissions(
        permissions.filter((permission) => permission !== incomingPermission)
      );
    } else {
      setPermissions([...permissions, incomingPermission]);
    }
  };

  const removePermission = (permissionToRemove) =>
    setPermissions(
      permissions.filter((permission) => permission !== permissionToRemove)
    );

  const { mutate, isLoading } = useMutate([queryKeys.CreateRole]);
  const submitHandler = async (data) => {
    const toastId = toast.loading(`${role ? "Creating" : "Updating"} role...`);

    if (role) {
      data.role_id = role._id;
      delete data._id;
    }

    mutate(
      {
        url: `/role/${role ? "update" : "create"}`,
        data,
        method: role ? "PATCH" : "POST",
      },
      {
        onSuccess: async (data) => {
          await queryClient.setQueryData(
            [queryKeys.RolesForCompany],
            (oldData) => {
              if (role) {
                return (oldData ?? []).map((item) => {
                  if (item._id === data.role_id) {
                    return data;
                  }
                  return item;
                });
              } else {
                return [data, ...(oldData ?? [])];
              }
            }
          );
          toast.dismiss(toastId);
          toast.success(`Role ${role ? "updated" : "created"} successfully`);
          setOpenModal(false);
        },
        onError: (error) => {
          toast.dismiss(toastId);
          toast.error("Error creating role");
        },
      }
    );
  };

  useEffect(() => {
    if (role) {
      setPermissions(role.permissions);
    }
  }, [role]);

  useEffect(() => {
    setValue("permissions", permissions);
  }, [permissions, setValue]);

  return (
    <div className="cursor-pointer p-5">
      <Spinner isSubmitting={isLoading} />

      <div className="text-blue-900 text-3xl font-bold mb-2">
        <h3>Add Role & Permission</h3>
      </div>

      <div className=" text-slate-400 text-[15px] font-normal mt-2 mb-6">
        Add permissions to create role below.
      </div>

      <div className=" bg-white rounded-lg pt-10">
        <div className="min-h-fit space-y-10 flex flex-col justify-center items-center p-">
          <form onSubmit={handleSubmit(submitHandler)} className="w-full">
            <div className="space-y-5">
              <div className="mb-5">
                <label className=" text-blue-900 text-md font-semibold leading-loose">
                  Role Name
                </label>
                <InputField
                  name="name"
                  register={register}
                  errors={errors}
                  required
                />
              </div>
              <div className="flex gap-3 flex-wrap">
                {permissions.map((permission, index) => (
                  <Chips
                    key={index}
                    label={permission}
                    onClick={() => removePermission(permission)}
                  />
                ))}
              </div>
              <div>
                <label className="text-blue-900 text-md font-semibold leading-loose ">
                  System Module Permission:
                </label>
                {loadingPermission ? (
                  <div className="text-center text-xl flex">
                    <span>Loading</span>
                    <Icon
                      icon="eos-icons:three-dots-loading"
                      className="text-3xl"
                    />
                  </div>
                ) : (
                  <div className="grid grid-auto-fit-xs gap-5 mt-2">
                    {data?.map((module, index) => (
                      <label
                        key={index}
                        className="space-x-2 basis-48 flex-1 block text-md font-normal text-slate-400 cursor-pointer "
                      >
                        <input
                          type="checkbox"
                          id="permissions"
                          name="permissions"
                          className="accent-orange-700 "
                          onChange={() => handleChange(module.name)}
                          checked={permissions.includes(module.name)}
                        />
                        <span>{module.name}</span>
                      </label>
                    ))}
                  </div>
                )}
                {errors["permissions"] && (
                  <span className="text-red-500 text-[12px]">
                    {errors["permissions"].message}
                  </span>
                )}
              </div>
              <div className="flex justify-end">
                <button className="px-6 py-2 w-48 bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex mt-6 text-white text-md font-bold leading-loose ">
                  Add role
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
