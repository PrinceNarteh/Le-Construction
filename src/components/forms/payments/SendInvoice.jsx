import React from "react";

function SendInvoice() {
  return (
    <div className="p-4">
      <div>
        <div className="text-blue-900 font-bold text-2xl mb-5">
          Send Invoice
        </div>
      </div>

      <form>
        <div className="space-y-5">
          <div className="w-full">
            <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
              From
            </label>
            <select className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 rounded-md py-3 pl-9 pr-3 sm:text-sm">
              <option>benjamin@codecoast.com.gh</option>
              <option>benjamin@codecoast.com.gh</option>
            </select>
          </div>

          <div className="w-full">
            <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
              To
            </label>
            <input
              type="text"
              className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 rounded-md py-3 pl-9 pr-3 sm:text-sm"
            />
          </div>

          <div className="w-full">
            <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
              Subject
            </label>
            <input
              type="text"
              className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 rounded-md py-3 pl-9 pr-3 sm:text-sm"
            />
          </div>

          <div className="w-full">
            <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
              Message
            </label>
            <textarea
              type="text"
              placeholder="Description"
              className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 rounded-md py-3 pl-9 pr-3 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button className="h-10 w-28 rounded-md bg-primary text-white mt-4">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default SendInvoice;
