import React from "react";
import { Link, useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { queryKeys } from "../../constants";
import { useGetQuery } from "../../hooks/useGetQuery";
import usePostQuery from "../../hooks/usePostQuery";

export default function BuilderTrackingDetails() {
  const { builderTrackingId } = useParams();
  const { data: builderTracking, isLoading: builderTrackingLoading } =
    useGetQuery({
      queryKey: [queryKeys.Activities, builderTrackingId],
      url: `/activity/${builderTrackingId}`,
    });

  const builderId = builderTracking?.message.builder?._id;
  const { data } = usePostQuery({
    queryKey: [queryKeys.ProjectsForBuilder, builderTrackingId],
    url: "/projects/for/builder",
    data: {
      builder_id: builderTrackingId,
    },
    enabled: !!builderId,
  });

  if (builderTrackingLoading)
    return <Spinner isSubmitting={builderTrackingLoading} />;

  const activity = builderTracking?.message ?? [];
  const projects = data?.message ?? [];

  return (
    <div className="">
      <div className="pl-12 pr-12">
        <div className="h-52 bg-primary bg-[url('/public/images/wave.png')] rounded-xl relative">
          <div className=" ml-9 top-0 text-white text-2xl font-bold absolute mt-7">
            <h3 className="">Contractor Tracking Details</h3>
          </div>

          <div className="h-20 w-[97%] mr-10 bg-white/75 backdrop-blur-lg  rounded-xl  absolute ml-4 mt-40 flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={activity.builder.profile_image}
                alt=""
                className="h-14 w-14 ml-5 object-cover rounded-lg"
              />
              <div className="ml-3">
                <div className="h-[25px] text-blue-900 text-lg font-bold leading-7">
                  {activity.builder.f_name} {activity.builder.l_name}
                </div>
                <div className="w-[201.79px] h-[19.50px] text-slate-500 text-sm font-normal leading-tight">
                  {activity.builder.email}
                </div>
              </div>
            </div>

            {/* <div className="flex">
              <div className="w-40 h-10 flex justify-center items-center rounded-lg bg-white mr-4">
                <div className="text-blue-900 text-base font-semibold leading-normal">
                  Pay Rate:{" "}
                  <span className="text-blue-900 text-base font-bold leading-normal">
                    $50.00
                  </span>
                </div>
              </div>

              <div className="w-40 h-10 flex justify-center items-center rounded-lg bg-white mr-4">
                <div className="text-blue-600 text-base font-semibold leading-normal">
                  Total:{" "}
                  <span className="text-blue-600 text-base font-bold leading-normal">
                    $50.00
                  </span>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-5 mt-14">
            <div className="col-span-2 w-full bg-white rounded-xl p-8 space-y-4 pl-20 pr-20">
              <div>
                <div className=" h-[33.70px] text-blue-900 text-2xl font-bold leading-[33.60px]">
                  Contractor Tracking Activities
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="text-slate-500 text-md font-normal leading-[27px] ">
                    Check In:
                  </div>
                  <div className="text-blue-900 text-md font-bold leading-[27px]">
                    {activity.task_time_started
                      ? activity.task_time_started
                      : "--:-- --"}
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="text-slate-500 text-md font-normal leading-[27px]">
                    Check Out:
                  </div>
                  <div className="ml-9 text-blue-900 text-md font-bold leading-[27px]">
                    {activity.task_time_ended
                      ? activity.task_time_ended
                      : "--:-- --"}
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="text-slate-500 text-md font-normal leading-[27px]">
                    Break-time start:
                  </div>
                  <div className="ml-9 text-blue-900 text-md font-bold leading-[27px]">
                    {activity.break_time_start
                      ? activity.break_time_start
                      : "--:-- --"}
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="text-slate-500 text-md font-normal leading-[27px]">
                    Break-time end:
                  </div>
                  <div className="ml-9 text-blue-900 text-md font-bold leading-[27px]">
                    {activity.break_time_start
                      ? activity.break_time_start
                      : "--:-- --"}
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="text-slate-500 text-md font-normal leading-[27px]">
                    Duration:
                  </div>
                  <div className="ml-9 text-blue-900 text-md font-bold leading-[27px]">
                    {activity.total_time_worked
                      ? activity.total_time_worked
                      : "--:-- --"}
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="text-slate-500 text-md font-normal leading-[27px]">
                    Project Name:
                  </div>
                  <div className="ml-9 text-blue-900 text-md font-bold leading-[27px]">
                    {activity.project_name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" bg-white mt-8 rounded-lg p-8">
          <div className=" text-blue-900 text-2xl font-bold leading-[33.60px]">
            Tasks
          </div>
          <div className=" text-slate-500 text-sm font-normal leading-tight">
            Assigned Tasks
          </div>

          <div className="grid grid-cols-4 gap-5 mt-5 ">
            {projects.slice(0, 4).map((project, index) => (
              <div
                key={index}
                className="h-68 w-full bg-white rounded-xl p-4 space-y-3 border-2 shadow-lg"
              >
                <div className="w-full"></div>
                <div>
                  <img
                    src={
                      project.project_images ? project.project_images[0] : ""
                    }
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
                        className={`w-[92.27px] h-[25.21px] px-[9.14px] py-[3.10px] ${project.bg} rounded-md justify-center items-center gap-[6.21px] flex line-clamp-1`}
                      >
                        <div
                          className={`${project.text} text-[13px] font-semibold leading-tight line-clamp-3`}
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
      </div>
    </div>
  );
}
