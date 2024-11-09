import React from "react";

function ContractorImportForm() {
  return (
    <div className="py-6 px-3 cursor-pointer">
      <div>
        <div className="">
          <h3 className="font-bold text-blue-900 text-2xl ">
            Bulk Contractors Import
          </h3>
        </div>

        <div className="mb-4 mt-5 space-y-3">
          <div className="text-lg font-semibold">Instructions :</div>
          <div className="text-sm font-normal text-slate-400">
            1. Download the format file and fill it with proper data.
          </div>
          <div className="text-sm font-normal text-slate-400">
            2. You can download the example file to understand how the data must
            be filled.
          </div>
          <div className="text-sm font-normal text-slate-400">
            3. Once you have downloaded and filled the format file and upload it
            in the form below and submit. Make sure the phone numbers and email
            are unique.
          </div>
        </div>

        <div className="my-8">
          <div className="flex justify-center mb-2">
            <div className="text-lg font-bold">
              Download Spreadsheet Template
            </div>
          </div>

          <div className="flex justify-center items-center gap-5  mb-3">
            <a
              href="/images/AllContractorsWithData.xlsx"
              download="AllContractorsWithData.xlsx"
            >
              <button className="flex justify-center bg-primary font-semibold px-4 text-white p-2 rounded-md">
                Template With Existing Data
              </button>
            </a>

            <a
              href="/images/AllContractorsWithoutData.xlsx"
              download="AllContractorsWithoutData.xlsx"
            >
              <button className="flex justify-center bg-primary font-semibold px-4 text-white p-2 rounded-md w-60">
                Template Without Data
              </button>
            </a>
          </div>
        </div>

        <form>
          <label className="mb-3 block text-blue-900 text-md font-semibold leading-loose">
            Upload CSV File
          </label>
          <label
            htmlFor="dropzone-file"
            className="flex-1 w-full block h-24 border-2 border-primary bg-[#F4F6FB] border-dashed rounded-lg cursor-pointer p-2"
          >
            <div className="flex flex-col items-center justify-center pt-3 pb-6">
              <div className="text-center">
                <span className="text-blue-900 text-[15px] font-bold leading-loose">
                  Drop your CSV File here, or
                </span>
                <span className="text-primary text-[15px] font-bold leading-loose ml-2">
                  browse
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                CSV files are allowed
              </p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" />
          </label>
          <div className="flex gap-5 justify-end">
            <div className="w-32 mt-5 h-10 bg-gradient-to-r from-primary to-secondary rounded-md shadow justify-center items-center gap-2.5 flex">
              <button className="text-white text-md font-bold leading-loose">
                Import
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContractorImportForm;
