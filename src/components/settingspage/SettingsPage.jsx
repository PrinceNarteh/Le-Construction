import React from "react";
import { useUserSelector } from "../../hooks/useUserSelector";
import { capitalize } from "../../utils/capitalize";
import { format } from "libphonenumber-js";

function SettingsPage() {
  const { user } = useUserSelector();
  return (
    <div className="cursor-pointer">
      <div className="grid grid-cols-3 gap-5">

        <div className="min-h-[25rem] w-full bg-white rounded-xl p-4">
          <div className="w-[442.69px] text-indigo-900 text-xl font-bold leading-[31.07px]">
            General Information
          </div>

          <div className="grid grid-cols-1 gap-3 mt-3">
            <div className="h-64 overflow-y-auto">
              <div className="h-20 rounded-xl shadow-lg p-4">
                <div className="text-slate-400 text-sm font-normal leading-tight">
                  Email
                </div>
                <div className="mt-2 text-blue-900 w-full text-sm font-semibold leading-none">
                  {user?.email}
                </div>
              </div>

              <div className="h-20 rounded-xl shadow-lg p-4">
                <div className="text-slate-400 text-sm font-normal leading-tight">
                  Phone
                </div>
                <div className="mt-2 text-blue-900 w-full text-sm font-semibold leading-none">
                  {format(user?.phone_number, "INTERNATIONAL")}
                </div>
              </div>

              <div className="h-20 rounded-xl shadow-lg p-4">
                <div className="text-slate-400 text-sm font-normal leading-tight">
                  Address
                </div>
                <div className="mt-2 text-blue-900 w-full text-sm font-semibold leading-none">
                  {`${capitalize(user?.address?.city, " ")}, ${capitalize(
                    user?.address?.state,
                    " ",
                  )}`}
                </div>
              </div>

              <div className="h-20 rounded-xl shadow-lg p-4">
                <div className="text-slate-400 text-sm font-normal leading-tight">
                  Country
                </div>
                <div className="mt-2 text-blue-900 w-full text-sm font-semibold leading-none">
                  {user?.address?.country}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="h-[25rem] w-full bg-white rounded-xl p-4">
          <div className="flex justify-between">
            <div className=" text-indigo-900 text-xl font-bold leading-[31.07px]">
              Notifications
            </div>

            <div className="h-10 w-10 flex justify-center items-center rounded-xl bg-orange-50">
              <Icon
                icon="mi:options-horizontal"
                className="h-6 w-6 text-orange-700"
              />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex item-center">
              <label className="relative inline-flex items-center mb-5 cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-orange-700"></div>

                <div className="text-blue-900 text-sm font-semibold leading-normal ml-2">
                  Builder update notifications
                </div>
              </label>
            </div>

            <div className="flex item-center">
              <label className="relative inline-flex items-center mb-5 cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-orange-700"></div>
              </label>

              <div className="text-blue-900 text-sm font-semibold leading-normal ml-2">
                Mute notifications
              </div>
            </div>

            <div className="flex item-center">
              <label className="relative inline-flex items-center mb-5 cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-orange-700"></div>
              </label>

              <div className="text-blue-900 text-sm font-semibold leading-normal ml-2">
                Client review notifications
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default SettingsPage;
