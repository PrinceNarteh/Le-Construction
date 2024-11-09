import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";

import Spinner from "../../components/Spinner";
import Heading from "../../components/layout/Heading";
import usePostQuery from "../../hooks/usePostQuery";
import { useUserSelector } from "../../hooks/useUserSelector";
import { capitalize } from "../../utils/capitalize";
import taskStatus from "../../utils/taskStatus";
import BidDetails from "./BidDetails";
import { queryKeys } from "../../constants/queryKeys";
import { Skeleton } from "../../components/skeleton/Skeleton";

const statuses = [
  {
    value: -2,
    label: "ALL",
  },
  {
    value: -1,
    label: "TASKS OPEN FOR BID",
  },
  {
    value: 0,
    label: "UNASSIGNED",
  },
  {
    value: 1,
    label: "ASSIGNED",
  },
  {
    value: 2,
    label: "TODO",
  },
  {
    value: 3,
    label: "STARTED",
  },
  {
    value: 4,
    label: "WORK IN PROGRESS",
  },
  {
    value: 5,
    label: "COMPLETED",
  },
  {
    value: 6,
    label: "BREAK",
  },
  {
    value: 7,
    label: "RESUME",
  },
];

function Bids() {
  const { user } = useUserSelector();
  const [status, setStatus] = useState(-2);
  const [filter, setFilter] = useState(false);
  const [bids, setBids] = useState([]);
  const [search, setSearch] = useState("");
  const [bid, setBid] = useState(null);

  const { data, isLoading, refetch } = usePostQuery({
    url: "/bids/placed",
    queryKey: [queryKeys.Bids],
    data: {
      company_id: user.user_type === "company" ? user._id : user.company._id,
      is_expired: false,
      is_assigned: false,
    },
  });

  useEffect(() => {
    if (data?.message) {
      setBids(data?.message.filter((bid) => !bid.is_assigned));
    }
  }, [data]);

  const filteredBids = search
    ? bids.filter((bid) => bid.task_title.includes(search))
    : bids;

  return (
    <div className="px-12 cursor-pointer">
      <div className="flex justify-between">
        <Heading label="Bids" />
      </div>

      <div className="text-slate-400 text-sm font-normal mt-2">
        Welcome to the Bids Page
      </div>

      <div className="w-full h-16 bg-white mt-8 rounded-xl">
        <div className="flex justify-between items-center mx-5 h-16">
          <div className="flex items-center">
            <div className="h-11 w-72 bg-[#F4F6FB] flex ml-2 rounded-lg mr-3 ">
              <Icon icon="circum:search" className="mt-[0.8rem] h-5 w-5 ml-3" />

              <input
                type="text"
                name="name"
                placeholder="Search "
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#F4F6FB] w-40 outline-none p-2 placeholder:text-gray-700 text-sm placeholder:font-normal placeholder:mb-3"
              />
            </div>
          </div>

          <div
            onClick={(e) => setFilter(!filter)}
            className="flex justify-center items-center gap-2 border border-primary  p-1 pr-2 rounded text-white font-semibold "
          >
            <div className="flex bg-primary items-center text-sm py-1 px-3 gap-2 rounded">
              <Icon
                icon="material-symbols:filter-list-rounded"
                className="text-white"
              />
              <span className="block">Filter</span>
            </div>
            <p className="text-primary">{taskStatus(status)}</p>
          </div>
        </div>

        {filter && (
          <ul className="absolute w-56 z-10 right-0 bg-white mt-2 overflow-y-auto border border-slate-400 shadow-md rounded-md px-2 pt-2 max-h-60 cursor-pointer">
            {statuses.map((item) => (
              <li
                key={item.value}
                onClick={() => {
                  setStatus(item.value);
                  setFilter(false);
                }}
                className={`flex items-center gap-2 px-4 py-1 rounded font-semibold ${
                  status === item.value ? "bg-primary text-white" : ""
                }`}
              >
                <span>{capitalize(item.label)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap gap-7 mt-5 mb-3">
        {isLoading && (
          <>
            {Array(5)
              .fill(null)
              .map(() => (
                <div className="flex flex-col justify-between bg-white/60 rounded-2xl p-3 space-y-2 w-80 basis-72 max-w-[350px] flex-1 shadow-md">
                  <Skeleton className="h-44 w-full rounded-2xl" />

                  <Skeleton className="h-4 w-full mt-5" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="rounded-lg h-10 w-full" />
                </div>
              ))}
          </>
        )}
        <>
          {filteredBids.map((bid, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-3 space-y-2 w-80 basis-72 max-w-[350px] flex-1 shadow-md"
            >
              <div className="relative">
                <img
                  src={bid.task_thumbnail}
                  alt=""
                  className="h-44 w-full object-cover rounded-2xl"
                />

                <div className="absolute top-0 mt-2 ml-2">
                  <div className="w-[91.15px] h-[34.26px] px-[9.54px] py-[7.63px] bg-neutral-900 bg-opacity-40 rounded-lg backdrop-blur-[9.54px] justify-center items-center gap-[3.82px] inline-flex">
                    <Icon icon="noto:fire" />
                    <div className="text-center text-white text-[13.35395622253418px] font-semibold leading-tight">
                      New bid
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 ">
                  <div className="h-[35.26px] px-5 py-[7.63px] bg-emerald-50 rounded-lg border border-emerald-500 backdrop-blur-[9.54px] justify-center items-center gap-[3.82px] inline-flex">
                    <div className="text-center text-indigo-950 text-[13.35395622253418px] font-semibold leading-tight">
                      {/* {formatDistance(new Date(bid.created_at), Date.now(), {
                      includeSeconds: true,
                      addSuffix: true,
                    })} */}
                    </div>
                    {/* <div className="text-center text-indigo-950 text-opacity-60 text-[13.35395622253418px] font-semibold leading-tight">
                    Left
                  </div>
                  <Icon icon="noto:fire" /> */}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                {/* <Icon icon="codicon:location" className="mr-1 h-9 w-9" />
              <div className="w-[513px] text-blue-900 text-[14px] font-normal leading-7">
                {bid?.project_address.city}
              </div> */}
              </div>

              <div className="flex justify-between items-center w-full">
                <div className=" text-blue-900 text-[17px] font-bold leading-relaxed line-clamp-1">
                  {bid.task_title}
                </div>

                {/* <div className="flex items-center">
                <Icon icon="pepicons-pencil:people" className="h-5 w-5 mr-1" />
                <div className="text-slate-500 text-[14px] font-semibold leading-normal">
                  05
                </div>
              </div> */}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Icon
                    icon="solar:wallet-money-outline"
                    className="h-5 w-5 mr-1"
                  />
                  <div className="w-full text-blue-900 text-[15px] font-normal leading-loose">
                    Current Bid price
                  </div>
                </div>
                <div className="w-[52.46px] text-right text-blue-900 text-[17px] font-bold leading-relaxed">
                  ${bid.bid_amount}
                </div>
              </div>

              <button
                onClick={() => setBid(bid)}
                className="w-full py-2 text-center text-blue-600 text-[16px] font-bold leading-normal rounded-lg border border-blue-600 "
              >
                Assign
              </button>
            </div>
          ))}
        </>
      </div>

      {/* Bid Details */}
      <BidDetails
        bid={bid}
        closeDetails={() => setBid(null)}
        refetch={refetch}
      />
    </div>
  );
}

export default Bids;
