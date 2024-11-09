import { Icon } from "@iconify/react";
import { format } from "libphonenumber-js";
import React from "react";
import DetailsCard from "../../components/shared/DetailsCard";
import { useUserSelector } from "../../hooks/useUserSelector";
import { capitalize } from "../../utils/capitalize";

const EmployeeDetails = ({
  employee = null,
  openDetails,
  closeDetails,
  handleEdit,
  handleDelete,
}) => {
  const { user } = useUserSelector();

  const edit = () => {
    handleEdit(employee);
    closeDetails();
  };

  return (
    <DetailsCard
      heading="Employee Details"
      title={`${employee?.f_name} ${employee?.l_name}`}
      description={employee?.email}
      image={employee?.profile_photo}
      openDetails={openDetails}
      closeDetails={closeDetails}
      actionButtons={() => (
        <div>
          <button onClick={() => edit()}>
            <Icon icon="iconamoon:edit-light" className="h-5 w-5" />
          </button>
          <button onClick={() => handleDelete(employee)}>
            <Icon
              icon="fluent:delete-28-regular"
              className="h-5 w-5 ml-3 text-red-500"
            />
          </button>
        </div>
      )}
    >
      <div className="bg-white mt-14 p-5 rounded-md mx-auto">
        <div className="flex flex-col gap-10 items-center lg:flex-row">
          <div className="shrink-0 basis-60">
            <img
              src={employee?.profile_photo}
              alt=""
              className="rounded-xl object-cover w-full h-full"
            />
          </div>

          <div className="">
            <div className="w-fit mb-4 text-blue-900 text-2xl font-bold leading-[33.60px]">
              Employee Information
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <p className="text-slate-500 text-md font-normal leading-[27px] w-32">
                  Company:
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-blue-900 text-md font-bold leading-[27px] mr-2">
                    {capitalize(user.company_name, " ")}
                  </div>
                  <img
                    src={user?.brand?.company_logo}
                    alt=""
                    className="h-10 w-10 object-cover rounded-full"
                  />
                </div>
              </div>

              <div className="flex">
                <div className="text-slate-500 text-md font-normal leading-[27px] w-32">
                  Email:
                </div>
                <div className="text-blue-900 text-md font-bold leading-[27px]">
                  {employee?.email}
                </div>
              </div>

              <div className="flex">
                <div className="text-slate-500 text-md font-normal leading-[27px] w-32">
                  Mobile:{" "}
                </div>
                <div className="text-blue-900 text-md font-bold leading-[27px]">
                  {employee?.phone_number
                    ? format(employee?.phone_number, "INTERNATIONAL")
                    : ""}
                </div>
              </div>

              <div className="flex">
                <div className="text-slate-500 text-md font-normal leading-[27px] w-32">
                  User Type:
                </div>
                <div className="text-blue-900 text-md font-bold leading-[27px]">
                  {capitalize(employee?.user_type)}
                </div>
              </div>

              <div className="flex">
                <div className="text-slate-500 text-md font-normal leading-[27px] w-32">
                  Role:
                </div>
                <div className="text-blue-900 text-md font-bold leading-[27px]">
                  {capitalize(employee?.role.name)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DetailsCard>
  );
};

export default EmployeeDetails;
