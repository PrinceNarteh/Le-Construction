import React from "react";

function GeneralSettingsForm() {
  return (
    <div className="pl-7 pr-7">
      <form>
        <div className="bg-white w-full rounded-xl p-5">
          <div className="space-y-2">
            <div className="flex gap-5">
              <div className="w-full">
                <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                  Time Zone
                </label>
                <input
                  type="text"
                  placeholder="Time Zone"
                  className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 rounded-md py-3 pl-9 pr-3 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                  Time Format
                </label>
                <input
                  type="text"
                  placeholder="Time Format"
                  className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 rounded-md py-3 pl-9 pr-3 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  placeholder="Currency Symbol"
                  className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 rounded-md py-3 pl-9 pr-3 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-full">
                <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                  Digit After Decimal Point
                </label>
                <input
                  type="text"
                  placeholder="Decimal Point"
                  className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 rounded-md py-3 pl-9 pr-3 sm:text-sm"
                />
              </div>
              <div className="w-full">
                <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                  Copyright Text
                </label>
                <input
                  type="text"
                  placeholder="Copyright Text"
                  className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 rounded-md py-3 pl-9 pr-3 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-5 justify-end">
            <div className="w-48 mt-5 h-12 py-5 bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex">
              <button className="text-white text-md font-bold leading-loose">
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default GeneralSettingsForm;
