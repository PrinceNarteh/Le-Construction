import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Spinner from "../../components/Spinner";
import RoleForm from "../../components/forms/RoleForm";
import Heading from "../../components/layout/Heading";
import Modal from "../../components/shared/Modal";
import { queryKeys } from "../../constants";
import useConfirm from "../../hooks/useConfirm";
import { useGetQuery } from "../../hooks/useGetQuery";
import useMutate from "../../hooks/useMutate";
import { capitalize } from "../../utils/capitalize";

function AllEmployeeRoles() {
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const [openModal, setOpenModal] = useState(false);
  const [role, setRole] = useState(null);
  const {
    data: roles,
    isLoading,
    refetch,
  } = useGetQuery({
    queryKey: [queryKeys.EmployeesRoles],
    url: "/roles",
  });

  const handleEdit = (role) => {
    setOpenModal(true);
    setRole(role);
  };

  const { mutate } = useMutate([queryKeys.DeleteRole]);
  const handleDelete = async (role) => {
    const isConfirm = await confirm({
      title: `Are you sure?`,
      message: `Are you sure you want to delete "${capitalize(role.name)}"?`,
    });

    if (isConfirm) {
      const toastId = toast.loading("Deleting role...");

      mutate(
        {
          url: "/role/delete",
          method: "DELETE",
          data: {
            id: role.id,
          },
        },
        {
          async onSuccess(data) {
            await refetch();
            toast.dismiss(toastId);
            toast.success("Role delete successfully!");
            setIsOpen(false);
          },
          onError(error) {
            toast.dismiss(toastId);
            toast.error(error.response.data.message);
          },
        }
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
      <div className="ml-9">
        <Heading label="Role & Permissions" />
      </div>
      <div className="pl-12 pr-12">
        <div className="bg-white mt-7 rounded-lg p-5">
          <div className="h-20 text-blue-900  p-2 flex justify-between items-center">
            <h3 className="text-xl font-bold">Role & Permissions</h3>
            <div className="h-9 w-72 bg-[#F4F6FB] flex ml-2 rounded-lg">
              <Icon icon="circum:search" className="mt-[0.5rem] h-5 w-5 ml-3" />

              <input
                type="text"
                name="name"
                placeholder="Search "
                className="bg-[#F4F6FB] w-40 outline-none p-2 placeholder:text-gray-700 text-sm placeholder:font-normal placeholder:mb-3"
              />
            </div>
          </div>

          <div className="flex pl-3 pr-3 border-b-2 pb-2  text-slate-400 text-[14px] font-bold leading-tight">
            <div className="w-40">Role</div>
            <div className="flex-[5]">Permissions</div>
            <div className="w-32">Actions</div>
          </div>

          {isLoading && (
            <Spinner isSubmitting={isLoading} /> // Display the spinner
          )}

          {roles?.map((role, index) => (
            <div
              key={index}
              className="flex items-center pl-2 pr-2 pb-4 text-slate-400 text-[14px] font-bold leading-tight mt-3 border-b border-slate-100"
            >
              <div className="w-40 text-blue-900 text-[15px] font-bold leading-snug ">
                {capitalize(role?.name)}
              </div>
              <div className="flex-[5] flex flex-wrap text-blue-900 text-[15px] font-bold leading-snug">
                {role?.permissions.map((permission, idx) => (
                  <h3 key={idx} className="pr-2">
                    {capitalize(permission, "_")}
                    {!(role?.permissions?.length - 1 === idx) && ", "}
                  </h3>
                ))}
              </div>
              <div className="flex cursor-pointer w-32 gap-1">
                <button onClick={() => handleEdit(role)} className="p-2">
                  <Icon icon="iconamoon:edit-light" className="text-2xl" />
                </button>
                <button onClick={() => handleDelete(role)}>
                  <Icon
                    icon="fluent:delete-28-regular"
                    className="mt-[0.7rem] h-5 w-5 ml-3 text-red-500"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        openModal={openModal}
        closeModal={setOpenModal}
        className="place-content-start"
      >
        <RoleForm role={role} />
      </Modal>

      {ConfirmationDialog()}
    </div>
  );
}

export default AllEmployeeRoles;
