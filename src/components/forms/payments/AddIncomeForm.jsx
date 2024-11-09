import React from "react";
import { Icon } from "@iconify/react";


function AddIncomeForm() {
  return (
    <div className="p-4">
      <div>
        <div className="text-xl text-blue-900 font-bold">Edit Transaction</div>
      </div>

      <form>
        <div>
          <div className="flex gap-7 w-full mt-4">
            <div className="w-full">
              <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                Date
              </label>
              <input
                type="date"
                className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md py-2 pl-4 pr-3 sm:text-sm "
              />
            </div>
            <div className="w-full">
              <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                Description
              </label>
              <textarea
                type="text"
                placeholder="description"
                className=" h-10 placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md py-2 pl-4 pr-3 sm:text-sm "
              />
            </div>
          </div>
          <div className="flex gap-7 w-full mt-2">
            <div className="w-full">
              <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                Account
              </label>
              <select
                type="date"
                className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md py-2 pl-4 pr-3 sm:text-sm "
              >
                <option>Cash on Hand</option>
              </select>
            </div>
            <div className="w-full">
              <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                type
              </label>
              <select
                type="text"
                placeholder="description"
                className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md py-2 pl-4 pr-3 sm:text-sm "
              >
                <option>Deposit</option>
              </select>
            </div>
          </div>
          <div className="flex gap-7 w-full mt-2">
            <div className="w-full">
              <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                Amount
              </label>
              <input
                type="date"
                className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md py-2 pl-4 pr-3 sm:text-sm "
              />
            </div>
            <div className="w-full">
              <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                Category
              </label>
              <select
                type="text"
                placeholder="description"
                className="h-10 placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md py-2 pl-4 pr-3 sm:text-sm "
              >
                <option>Uncategorized Income</option>
              </select>
            </div>
          </div>
          <div className="flex items-center">
            <div className="border border-primary w-40 rounded-full p-1 flex justify-center mt-6">
              <div className="text-primary"> Split transactions</div>
            </div>
            <div className="text-primary font-bold ml-3 mt-5">Add a client</div>
          </div>

          <div className="w-full mt-6">
            <label className="mb-1 font-bold block text-blue-900 text-md leading-loose">
              Notes
            </label>
            <textarea
              type="text"
              placeholder="Write a note here...."
              className="h-20 placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md py-2 pl-4 pr-3 sm:text-sm "
            />
          </div>

          <div className="flex-1 mt-4">
            <label className="text-blue-900 text-md font-semibold leading-loose ">
              Receipt
            </label>
            <div className="flex flex-col items-center gap-5 mt-2 md:flex-row">
              <label
                htmlFor="dropzone-file"
                className="flex-1 w-full block h-32 border-2 border-primary bg-[#F4F6FB] border-dashed rounded-lg cursor-pointer p-"
              >
                <div className="flex flex-col items-center justify-center pt-2 pb-6">
                  <svg
                    aria-hidden="true"
                    className="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <div className="text-center">
                    <span className="text-blue-900 text-[15px] font-bold leading-loose">
                      Drop your receipt here, or
                    </span>
                    <span className="text-primary text-[15px] font-bold leading-loose ml-2">
                      browse
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    PNG, JPG and GIF files are allowed
                  </p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex mt-3">
            <div className="border border-primary rounded-full w-10 h-10 flex justify-center items-center ">
              <Icon icon="icon-park-outline:delete" className="text-primary"/>
            </div>
            <div className="border border-primary rounded-full w-10 h-10 flex ml-2 justify-center items-center">
              <Icon icon="carbon:copy" className="text-primary"/>
            </div>
          </div>

          <div className="flex justify-end items-center">
            <div className="bg-primary w-28 rounded-full p-1 flex justify-center">
              <div className="text-white"> Cancel</div>
            </div>
            <div className="ml-2 border border-primary w-28 rounded-full p-1 flex justify-center">
              <div className="text-primary"> Save</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddIncomeForm;
