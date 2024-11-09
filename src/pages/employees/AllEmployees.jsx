import { Icon } from "@iconify/react";
import { format } from "libphonenumber-js";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ExportToExcel } from "../../components/ExportToExcel";
import Spinner from "../../components/Spinner";
import EmployeeForm from "../../components/forms/EmployeeForm";
import EmployeeImportForm from "../../components/forms/import-bulk-forms/EmployeeImportForm";
import Heading from "../../components/layout/Heading";
import Modal from "../../components/shared/Modal";
import Table from "../../components/shared/Table";
import { queryKeys } from "../../constants/queryKeys";
import useClickOutside from "../../hooks/useClickOutside";
import useConfirm from "../../hooks/useConfirm";
import { useGetQuery } from "../../hooks/useGetQuery";
import useMutate from "../../hooks/useMutate";
import { useUserSelector } from "../../hooks/useUserSelector";
import { capitalize } from "../../utils/capitalize";
import EmployeeDetails from "./EmployeeDetails";

function AllEmployees() {
  const { user } = useUserSelector();
  const [openModal, setOpenModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [openEmployeesForm, setOpenEmployeesForm] = useState(false);
  const [openEmployeeDetails, setOpenEmployeeDetails] = useState(false);
  // const modalRef = useClickOutside(() => {
  //   setOpenModal(true);
  // });

  const { data, isLoading, refetch } = useGetQuery({
    queryKey: [queryKeys.Employees],
    url: `/${
      user.user_type === "company" ? user._id : user.company._id
    }/employees`,
  });

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleDetails = (employee) => {
    setEmployee(employee);
    setOpenEmployeeDetails(true);
  };

  const handleEdit = (employee) => {
    setEmployee(employee);
    setOpenEmployeesForm(true);
  };

  const fileName = "All Employees";
  const employees = data ? data.message : [];
  const customDataForExport = employees?.map((employee) => ({
    "First Name": employee.f_name,
    "Last Name": employee.l_name,
    Phone: employee.phone_number,
    Email: employee.email,
    Role: employee.role.name,
  }));

  const { confirm, ConfirmationDialog, setIsOpen: openAlert } = useConfirm();
  const { mutate } = useMutate([queryKeys.DeleteEmployee]);
  const deleteEmployee = async (employee) => {
    const isConfirmed = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to delete "${employee?.f_name} ${employee?.l_name}"?`,
    });

    if (isConfirmed) {
      const toastId = toast.loading(
        `Deleting ${employee?.f_name} ${employee?.l_name}...`,
      );

      mutate(
        {
          url: "/employee/delete",
          data: {
            employee_id: employee._id,
          },
          method: "DELETE",
        },
        {
          async onSuccess() {
            await refetch();
            toast.dismiss(toastId);
            toast.success(
              `${employee?.f_name} ${employee?.l_name} deleted successfully`,
            );
            openAlert(false);
            setOpenEmployeeDetails(false);
          },
          onError(error) {
            toast.dismiss(toastId);
            toast.error(error.response.data.message);
            openAlert(false);
          },
        },
      );
    }
  };

  const columns = [
    {
      id: "SN",
      header: "SN",
      accessorKey: "",
      cell: (info) => <span className="px-1">{info.row.index + 1}</span>,
    },
    {
      header: "Name",
      id: "Name",
      accessorFn: (row) => `${row.f_name} ${row.l_name} ${row.email}`,
      cell: (props) => (
        <div className="flex items-center">
          <div>
            <img
              src={props.row.original.profile_photo}
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
      header: "Phone Number",
      accessorKey: "phone_number",
      cell: (props) => format(props.getValue(), "INTERNATIONAL"),
    },
    {
      header: "Role",
      accessorFn: (row) => `${row.role.name}`,
      cell: (props) => (
        <span className="block">{capitalize(props.getValue())}</span>
      ),
    },
    {
      header: "Details",
      accessorKey: "",
      cell: (props) => (
        <button
          onClick={() => handleDetails(props.row.original)}
          className="text-white text-[12px] font-bold py-2 px-4 bg-primary rounded-md"
        >
          View profile
        </button>
      ),
    },
    {
      header: "Action",
      cell: (cell) => (
        <div className="flex gap-5 items-center cursor-pointer">
          <button onClick={() => handleEdit(cell.row.original)}>
            <Icon icon="iconamoon:edit-light" className="h-5 w-5" />
          </button>
          <button onClick={() => deleteEmployee(cell.row.original)}>
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
    if (!openEmployeeDetails && !openEmployeesForm) {
      setEmployee(null);
    }
  }, [openEmployeeDetails, openEmployeesForm]);

  return (
    <div className="">
      <div className="flex justify-between items-center mt-5 ">
        <div className="ml-12">
          <Heading label="All Employees" />
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
                      className="gap-2 flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      <Icon
                        icon="solar:import-outline"
                        className="text-primary"
                        fontSize={15}
                      />
                      Import Employees
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
      <div className="pl-12 pr-12">
        <div className="bg-white mt-7 rounded-lg px-5">
          <>
            {!isLoading && employees.length === 0 ? (
              <div className="h-14 bg-neutral-300 border bg-opacity-10 w-full mt-4 mb-4 rounded-md border-l-8 border-l-primary flex items-center">
                <Icon
                  icon="solar:danger-circle-broken"
                  className="ml-5 mr-1 text-primary h-5 w-5"
                />
                <div className=" text-neutral-500 font-semibold">
                  You don't have any employee. Why not
                  <button
                    onClick={() => setOpenEmployeesForm(true)}
                    className="ml-1 text-primary"
                  >
                    Add a employee?
                  </button>
                </div>
              </div>
            ) : (
              <Table
                loading={isLoading}
                data={employees}
                columns={columns}
                actionButton={() => (
                  <button
                    onClick={() => setOpenEmployeesForm(true)}
                    className="bg-primary py-2 px-4 text-xs rounded-md text-white flex items-center gap-1"
                  >
                    <Icon
                      icon="ant-design:plus-circle-outlined"
                      className="font-bold"
                    />
                    <span>Add Employee</span>
                  </button>
                )}
              />
            )}
          </>
        </div>
      </div>

      {/* Employee Details  */}
      <EmployeeDetails
        employee={employee}
        openDetails={openEmployeeDetails}
        handleEdit={handleEdit}
        handleDelete={deleteEmployee}
        closeDetails={() => setOpenEmployeeDetails(false)}
      />

      <Modal
        start
        width="max-w-3xl"
        disableClickedOutside
        openModal={openEmployeesForm}
        closeModal={setOpenEmployeesForm}
      >
        <EmployeeForm
          employee={employee}
          setOpenEmployeeDetails={setOpenEmployeesForm}
        />
      </Modal>

      <Modal openModal={openModal} closeModal={setOpenModal}>
        <EmployeeImportForm closeModal={setOpenModal} />
      </Modal>

      {/* Delete Employee */}
      {ConfirmationDialog()}
    </div>
  );
}

export default AllEmployees;
