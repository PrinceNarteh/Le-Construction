import React from "react";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import Heading from "../../components/layout/Heading";
import Table from "../../components/shared/Table";
import { queryKeys } from "../../constants";
import usePostQuery from "../../hooks/usePostQuery";

function BuilderTracking() {
  const { data, isLoading } = usePostQuery({
    queryKey: [queryKeys.Activities],
    url: "/activities",
    data: {
      status: 1,
    },
  });

  const activities = data ? data.message : [];
  const columns = [
    {
      id: "SN",
      accessorKey: "",
      header: "SN",
      cell: (info) => <span>{info.row.index + 1}</span>,
    },
    {
      header: "Name",
      id: "Name",
      accessorFn: (row) => `${row.f_name} ${row.l_name} ${row.email}`,
      cell: (props) => (
        <div className="flex items-center">
          <img
            src={props.row.original.builder.profile_image}
            alt=""
            className="h-12 w-12 object-cover rounded-full"
          />
          <div className="ml-2">
            <p className=" text-blue-900 text-[15px] font-bold leading-snug">
              {`${props.row.original.builder.f_name} ${props.row.original.builder.l_name}`}
            </p>
            <p className=" text-slate-400 text-sm font-normal leading-tight">
              {props.row.original.builder.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Project Name",
      accessorKey: "project_name",
    },
    {
      header: "Task Name",
      accessorKey: "task_name",
    },
    {
      header: "Check In",
      accessorKey: "task_time_started",
    },
    {
      header: "Check Out",
      accessorKey: "task_time_ended",
    },
    {
      header: "Actions",
      cell: (props) => (
        <Link
          to={`/builder-tracking/${props.row.original._id}`}
          className="text-xs border border-primary py-1 px-3 font-bold text-primary hover:text-white hover:bg-primary rounded duration-300"
        >
          Details
        </Link>
      ),
    },
  ];

  return (
    <div className="">
      <div className="ml-9">
        <Heading label="Contractors Activity Tracking" />
      </div>

      <div className="px-12 mt-12">
        <Table data={activities} columns={columns} loading={isLoading} />
      </div>
    </div>
  );
}

export default BuilderTracking;
