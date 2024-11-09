import React from "react";

function TaskForBidingDetails() {
  return (
    <div className="cursor-pointer">
      <div className="bg-white rounded-2xl p-3 px-4 space-y-2">
        <div className="flex justify-between items-center w-full">
          <div className=" text-blue-900 text-2xl font-semibold leading-relaxed line-clamp-1 capitalize">
            Tiles Task
          </div>

          <div className="flex items-center">
            <img
              src="/images/hammer.png"
              alt=""
              className="h-9 w-9 object-cover"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-full text-blue-900 text-lg font-normal leading-loose">
              Project
            </div>
          </div>
          <div className=" text-right text-blue-900 text-[17px] font-bold leading-relaxed">
            School Building
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-full text-blue-900 text-lg font-normal leading-loose">
              Minimum price
            </div>
          </div>
          <div className="w-[52.46px] text-right text-blue-900 text-[17px] font-bold leading-relaxed">
            1000
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-full text-blue-900 text-lg font-normal leading-loose">
              Location
            </div>
          </div>
          <div className=" text-right text-blue-900 text-[17px] font-bold leading-relaxed">
            USA, Utah, 435 lincoln ave
          </div>
        </div>
      </div>

      <div className="flex justify-between px-4 mt-3 border-t border-b">
        <div className="w-[40%] text-blue-900 text-md leading-loose font-semibold">
          Contractor
        </div>
        <div className="w-[20%] text-blue-900 text-md leading-loose font-semibold">
          Biding Price
        </div>
        <div className="w-[20%] text-center text-blue-900 text-md leading-loose font-semibold">
          Action
        </div>
      </div>

      <div className="flex justify-between px-4 mt-3">
        <div className="w-[40%] text-blue-900 text-md leading-loose font-semibold ">
          Micheal Asamoah
        </div>
        <div className="w-[20%] text-blue-900 self-center text-md leading-loose font-semibold text-center">
          2000
        </div>
        <div className="w-[20%] h-7 rounded-lg p-2 text-sm bg-emerald-200 text-emerald-600 justify-center items-center gap-[9.54px] inline-flex cursor-pointer ">
          Assign
        </div>
      </div>

      <div className="flex justify-between px-4 mt-3">
        <div className="w-[40%] text-blue-900 text-md leading-loose font-semibold">
          Samuel Yakubu
        </div>
        <div className="w-[20%] text-blue-900  self-center text-md leading-loose font-semibold text-center">
          300
        </div>
        <div className="w-[20%] h-7 rounded-lg p-2 text-sm bg-emerald-200 text-emerald-600 justify-center items-center gap-[9.54px] inline-flex cursor-pointer ">
          Assign
        </div>
      </div>
    </div>
  );
}

export default TaskForBidingDetails;
