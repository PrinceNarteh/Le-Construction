import React from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import RadialChart from "./RadialChart";

function ActivitiesBuilder({ activities }) {
  return (
    <div className="px-5 cursor-pointer mb-3">
      <div className="grid grid-cols-12 gap-5 w-full rounded-xl">
        <div className="bg-white col-span-12 lg:col-span-6 rounded-l-xl pl-5 flex items-center justify-center">
          <div className="w-[45%]">
            <div className="text-xl text-blue-900 font-bold w-full">
              Builder's Activities
            </div>

            <div className="text-lg">
              <div className="flex items-center mt-2">
                <div>
                  <Icon
                    icon="radix-icons:dot-filled"
                    className="text-violet-700"
                  />
                </div>
                <div className="text-slate-400 font-normal">Inactive</div>
              </div>

              <div className="ml-5 font-semibold">{activities?.inactives}</div>
            </div>

            <div className="text-lg">
              <div className="flex items-center mt-2">
                <div>
                  <Icon
                    icon="radix-icons:dot-filled"
                    className="text-orange-500"
                  />
                </div>
                <div className="text-slate-400 font-normal">Active</div>
              </div>

              <div className="ml-5 font-semibold">{activities?.actives}</div>
            </div>

            <div className="text-lg">
              <div className="flex items-center mt-2">
                <div>
                  <Icon
                    icon="radix-icons:dot-filled"
                    className="text-yellow-500"
                  />
                </div>
                <div className="text-slate-400 font-normal">Total</div>
              </div>

              <div className="ml-5 font-semibold">{activities?.totals}</div>
            </div>
          </div>

          <div className="shrink-0">
            <RadialChart series={activities?.radial_chart_series} />
          </div>
        </div>

        <div className=" bg-white rounded-r-xl p-8 col-span-12 lg:col-span-6">
          <div className="flex items-center justify-between">
            <div className="text-blue-900 text-xl font-bold leading-[30.63px]">
              Active now
            </div>
            <div className="text-primary text-md font-bold leading-[30.63px]">
              <Link to="/builder-tracking">view more</Link>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full">
              <thead className="border-b-2">
                <tr className="text-left text-sm">
                  <th className="pr-2 whitespace-nowrap">Contractor</th>
                  <th className="px-2 w-20 whitespace-nowrap">Check In</th>
                  <th className="px-2 w-20 whitespace-nowrap">Check Out</th>
                  <th className="pl-2 w-20 whitespace-nowrap text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {activities?.active_now.slice(0, 5).map((active, index) => (
                  <tr key={index}>
                    <td className="pr-2 py-2">
                      <div className="w-full flex">
                        <img
                          src={active.builder.profile_image}
                          alt=""
                          className="h-7 w-7 object-cover mr-1 rounded-full"
                        />
                        <span className="block whitespace-nowrap">
                          {active.builder.f_name} {active.builder.l_name}
                        </span>
                      </div>
                    </td>
                    <td className="w-20 px-2 whitespace-nowrap text-sm text-center">
                      {active.task_time_started}
                    </td>
                    <td className="w-20 px-2 whitespace-nowrap text-sm text-center">
                      {active.task_time_ended}
                    </td>
                    <td className="w-20 pl-2 whitespace-nowrap text-sm text-center">
                      Active
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <div className="w-full">
              <div className="flex text-slate-400 text-[16px] font-bold leading-tight p-3 ">
                <div className="w-[50%] text-sm whitespace-nowrap px-2">
                  Contractor
                </div>
                <div className="w-[25%] text-sm whitespace-nowrap px-2">
                  Check in{" "}
                </div>
                <div className="w-[25%] text-sm whitespace-nowrap px-2">
                  Check out
                </div>
                <div className="w-[10%] text-sm whitespace-nowrap px-2">
                  Status
                </div>
              </div>

              <div className="border-b border-slate-300"></div>

              <div className="flex items-center text-slate-400 text-[16px] font-bold leading-tight p-2 border-b">
                <div className="w-[50%] px-2 text-sm text-blue-900 flex items-center mr-1">
                  <img
                    src="/images/builder.jpg"
                    alt=""
                    className="h-7 w-7 object-cover mr-1 rounded-full"
                  />
                  <span className="whitespace-nowrap px-2">
                    Jefferson Sunday
                  </span>
                </div>
                <div className="w-[25%] text-sm text-blue-900 px-2">
                  11:23am
                </div>
                <div className="w-[25%] text-sm text-blue-900 px-2">1:24pm</div>
                <div className="w-[10%] text-sm text-green-500 px-2">
                  Active
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivitiesBuilder;
