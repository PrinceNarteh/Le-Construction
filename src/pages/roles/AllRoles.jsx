import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { GoTrash } from "react-icons/go";

import { useQueryClient } from "@tanstack/react-query";
import RoleForm from "../../components/forms/RoleForm";
import Heading from "../../components/layout/Heading";
import Modal from "../../components/shared/Modal";
import { queryKeys } from "../../constants";
import useConfirm from "../../hooks/useConfirm";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";
import { capitalize } from "../../utils/capitalize";
import { Skeleton } from "../../components/skeleton/Skeleton";

function AllRoles() {
  const queryClient = useQueryClient();
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const [openModal, setOpenModal] = useState(false);
  const [role, setRole] = useState(null);
  const {
    data: roles,
    isLoading,
    refetch,
  } = usePostQuery({
    queryKey: [queryKeys.RolesForCompany],
    url: "/company/roles",
  });

  const handleEdit = (role) => {
    setRole(role);
    setOpenModal(true);
  };

  const { mutate } = useMutate([queryKeys.DeleteRole]);
  const handleDelete = async (role) => {
    const isConfirm = await confirm({
      title: `Are you sure?`,
      message: `Are you sure you want to delete "${role.name}" role?`,
    });

    if (isConfirm) {
      const toastId = toast.loading("Deleting role...");

      mutate(
        {
          url: "/role/delete",
          method: "DELETE",
          data: {
            role_id: role._id,
          },
        },
        {
          async onSuccess(data) {
            await queryClient.setQueryData(
              [queryKeys.RolesForCompany],
              (oldData) =>
                (oldData ?? []).filter((item) => item._id !== role._id),
            );
            toast.dismiss(toastId);
            toast.success("Role delete successfully!");
            setIsOpen(false);
          },
          onError(error) {
            toast.dismiss(toastId);
            toast.error(error.response.data.message);
          },
        },
      );
    }
  };

  useEffect(() => {
    if (!openModal) {
      setRole(null);
    }
  }, [openModal]);

  return (
    <div className="">
      <div className="ml-10 flex justify-between items-center mt-5">
        <Heading label="Role & Permissions" />
      </div>
      <div className="p-12">
        {isLoading ? (
          <div className="bg-white mt-7 rounded-lg p-7">
            <div className="flex justify-between mb-5">
              <Skeleton className="h-8 w-72" />
              <Skeleton className="h-8 w-28" />
            </div>
            <div className="space-y-3">
              {Array(7)
                .fill(null)
                .map(() => (
                  <div className="flex gap-5">
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-40" />
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="bg-white mt-7 rounded-lg p-5">
            <div className="h-20 text-blue-900  p-2 flex justify-between items-center">
              <div className="h-9 w-72 bg-[#F4F6FB] flex rounded-lg">
                <Icon
                  icon="circum:search"
                  className="mt-[0.5rem] h-5 w-5 ml-3"
                />

                <input
                  type="text"
                  name="name"
                  placeholder="Search "
                  className="bg-[#F4F6FB] w-40 outline-none p-2 placeholder:text-gray-700 text-sm placeholder:font-normal placeholder:mb-3"
                />
              </div>
              <div>
                <button
                  onClick={() => setOpenModal(true)}
                  className="py-2 px-7 bg-primary text-white text-xs rounded"
                >
                  Add Role
                </button>
              </div>
            </div>

            <div className="flex pl-3 pr-3 border-b-2 pb-2  text-slate-400 text-[14px] font-bold leading-tight">
              <div className="w-40">Role</div>
              <div className="flex-[5]">Permissions</div>
              <div className="w-32">Actions</div>
            </div>

            <>
              {!isLoading && roles.length === 0 ? (
                <div className="h-14 bg-neutral-300 border bg-opacity-10 w-full mt-4 mb-4 rounded-md border-l-8 border-l-primary flex items-center">
                  <Icon
                    icon="solar:danger-circle-broken"
                    className="ml-5 mr-1 text-primary h-5 w-5"
                  />
                  <div className=" text-neutral-500 font-semibold">
                    You don't have any roles. Why not
                    <button
                      onClick={() => setOpenModal(true)}
                      className="ml-1 text-primary"
                    >
                      Add a role?
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {roles?.map((role, index) => (
                    <div
                      key={index}
                      className="flex items-center pl-2 pr-2 pb-4 text-slate-400 text-[14px] font-bold leading-tight mt-3 border-b border-slate-100"
                    >
                      <div className="w-40 text-blue-900 text-[15px] font-bold leading-snug ">
                        {capitalize(role?.name, "_")}
                      </div>
                      <div className="flex-[5] flex flex-wrap text-blue-900 text-[15px] font-bold leading-snug">
                        {role?.permissions.map((permission, idx) => (
                          <h3 key={idx} className="pr-2">
                            {permission}
                            {!(role?.permissions?.length - 1 === idx) && ", "}
                          </h3>
                        ))}
                      </div>
                      <div className="flex cursor-pointer w-32 gap-5">
                        <Icon
                          onClick={() => handleEdit(role)}
                          icon="iconamoon:edit-light"
                          className="text-2xl"
                        />
                        <GoTrash
                          className="text-2xl text-red-500"
                          onClick={() => handleDelete(role)}
                        />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>

            <Modal
              openModal={openModal}
              closeModal={setOpenModal}
              className="place-content-start"
              width="max-w-4xl"
            >
              <RoleForm
                role={role}
                refetch={refetch}
                setOpenModal={setOpenModal}
              />
            </Modal>

            {ConfirmationDialog()}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllRoles;
