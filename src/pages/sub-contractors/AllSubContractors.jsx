import { Icon } from "@iconify/react";
import { format } from "libphonenumber-js";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { ExportToExcel } from "../../components/ExportToExcel";
import Spinner from "../../components/Spinner";
import SubContractorForm from "../../components/forms/SubContractorForm";
import BuilderImportForm from "../../components/forms/import-bulk-forms/BuilderImportForm";
import Heading from "../../components/layout/Heading";
import Modal from "../../components/shared/Modal";
import Table from "../../components/shared/Table";
import { queryKeys } from "../../constants/queryKeys";
import useClickOutside from "../../hooks/useClickOutside";
import useConfirm from "../../hooks/useConfirm";
import { useGetQuery } from "../../hooks/useGetQuery";
import useMutate from "../../hooks/useMutate";
import { useUserSelector } from "../../hooks/useUserSelector";
import BuilderDetails from "./SubContractorDetails";
import { useQueryClient } from "@tanstack/react-query";

function AllSubContractors() {
  const { user } = useUserSelector();
  const [isOpen, setIsOpen] = useState(false);
  const {
    ConfirmationDialog,
    confirm,
    setIsOpen: setOpenConfirm,
  } = useConfirm();
  const [openModal, setOpenModal] = useState(false);
  const [builder, setBuilder] = useState(null);
  const [openBuilderForm, setOpenBuilderForm] = useState(false);
  const [openBuilderDetails, setOpenBuilderDetails] = useState(false);
  const queryClient = useQueryClient();

  const modalRef = useClickOutside(() => {
    setIsOpen(false);
  });

  const fileName = "All Sub Contractors";
  const { data, isLoading } = useGetQuery({
    queryKey: [queryKeys.Builders],
    url: "/my/builders",
    options: {
      headers: {
        companyid: user.user_type === "company" ? user._id : user.company._id,
      },
    },
  });

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleDetails = (builder) => {
    setBuilder(builder);
    setOpenBuilderDetails(true);
  };

  const handleEdit = (builder) => {
    setBuilder(builder);
    setOpenBuilderForm(true);
  };

  const getErrorMessage = (error) => {
    console.log("error:::", error);
    if (typeof error === "string") return error;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;
    return "An unknown error occurred";
  };

  const { mutate } = useMutate([queryKeys.DeleteBuilder]);
  const handleDelete = async (builder) => {
    const isConfirm = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to delete "${builder?.f_name} ${builder?.l_name}"`,
    });

    if (isConfirm) {
      const toastId = toast.loading(
        `Deleting ${builder?.f_name} ${builder?.l_name}...`,
      );
      mutate(
        {
          url: "/builder/delete",
          method: "DELETE",
          data: {
            builder_id: builder._id,
          },
        },
        {
          async onSuccess() {
            await queryClient.setQueryData([queryKeys.Builders], (oldData) => ({
              message: (oldData?.message ?? []).filter(
                (item) => item._id !== builder?._id,
              ),
            }));
            toast.dismiss(toastId);
            toast.success(
              `${builder?.f_name} ${builder?.l_name} deleted successfully`,
            );
            setOpenConfirm(false);
            setBuilder(null);
          },
          onError(error) {
            console.log("error:::", error);
            toast.dismiss(toastId);
            toast.error(getErrorMessage(error));
            setOpenConfirm(false);
          },
        },
      );
    }
  };

  const builders = data?.message ?? [];
  const customDataForExport = builders?.map((builder) => {
    //console.log(builder);
    return {
      "First Name": builder.f_name,
      "Last Name": builder.l_name,
      Email: builder.email,
      Group:
        builder.group === null || builder.group === undefined
          ? ""
          : builder.group.group_name,
      "Phone Number": builder.phone,
      Street:
        builder.address.street === undefined ? "" : builder.address.street,
      City: builder.address.city === undefined ? "" : builder.address.city,
      State: builder.address.state === undefined ? "" : builder.address.state,
      Country:
        builder.company_settings.country.name === undefined
          ? ""
          : builder.company_settings.country.name,
      Role: builder.user_type === undefined ? "Builder" : builder.user_type,
    };
  });

  if (customDataForExport.length === 0) {
    customDataForExport.push({
      "Builder Name": "",
      Phone: "",
      Country: "",
    });
  }

  const columns = [
    {
      id: "SN",
      accessorKey: "",
      header: "SN",
      cell: (info) => <span>{info.row.index + 1}</span>,
    },
    {
      header: "Sub Contractors",
      id: "SubContractors",
      accessorFn: (row) => `${row.company_name} ${row.email}`,
      cell: (props) => (
        <div className="flex items-center">
          <div>
            <img
              src={props.row.original.profile_image}
              alt=""
              className="h-12 w-12 object-cover rounded-full"
            />
          </div>
          <div className="ml-2">
            <div className=" text-blue-900 text-[15px] font-bold leading-snug">
              {props.row.original.f_name} {props.row.original.l_name}
            </div>
            <div className=" text-slate-400 text-sm font-normal leading-tight">
              {props.row.original.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (props) => (
        <span>{format(props.row.original.phone, "INTERNATIONAL")}</span>
      ),
    },
    {
      header: "Address",
      accessorFn: (row) => `${row.address?.city}, ${row.address?.state}`,
    },
    {
      header: "Details",
      cell: (cell) => (
        <div
          onClick={() => handleDetails(cell.row.original)}
          className="w-[101px] h-[30px] px-3.5 py-[7px] bg-gradient-to-r from-primary to-secondary rounded-md justify-center items-center gap-2.5 inline-flex cursor-pointer"
        >
          <div className="text-white text-[12px] font-bold">View profile</div>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (cell) => (
        <div className="flex gap-5">
          <button onClick={() => handleEdit(cell.row.original)}>
            <Icon
              icon="iconamoon:edit-light"
              className="text-2xl cursor-pointer"
            />
          </button>
          <button onClick={() => handleDelete(cell.row.original)}>
            <Icon
              icon="fluent:delete-28-regular"
              className="text-2xl cursor-pointer text-red-500"
            />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (!openBuilderDetails && !openBuilderForm) {
      setBuilder(null);
    }
  }, [openBuilderDetails, openBuilderForm]);

  return (
    <div className="">
      <div className="flex justify-between items-center mt-5 " ref={modalRef}>
        <div className="ml-12">
          <Heading label="All Sub Contractors" />
        </div>
        <div className="flex items-center font-semibold cursor-pointer">
          <div className="mr-16">
            <div className="relative inline-block text-left">
              <div>
                <div
                  onClick={toggleDropdown}
                  className="flex gap-2 items-center bg-primary py-2 px-5 rounded-md text-white "
                >
                  <Icon icon="icon-park-outline:more-four" fontSize={13} />
                  <p>More</p>
                </div>
              </div>

              {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <div
                      onClick={() => setOpenModal(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      <Icon
                        icon="solar:import-outline"
                        className="text-primary"
                        fontSize={15}
                      />
                      Import Sub Contractors
                    </div>
                    <div
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      <ExportToExcel
                        apiData={customDataForExport}
                        fileName={fileName}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="px-12 mt-5 rounded-lg">
        {!isLoading && builders.length === 0 ? (
          <div className="h-14 bg-neutral-300 border bg-opacity-10 w-full mt-4 mb-4 rounded-md border-l-8 border-l-primary flex items-center">
            <Icon
              icon="solar:danger-circle-broken"
              className="ml-5 mr-1 text-primary h-5 w-5"
            />
            <div className=" text-neutral-500 font-semibold">
              You don't have any Sub Contractors. Why not
              <button
                onClick={() => setOpenBuilderForm(true)}
                className="ml-1 text-primary"
              >
                Add a Sub Contractors?
              </button>
            </div>
          </div>
        ) : (
          <Table
            loading={isLoading}
            data={builders}
            columns={columns}
            actionButton={() => (
              <button onClick={() => setOpenBuilderForm(true)}>
                <div className="bg-primary text-sm py-2 px-3 rounded-md text-white ">
                  Add Sub Contractor
                </div>
              </button>
            )}
          />
        )}
      </div>

      <BuilderDetails
        builder={builder}
        handleEdit={handleEdit}
        openDetails={openBuilderDetails}
        closeDetails={() => setOpenBuilderDetails(false)}
        handleDelete={handleDelete}
      />

      <Modal
        start
        width="max-w-3xl"
        disableClickedOutside
        openModal={openBuilderForm}
        closeModal={setOpenBuilderForm}
      >
        <SubContractorForm
          builder={builder}
          closeModal={() => setOpenBuilderForm(false)}
        />
      </Modal>

      <Modal openModal={openModal} closeModal={setOpenModal}>
        <BuilderImportForm closeModal={setOpenModal} />
      </Modal>

      {/* Delete Builder Prompt  */}
      {ConfirmationDialog()}
    </div>
  );
}

export default AllSubContractors;
