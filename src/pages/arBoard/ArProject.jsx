import { Icon } from "@iconify/react";
import React from "react";
import { Link } from "react-router-dom";

import Heading from "../../components/layout/Heading";
import { queryKeys } from "../../constants/queryKeys";
import usePostQuery from "../../hooks/usePostQuery";
import "@google/model-viewer/dist/model-viewer";
import { Skeleton } from "../../components/skeleton/Skeleton";

function ArProject() {
  const { data, isLoading } = usePostQuery({
    queryKey: [queryKeys.Projects],
    url: "/projects/for/company",
    showLoadingBar: true,
  });

  const projects = data?.message ?? [];

  return (
    <div className="px-10 mt-5 cursor-pointer">
      <div className="mb-5">
        <Heading label="Ar Projects" />
      </div>

      {isLoading ? (
        <div className="grid grid-auto-fit-xl gap-3">
          {
            <>
              {Array(8)
                .fill(null)
                .map(() => (
                  <div className="w-full bg-white/60 rounded-lg flex items-center gap-1 justify-between p-4 shadow-lg ">
                    <div className="w-full h-32 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <Skeleton className="w-40" />
                        <Skeleton className="w-20" />
                      </div>
                      <div className="space-y-2.5">
                        <Skeleton className="w-28" />
                        <Skeleton className="w-28" />
                      </div>
                    </div>

                    <Skeleton className="h-32 w-52 rounded-md" />
                  </div>
                ))}
            </>
          }
        </div>
      ) : (
        <div className="grid grid-auto-fit-xl gap-3">
          {projects.map((project, idx) => {
            const originalDateString = project.created_at;
            const originalDate = new Date(originalDateString);

            const options = { day: "numeric", month: "long", year: "numeric" };
            const formattedDate = originalDate.toLocaleDateString(
              "en-US",
              options,
            );

            if (project.file_type === "usdz") {
              return (
                <Link key={idx} to={`/arboard/${project._id}`}>
                  <div className="w-full bg-white rounded-lg flex items-center gap-1 justify-between p-4 shadow-lg ">
                    <div className="w-full h-32 flex flex-col justify-between">
                      <div>
                        <div className="line-clamp-2 text-blue-900 text-lg font-bold leading-tight mb-2">
                          {project.project_name}
                        </div>
                        <div className="text-slate-400 text-sm font-semibold leading-tight">
                          {project.project_address.city},{" "}
                          {project.project_address.country}
                        </div>
                      </div>
                      <div>
                        <div className="w-40 truncate text-slate-400 text-sm font-normal leading-tight mb-1 flex items-center">
                          <Icon
                            icon="ph:clock-clockwise-bold"
                            className="mr-1 text-primary h-4 w-4"
                          />

                          <div>{formattedDate}</div>
                        </div>
                        <div className="w-40 truncate text-slate-400 text-sm font-normal leading-tight flex items-center">
                          <Icon
                            icon="fluent:people-edit-20-regular"
                            className="mr-1 text-primary h-4 w-4"
                          />

                          <div>{project.task_objects.length} Task(s)</div>
                        </div>
                      </div>
                    </div>

                    <div className="h-32 w-52 rounded-md bg-black/60">
                      <model-viewer
                        src={project?.project_images[0]}
                        // ios-src="/images/scanned.usdz"
                        alt={project?.project_name}
                        shadow-intensity="1"
                        camera-controls
                        auto-rotate
                        ar
                        style={{ width: "100%", height: "100%" }}
                        camera-orbit="0deg 90deg 0deg 8.37364m"
                        ar-modes="webxr scene-viewer quick-look"
                        autoplay
                        interaction-prompt-threshold="0"
                        exposure="1.0"
                        seamless-poster
                        environment-image="neutral"
                        id="first"
                      ></model-viewer>
                    </div>
                  </div>
                </Link>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}

export default ArProject;
