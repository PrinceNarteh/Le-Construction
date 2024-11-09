import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";

import Spinner from "../../components/Spinner";
import Heading from "../../components/layout/Heading";
import { queryKeys } from "../../constants";
import useBaseUrl from "../../hooks/useBaseUrl";
import { useUserSelector } from "../../hooks/useUserSelector";

function BidProjects() {
  const { user } = useUserSelector();
  const baseUrl = useBaseUrl();
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.Bids],
    queryFn: async () => {
      const res = await baseUrl.get(`/bids`, {
        headers: {
          companyid: user._id,
        },
      });

      return res.data;
    },
  });
  const projects = data?.message ?? [];

  return (
    <div className="">
      <div className="ml-5 flex justify-between items-center">
        <Heading label="Bid Projects" />
      </div>

      <div className="pl-7 pr-8">
        <div className="grid grid-auto-fit-md gap-5 mt-10 overflow-y-auto">
          {isLoading && (
            <Spinner isSubmitting={isLoading} /> // Display the spinner
          )}
          {projects?.map((project, index) => (
            <div
              key={index}
              className="h-68 max-w-[400px] mx-auto w-full bg-white rounded-xl p-4 space-y-3"
            >
              <div className="w-full">
                <div className="h-[25px] flex justify-between items-center gap-1">
                  <p className="text-blue-900 text-md font-bold leading-normal line-clamp-1">
                    {project.project_name}
                  </p>
                  <div className="text-sm text-orange-500 font-bold leading-normal whitespace-nowrap">
                    <Link to={`/jobs/${project._id}`}>View details</Link>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg">
                <img
                  src={project.project_images[0]}
                  alt=""
                  className="h-32 w-full object-cover"
                />
              </div>
              <div className="w-full">
                <div className="h-[25px] justify-between items-center flex">
                  <div className="flex items-center">
                    <Icon
                      icon="solar:calendar-date-outline"
                      className=" h-4 w-4 text-slate-400 mr-1"
                    />
                    <div className="text-blue-900 text-[12.562444686889648px] font-semibold">
                      Date: {format(new Date(project.created_at), "PPP")}
                    </div>
                  </div>
                  <div
                    className={`pt-1 pb-1.5 px-4 bg-blue-100 rounded-lg justify-center items-center gap-[6.21px] inline-flex`}
                  >
                    <div
                      className={`$text-[13px]  text-blue-800 font-semibold leading-tight`}
                    >
                      {project.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BidProjects;
