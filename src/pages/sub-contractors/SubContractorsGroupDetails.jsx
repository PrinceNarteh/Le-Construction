import { Icon } from "@iconify/react";
import { format } from "libphonenumber-js";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import toast from "react-hot-toast";
import { ExportToExcel } from "../../components/ExportToExcel";
import Spinner from "../../components/Spinner";
import AddBuildersGroupMemberForm from "../../components/forms/AddBuildersGroupMemberForm";
import BuilderImportForm from "../../components/forms/import-bulk-forms/BuilderImportForm";
import Heading from "../../components/layout/Heading";
import Modal from "../../components/shared/Modal";
import Table from "../../components/shared/Table";
import { queryKeys } from "../../constants/queryKeys";
import useConfirm from "../../hooks/useConfirm";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";

function BuildersGroupDetails() {
  const [isOpen, setIsOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [builders, setBuilders] = useState([]);
  const { subContractorGroupId } = useParams();
  const { data, isLoading, refetch, isRefetching } = usePostQuery({
    queryKey: [queryKeys.BuildersGroups, subContractorGroupId],
    url: `/builder/group`,
    data: {
      group_id: subContractorGroupId,
    },
  });

  const {
    ConfirmationDialog,
    confirm,
    setIsOpen: setIsConfirmOpen,
  } = useConfirm();
  const { mutate } = useMutate([queryKeys.AddMemberToBuilderGroup]);

  const fileName = "Builders Groups";

  const modalRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    let handler = (e) => {
      if (!modalRef?.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousemove", handler);
  }, [isOpen]);

  useEffect(() => {
    if (data) {
      setBuilders(data.message.builders);
    }
  }, [data]);

  const handleDelete = async (builder) => {
    const isConfirmed = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to delete "${builder.f_name} ${builder.l_name}"`,
    });

    if (isConfirmed) {
      const toastId = toast.loading("Removing builder...");
      mutate(
        {
          url: "/builder/group/remove/member",
          data: {
            group_id: subContractorGroupId,
            builder_id: builder._id,
          },
          method: "POST",
        },
        {
          async onSuccess() {
            setBuilders((prevBuilders) =>
              prevBuilders.filter((b) => b._id !== builder._id)
            );
            toast.dismiss(toastId);
            toast.success("Builder removed successfully!");
            setIsConfirmOpen(false);
          },
          onError(error) {
            toast.dismiss(toastId);
            toast.error(error.response.data.message);
          },
        }
      );
    }
  };

  const columns = [
    {
      id: "SN",
      accessorKey: "",
      header: "SN",
      cell: (info) => <span>{info.row.index + 1}</span>,
    },
    {
      header: "Sub Contractor",
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
            <div className="text-blue-900 text-[15px] font-bold leading-snug">
              {props.row.original.f_name} {props.row.original.l_name}
            </div>
            <div className="text-slate-400 text-sm font-normal leading-tight">
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
        <div className="flex items-center gap-5">
          <Link
            to={`/builders/${cell.row.original._id}`}
            className="text-white text-[12px] font-bold bg-primary px-4 py-1.5"
          >
            View profile
          </Link>
          <Icon
            onClick={() => handleDelete(cell.row.original)}
            icon="fluent:delete-28-regular"
            className="text-red-500 text-2xl cursor-pointer"
          />
        </div>
      ),
    },
  ];

  const customDataForExport = builders.map((builder) => ({
    "Builder Name": builder.company_name,
    Country: builder.address?.country,
  }));

  if (customDataForExport.length === 0) {
    customDataForExport.push({
      "Builder Name": "",
      Phone: "",
      Country: "",
    });
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mt-5 " ref={modalRef}>
        <div className="ml-12">
          <Heading label={data?.message.group_name} />
        </div>
        <div className="flex items-center font-semibold cursor-pointer">
          <div className="mr-16">
            <div className="relative inline-block text-left">
              <div>
                <div
                  onClick={toggleDropdown}
                  className="flex items-center bg-primary py-2 px-5 rounded-md text-white "
                >
                  <div>Bulk Import</div>
                  <Icon icon="solar:import-broken" className="ml-2 h-5 w-5" />
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
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Import Builders
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

      {isLoading || isRefetching ? (
        <Spinner isSubmitting={isLoading || isRefetching} />
      ) : (
        <div className="px-12 mt-5 rounded-lg">
          {builders.length > 0 ? (
            <Table
              data={builders}
              columns={columns}
              actionButton={() => (
                <button
                  onClick={() => setOpenForm(true)}
                  className="bg-primary text-sm py-2 px-3 rounded-md text-white"
                >
                  Add Member
                </button>
              )}
            />
          ) : (
            <div className="h-14 bg-neutral-300 border bg-opacity-10 w-full mt-4 mb-4 rounded-md border-l-8 border-l-primary flex items-center">
              <Icon
                icon="solar:danger-circle-broken"
                className="ml-5 mr-1 text-primary h-5 w-5"
              />
              <div className="text-neutral-500 font-semibold">
                You don't have any member in the group. Why not
                <span
                  onClick={() => setOpenForm(true)}
                  className="ml-1 text-primary cursor-pointer"
                >
                  Add a Member?
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <Modal openModal={openModal} closeModal={setOpenModal}>
        <BuilderImportForm />
      </Modal>

      <Modal openModal={openForm} closeModal={setOpenForm}>
        <AddBuildersGroupMemberForm
          groupId={subContractorGroupId}
          setOpenModal={setOpenForm}
          setBuilders={setBuilders} // Pass setBuilders to update the builders list
        />
      </Modal>

      {ConfirmationDialog()}
    </div>
  );
}

export default BuildersGroupDetails;
