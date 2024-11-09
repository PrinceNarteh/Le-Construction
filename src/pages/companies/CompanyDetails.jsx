import { Icon } from "@iconify/react";
import React from "react";
import { format } from "libphonenumber-js";
import DetailsCard from "../../components/shared/DetailsCard";
import { Link } from "react-router-dom";

function CompanyDetails({
  company,
  openDetails,
  closeDetails,
  handleDelete,
  handleEdit,
}) {
  const edit = () => {
    handleEdit(company);
    closeDetails();
  };
  return (
    <DetailsCard
      start
      heading="Company Details"
      title={company?.company_name}
      description={company?.email}
      image={company?.company_logo}
      openDetails={openDetails}
      closeDetails={closeDetails}
      actionButtons={() => (
        <div>
          <button onClick={() => edit()}>
            <Icon icon="iconamoon:edit-light" className="h-5 w-5" />
          </button>
          <button onClick={() => handleDelete(company)}>
            <Icon
              icon="fluent:delete-28-regular"
              className="h-5 w-5 ml-3 text-red-500"
            />
          </button>
        </div>
      )}
    >
      <div>
        <div className=" mt-14">
          <div className="w-full flex items-center bg-white rounded-xl p-8">
            <div>
              <img
                src={company?.company_logo}
                alt=""
                className="rounded-xl mr-10 w-96"
              />
            </div>

            <div>
              <div className="mb-3 text-blue-900 text-2xl font-bold leading-[33.60px]">
                Profile Information
              </div>

              <div className="space-y-3">
                <div className="flex">
                  <div className="text-slate-500 text-md font-normal leading-[27px] w-28">
                    Email:
                  </div>
                  <div className="ml-9 text-blue-900 text-md font-bold leading-[27px]">
                    {company?.email}
                  </div>
                </div>

                <div className="flex">
                  <div className="text-slate-500 text-md font-normal leading-[27px] w-28">
                    Mobile:{" "}
                  </div>
                  <div className="ml-9 text-blue-900 text-md font-bold leading-[27px]">
                    {format(company?.phone_number ?? "", "INTERNATIONAL")}
                  </div>
                </div>

                <div className="flex">
                  <div className="text-slate-500 text-md font-normal leading-[27px] w-28">
                    Location:
                  </div>
                  <div className="ml-9 text-blue-900 text-md font-bold leading-[27px]">
                    {company?.address.street}, {company?.address.state},{" "}
                    {company?.address.city}
                  </div>
                </div>

                <div className="flex">
                  <div className="text-slate-500 text-md font-normal leading-[27px] w-28">
                    Country:
                  </div>
                  <div className="ml-9 text-blue-900 text-md font-bold leading-[27px]">
                    {company?.address?.country}
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="text-slate-500 text-md font-normal leading-[27px] w-28">
                    App Code:
                  </div>
                  <div className="ml-9 text-blue-900 text-md font-bold leading-[27px]">
                    {company?.app_code ?? "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" bg-white mt-8 rounded-lg p-8">
        <div className=" text-blue-900 text-2xl font-bold leading-[33.60px]">
          Projects
        </div>
        <div className=" text-slate-500 text-sm font-normal leading-tight">
          Done Projects
        </div>

        <div className="grid grid-cols-4 gap-5 mt-5 ">
          {company?.projects.slice(0, 4).map((project, index) => (
            <div
              key={index}
              className="h-68 w-full bg-white rounded-xl p-4 space-y-3 shadow-lg"
            >
              <div className="w-full"></div>
              <div>
                <img
                  src={project.project_images ? project.project_images[0] : ""}
                  alt=""
                  className="h-32 w-full object-cover rounded-lg"
                />
              </div>
              <div className="w-full">
                <div className="h-[25px] justify-between items-center flex">
                  <div className="flex items-center">
                    <div className="line-clamp-1 capitalize text-blue-900 text-base font-bold leading-snug">
                      {project.project_name}
                    </div>
                  </div>
                </div>

                <div className="w-full line-clamp-3 text-slate-400 text-[12.84px] font-normal leading-tight mt-2">
                  {project.project_description}
                </div>
              </div>
              <div className="w-full">
                <div className="">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-[92.27px] h-[25.21px] px-[9.14px] py-[3.10px] ${project.bg} rounded-md justify-center items-center gap-[6.21px] flex`}
                    >
                      <div
                        className={`${project.text} text-[13px] font-semibold leading-tight`}
                      >
                        {project.status}
                      </div>
                    </div>
                    <Link
                      to={`/jobs/${project._id}`}
                      className="text-orange-400 text-sm font-bold underline leading-snug"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DetailsCard>
  );
}

export default CompanyDetails;
