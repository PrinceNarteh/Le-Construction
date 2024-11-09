import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";

function ActiveContractorsSidebar({ isOpenActive, setIsOpenActive, activities, onViewDetailsClick }) {
  const [internalActivities, setInternalActivities] = useState([]);
  const [category, setCategory] = useState("Project Locations");

  function formatUnixTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleTimeString(undefined, options);
  }

  useEffect(() => {
    setInternalActivities(activities);
  }, [activities]);

  return (
    <div
      className={`right-0 transform transition-transform duration-700 ease-in-out ${
        isOpenActive ? "-translate-x-0" : "translate-x-full"
      }`}
    >
      {isOpenActive && (
        <div>
          <div className="backdrop-blur-sm cursor-pointer">
            <div>
              <div className="flex justify-between items-center">
                <h3 className=" text-blue-900 text-lg font-bold p-2 ml-5">
                  Active Contractors
                </h3>
                <div className="mr-8" onClick={() => setIsOpenActive(false)}>
                  <Icon icon="ph:arrow-right" className="h-6 w-6" />
                </div>
              </div>
              <div className="p-7 overflow-y-auto h-[775px] ">
                {internalActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="bg-white border-2 border-primary rounded-xl mb-6 p-5"
                  >
                    <div className=" flex items-center justify-between border-b pb-4">
                      <div className="flex items-center">
                        <img
                          src={activity.builder.profile_image}
                          alt=""
                          className="h-10 w-10 object-cover rounded-full"
                        />
                        <div className="ml-2">
                          <div className="text-slate-400 text-sm font-semibold tracking-tight">
                            Builder
                          </div>
                          <div className=" text-blue-900 text-md font-bold tracking-tight">
                            {activity.builder.f_name} {activity.builder.l_name}{" "}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="h-10 w-10 flex justify-center items-center rounded-xl bg-blue-50">
                          <Icon
                            icon="tabler:message-2-minus"
                            className="h-6 w-6 text-blue-700"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between pt-4">
                        <div className="text-slate-500 text-sm font-normal tracking-tight">
                          Check In
                        </div>
                        <div className="text-right text-blue-900 text-[17px] font-bold tracking-tight">
                          {formatUnixTimestamp(activity.raw_task_time_started)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div className="text-slate-500 text-sm font-normal tracking-tight">
                          Check Out
                        </div>
                        <div className="text-right text-blue-900 text-[17px] font-bold tracking-tight">
                          {formatUnixTimestamp(activity.raw_task_time_ended)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 pb-5 border-b">
                        <div className="text-blue-600 text-base font-bold tracking-tight">
                          Duration
                        </div>
                        <div className="text-blue-600 text-base font-bold tracking-tight">
                          {activity.total_time_worked}
                        </div>
                      </div>

                      <div
                        className="w-full h-10 bg-gradient-to-r mt-4 from-primary to-secondary rounded-md shadow justify-center items-center gap-2.5 inline-flex cursor-pointer"
                        onClick={() =>
                          onViewDetailsClick(
                            parseFloat(activity.builder_lat),
                            parseFloat(activity.builder_long)
                          )
                        }
                      >
                        <div className="text-white text-[15px] font-bold leading-[24.97px]">
                          View details
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveContractorsSidebar;
