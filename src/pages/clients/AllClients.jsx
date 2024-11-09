import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ExportToExcel } from "../../components/ExportToExcel";
import Spinner from "../../components/Spinner";
import ClientImportForm from "../../components/forms/import-bulk-forms/ClientImportForm";
import Heading from "../../components/layout/Heading";
import Modal from "../../components/shared/Modal";
import Table from "../../components/shared/Table";
import { queryKeys } from "../../constants/queryKeys";
import useClickOutside from "../../hooks/useClickOutside";
import useConfirm from "../../hooks/useConfirm";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";
import { capitalize } from "../../utils/capitalize";
import ClientForm from "../../components/forms/ClientForm";

function AllClients() {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [client, setClient] = useState(false);
  const [openClientForm, setOpenClientForm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useClickOutside(() => {
    setIsOpen(false);
  });

  const { data, isLoading } = usePostQuery({
    queryKey: [queryKeys.Clients],
    url: "/company/clients",
  });

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleEdit = (client) => {
    setClient(client);
    setOpenClientForm(true);
  };

  const {
    confirm,
    ConfirmationDialog,
    setIsOpen: setOpenConfirm,
  } = useConfirm();
  const { mutate } = useMutate();
  const handleDelete = async (client) => {
    const name = `${client.first_name} ${client.last_name}`;

    const isConfirmed = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to assign "${name}?`,
    });

    if (isConfirmed) {
      const toastId = toast.loading(`Deleting ${name}`);

      mutate(
        {
          url: "/company/client/delete",
          method: "DELETE",
          data: {
            client_id: client?._id,
          },
        },
        {
          async onSuccess() {
            await queryClient.setQueryData([queryKeys.Clients], (oldData) => ({
              message: (oldData?.message ?? []).filter(
                (item) => item._id !== client?._id,
              ),
            }));
            toast.dismiss(toastId);
            toast.success(`${name} deleted successfully`);
            setOpenConfirm(false);
          },
          onError(error) {
            toast.dismiss(toastId);
            toast.error(error.response.data.message);
            setOpenConfirm(false);
          },
        },
      );
    }
  };

  const fileName = "All Clients";
  const clients = data ? data.message : [];
  const customDataForExport = clients?.map((client) => ({
    "First Name": client.first_name,
    "Last Name": client.last_name,
    Phone: client.phone,
    Email: client.email,
    Country: client.country,
    "Country Code": client.country_code,
    "User Type": client.user_type,
    Role: client.role,
    "Created At": client.created_at,
  }));

  const columns = [
    {
      id: "SN",
      header: "SN",
      cell: (info) => <span className="px-1">{info.row.index + 1}</span>,
    },
    {
      header: "Name",
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Phone Number",
      accessorKey: "phone",
      cell: (props) => `${props.row.original.phone}`,
      //format(props.row.original.phone, "INTERNATIONAL"),
      //cell: (props) => format(props.row.original.phone, "INTERNATIONAL"),
    },
    {
      header: "Role",
      accessorKey: "user_type",
      cell: (props) => (
        <span className="block w-20">{capitalize(props.getValue())}</span>
      ),
    },
    {
      id: "Action",
      header: "Action",
      cell: (cell) => (
        <div className="flex gap-5 items-center cursor-pointer">
          <button onClick={() => handleEdit(cell.row.original)}>
            <Icon icon="iconamoon:edit-light" className="h-5 w-5" />
          </button>
          <button onClick={() => handleDelete(cell.row.original)}>
            <Icon
              icon="fluent:delete-28-regular"
              className="h-5 w-5 text-red-500"
            />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (!openClientForm) {
      setClient(null);
    }
  }, [openClientForm]);

  return (
    <div>
      <div className="">
        <div className="flex justify-between items-center mt-5 " ref={modalRef}>
          <div className="ml-12">
            <Heading label="All Clients" />
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
                        className="gap-2 flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        <Icon
                          icon="solar:import-outline"
                          className="text-primary"
                          fontSize={15}
                        />
                        Import Clients
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
        <div className="px-12  mx-auto">
          <div className="bg-white mt-7 rounded-lg p-5">
            <>
              {!isLoading && clients.length === 0 ? (
                <div className="h-14 bg-neutral-300 border bg-opacity-10 w-full mt-4 mb-4 rounded-md border-l-8 border-l-primary flex items-center">
                  <Icon
                    icon="solar:danger-circle-broken"
                    className="ml-5 mr-1 text-primary h-5 w-5"
                  />
                  <div className=" text-neutral-500 font-semibold">
                    You don't have any clients. Why not
                    <button
                      onClick={() => setOpenClientForm(true)}
                      className="ml-1 text-primary"
                    >
                      Add a client ?
                    </button>
                  </div>
                </div>
              ) : (
                <Table
                  loading={isLoading}
                  data={clients}
                  columns={columns}
                  actionButton={() => (
                    <button
                      onClick={() => setOpenClientForm(true)}
                      className="bg-primary py-2 px-4 text-xs rounded-md text-white flex items-center gap-1"
                    >
                      <Icon
                        icon="ant-design:plus-circle-outlined"
                        className="font-bold"
                      />
                      <span>Add Clients</span>
                    </button>
                  )}
                />
              )}
            </>
          </div>
        </div>
      </div>

      <Modal openModal={openModal} closeModal={setOpenModal}>
        <ClientImportForm closeModal={() => setOpenModal(false)} />
      </Modal>

      <Modal
        start
        width="max-w-3xl"
        disableClickedOutside
        openModal={openClientForm}
        closeModal={setOpenClientForm}
      >
        <ClientForm
          client={client}
          closeModal={() => setOpenClientForm(false)}
        />
      </Modal>

      {/* Delete Client  */}
      {ConfirmationDialog()}
    </div>
  );
}

export default AllClients;
