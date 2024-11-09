import { Icon } from "@iconify/react";
import React from "react";
import { Link } from "react-router-dom";
import Heading from "../../components/layout/Heading";

function FloorPlan() {
  return (
    <div className="px-10 cursor-pointer">
      <div className="flex items-center justify-between mt-5">
        <div className="">
          <Heading label="Floor Plan" />
        </div>
        <div className="ml-6 w-[130px] h-10 py-2.5 bg-gradient-to-r from-primary to-secondary rounded-md shadow flex-col justify-center items-center gap-[7.25px] inline-flex">
          <div className="justify-start items-center gap-[7.25px] inline-flex">
            <Link
              to="/floor"
              className="text-gray-50 text-[13px] font-bold leading-snug"
            >
              <span className="mr-1">+</span>New Design
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-5">
        <div className="w-full bg-white shadow-lg rounded-lg p-4 ">
          <div className="justify-between items-center flex">
            <div className=" text-blue-900 text-lg font-bold leading-[25.20px]">
              Sofia Ali
            </div>
            <div className="text-right text-blue-900 text-opacity-80 text-sm font-normal leading-tight">
              Aug 09, 2023
            </div>
          </div>

          <div className="mt-3 bg-slate-300 p-2 rounded-md">
            <img
              src="/images/floorplan.png"
              alt=""
              className="h-40 w-full object-cover"
            />
          </div>

          <div className="mt-3 flex justify-between items-center">
            <div className="bg-violet-50 rounded-md">
              <div className="w-[92px] flex justify-center py-1 text-purple-600 text-[13px] font-bold leading-[18.20px]">
                Design
              </div>
            </div>
            <div className="">
              <Icon icon="solar:export-broken" className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="w-full bg-white shadow-lg rounded-lg p-4 ">
          <div className="justify-between items-center flex">
            <div className=" text-blue-900 text-lg font-bold leading-[25.20px]">
              Sofia Ali
            </div>
            <div className="text-right text-blue-900 text-opacity-80 text-sm font-normal leading-tight">
              Aug 09, 2023
            </div>
          </div>

          <div className="mt-3 bg-slate-300 p-2 rounded-md">
            <img
              src="/images/floorplan.png"
              alt=""
              className="h-40 w-full object-cover"
            />
          </div>

          <div className="mt-3 flex justify-between items-center">
            <div className="bg-violet-50 rounded-md">
              <div className="w-[92px] flex justify-center py-1 text-purple-600 text-[13px] font-bold leading-[18.20px]">
                Design
              </div>
            </div>
            <div className="">
              <Icon icon="solar:export-broken" className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloorPlan;
