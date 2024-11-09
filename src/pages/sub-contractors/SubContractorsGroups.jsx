import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { ExportToExcel } from "../../components/ExportToExcel";
import Spinner from "../../components/Spinner";
import AddBuildersGroupForm from "../../components/forms/AddBuildersGroupForm";
import BuilderImportForm from "../../components/forms/import-bulk-forms/BuilderImportForm";
import Heading from "../../components/layout/Heading";
import Modal from "../../components/shared/Modal";
import Table from "../../components/shared/Table";
import { queryKeys } from "../../constants/queryKeys";
import useClickOutside from "../../hooks/useClickOutside";
import useConfirm from "../../hooks/useConfirm";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";
import { capitalize } from "../../utils/capitalize";

function BuildersGroups() {
  const { ConfirmationDialog, confirm, setIsOpen: setIsConfirmOpen } = useConfirm();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [group, setGroup] = useState(null);
  const { data, isLoading, refetch, isRefetching } = usePostQuery({
    queryKey: [queryKeys.BuildersGroups],
    url: "/builder/groups",
  });

  const fileName = "Builders Groups";

  const modalRef = useClickOutside(() => {
    setIsOpen(false);
  });

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const { mutate, isLoading: isDeleting } = useMutate(["delete-builder-group"]);
  const handleDelete = async (group) => {
    const isConfirmed = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to delete "${capitalize(group.group_name)}"`,
    });

    if (isConfirmed) {
      const toastId = toast.loading("Deleting group...");
      mutate(
        {
          url: "/builder/group/delete",
          data: {
            group_id: group._id,
          },
          method: "DELETE",
        },
        {
          async onSuccess() {
            await refetch();
            toast.dismiss(toastId);
            toast.success("Group deleted successfully!");
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

  const builders = data?.message ?? [];
  const columns = [
    {
      id: "SN",
      accessorKey: "",
      header: "SN",
      cell: (info) => <span>{info.row.index + 1}</span>,
    },
    {
      header: "Group Name",
      accessorKey: "group_name",
    },
    {
      header: "No. of members",
      accessorFn: (row) => `${JSON.stringify(row.builders.length)}`,
    },
    {
      header: "Details",
      cell: (cell) => (
        <Link to={`/sub-contractors/groups/${cell.row.original._id}`}>
          <div className="h-[30px] px-3.5 py-[7px] bg-gradient-to-r from-primary to-secondary rounded-md justify-center items-center gap-2.5 inline-flex cursor-pointer">
            <div className="justify-center items-center gap-1 flex">
              <div className="text-white text-[12px] font-bold">View Members</div>
            </div>
          </div>
        </Link>
      ),
    },
    {
      header: "Actions",
      cell: (cell) => (
        <div className="flex cursor-pointer gap-5">
          <Icon
            onClick={() => {
              setGroup(cell.row.original);
              setOpenForm(true);
            }}
            icon="iconamoon:edit-light"
            className="mt-[0.7rem] h-5 w-5 ml-3"
          />
          <Icon
            onClick={() => handleDelete(cell.row.original)}
            icon="fluent:delete-28-regular"
            className="mt-[0.7rem] h-5 w-5 ml-3 text-red-500"
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (!openForm) {
      setGroup(null);
    }
  }, [openForm]);

  const customDataForExport = builders?.map((builder) => ({
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
          <Heading label="All Sub Contractors Groups" />
        </div>
        {/* <div className="flex items-center font-semibold cursor-pointer">
          <div className="mr-16">
            <div className="relative inline-block text-left">
              <div>
                <div
                  onClick={toggleDropdown}
                  className="flex items-center bg-primary py-2 px-5 rounded-md text-white"
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
        </div> */}
      </div>
      {isLoading || isRefetching || isSubmitting || isDeleting ? (
        <Spinner isSubmitting={isLoading || isRefetching || isSubmitting || isDeleting} />
      ) : (
        <div className="px-12 mt-5 rounded-lg">
          <Table
            data={builders}
            columns={columns}
            actionButton={() => (
              <button
                onClick={() => {
                  setOpenForm(true);
                }}
                className="bg-primary text-sm py-2 px-3 rounded-md text-white"
              >
                Add Groups
              </button>
            )}
          />
        </div>
      )}

      <Modal openModal={openModal} closeModal={setOpenModal}>
        <BuilderImportForm />
      </Modal>

      <Modal openModal={openForm} closeModal={setOpenForm}>
        <AddBuildersGroupForm
          group={group}
          setOpenModal={setOpenForm}
          refetch={refetch}
          setIsSubmitting={setIsSubmitting}
        />
      </Modal>

      {ConfirmationDialog()}
    </div>
  );
}

export default BuildersGroups;
