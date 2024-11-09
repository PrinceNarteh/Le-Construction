import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "libphonenumber-js";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ExportToExcel } from "../../components/ExportToExcel";
import Spinner from "../../components/Spinner";
import ContractorImportForm from "../../components/forms/import-bulk-forms/ContractorImportForm";
import Heading from "../../components/layout/Heading";
import Modal from "../../components/shared/Modal";
import Table from "../../components/shared/Table";
import { queryKeys } from "../../constants/queryKeys";
import useConfirm from "../../hooks/useConfirm";
import { useGetQuery } from "../../hooks/useGetQuery";
import useMutate from "../../hooks/useMutate";
import CompanyForm from "../../components/forms/CompanyForm";
import CompanyDetails from "./CompanyDetails";

function AllCompany() {
  const queryClient = useQueryClient();
  const [company, setCompany] = useState(null);
  const [openCompanyDetails, setOpenCompanyDetails] = useState(false);
  const [openCompanyForm, setOpenCompanyForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const fileName = "All Contractors";

  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleDetails = (company) => {
    setCompany(company);
    setOpenCompanyDetails(true);
  };

  const handleEdit = (company) => {
    setCompany(company);
    setOpenCompanyForm(true);
  };

  const { data, isLoading } = useGetQuery({
    queryKey: [queryKeys.Companies],
    url: "/companies/all",
  });

  const {
    confirm,
    ConfirmationDialog,
    setIsOpen: setOpenConfirm,
  } = useConfirm();
  const { mutate } = useMutate();
  const handleDelete = async (company) => {
    const isConfirmed = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to delete "${company.company_name}?`,
    });

    if (isConfirmed) {
      const toastId = toast.loading(`Deleting ${company.company_name}`);

      mutate(
        {
          url: "/company/delete",
          method: "DELETE",
          data: {
            company_id: company?._id,
          },
        },
        {
          async onSuccess() {
            await queryClient.setQueryData(
              [queryKeys.Companies],
              (oldData) => ({
                message: (oldData?.message ?? []).filter(
                  (item) => item._id !== company?._id
                ),
              })
            );
            toast.dismiss(toastId);
            toast.success(`${company.company_name} deleted successfully`);
            setOpenConfirm(false);
            setOpenCompanyDetails(false);
          },
          onError(error) {
            toast.dismiss(toastId);
            toast.error(error.response.data.message);
            setOpenConfirm(false);
          },
        }
      );
    }
  };

  const contractors = data ? data.message : [];
  const customDataForExport = contractors?.map((contractor) => ({
    "First Name": contractor.f_name,
    "Last Name": contractor.l_name,
    Phone: contractor.phone_number,
    Email: contractor.email,
    Country: contractor.country,
    "Country Code": contractor.country_code,
    "User Type": contractor.user_type,
    "Created At": contractor.created_at,
  }));

  const columns = [
    {
      id: "SN",
      header: "SN",
      accessorKey: "",
      cell: (props) => <span className="px-1">{props.row.index + 1}</span>,
    },
    {
      header: "Company",
      id: "Company",
      accessorFn: (row) => `${row.company_name} ${row.email}`,
      cell: (props) => (
        <div className="flex items-center">
          <div>
            <img
              src={props.row.original.company_logo}
              alt=""
              className="h-12 w-12 object-cover rounded-full"
            />
          </div>
          <div className="ml-2">
            <div className=" text-blue-900 text-[15px] font-bold leading-snug">
              {props.row.original.company_name}
            </div>
            <div className=" text-slate-400 text-sm font-normal leading-tight">
              {props.row.original.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Phone Number",
      accessorKey: "phone_number",
      cell: (props) => (
        <span>
          {props.getValue() ? format(props.getValue(), "INTERNATIONAL") : ""}
        </span>
      ),
    },
    {
      header: "Country",
      accessorFn: (row) => `${row.address?.country}`,
    },
    {
      header: "Details",
      cell: (props) => (
        <button
          onClick={() => handleDetails(props.row.original)}
          className="text-white text-[12px] font-bold bg-primary px-3 py-1.5 rounded-md"
        >
          View Profile
        </button>
      ),
    },
    {
      header: "Actions",
      accessorKey: "",
      cell: (props) => (
        <span className="w-20 flex gap-3">
          <button onClick={() => handleEdit(props.row.original)}>
            <Icon
              icon="iconamoon:edit-light"
              className="mt-[0.7rem] h-5 w-5 ml-3"
            />
          </button>
          <button onClick={() => handleDelete(props.row.original)}>
            <Icon
              icon="fluent:delete-28-regular"
              className="mt-[0.7rem] h-5 w-5 ml-3 text-red-500"
            />
          </button>
        </span>
      ),
    },
  ];

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
    if (!openCompanyDetails && !openCompanyForm) {
      setCompany(null);
    }
  }, [openCompanyDetails, openCompanyForm]);

  return (
    <div className="">
      <div className="flex justify-between items-center mt-5" ref={modalRef}>
        <div className="ml-12">
          <Heading label="All Companies" />
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
                    {/* <div
                      onClick={() => setOpenModal(true)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Import Contractors
                    </div> */}
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

      <div className="px-12">
        <div className="bg-white mt-7 rounded-lg px-5">
          {isLoading ? (
            <Spinner isSubmitting={isLoading} /> // Display the spinner
          ) : (
            <Table
              data={contractors}
              columns={columns}
              actionButton={() => (
                <button
                  onClick={() => setOpenCompanyForm(true)}
                  className="bg-primary py-2 px-4 text-xs rounded-md text-white flex items-center gap-1"
                >
                  <Icon
                    icon="ant-design:plus-circle-outlined"
                    className="font-bold"
                  />
                  <span>Add New Company</span>
                </button>
              )}
            />
          )}
        </div>
      </div>

      <Modal openModal={openModal} closeModal={setOpenModal}>
        <ContractorImportForm />
      </Modal>

      <CompanyDetails
        company={company}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        openDetails={openCompanyDetails}
        closeDetails={setOpenCompanyDetails}
      />

      <Modal
        start
        width="max-w-3xl"
        disableClickedOutside
        openModal={openCompanyForm}
        closeModal={setOpenCompanyForm}
      >
        <CompanyForm
          company={company}
          handleDetails={handleDetails}
          setOpenCompanyForm={setOpenCompanyForm}
        />
      </Modal>

      {ConfirmationDialog()}
    </div>
  );
}

export default AllCompany;