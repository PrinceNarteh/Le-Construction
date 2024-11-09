import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import useMutate from "../../../hooks/useMutate";
import { queryKeys } from "../../../constants";
import { useUserSelector } from "../../../hooks/useUserSelector";
import { toast } from "react-hot-toast";

function BuilderImportForm({ closeModal = null }) {
  const { user } = useUserSelector();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const queryClient = useQueryClient();
  const { mutate } = useMutate([queryKeys.CreateBuilder]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file_upload", file);
    formData.append("company_id", user.company_id);

    const toastId = toast.loading(
      `Importing sub-contractors...`
    );
    mutate(
      {
        url: `/builder/bulk/add/builders`,
        data: formData,
        method: "POST",
        multipart: true,
      },
      {
        async onSuccess(data) {
          await queryClient.invalidateQueries([queryKeys.Builders]); // Invalidate queries here
          toast.success("Accounts created successfully");
          toast.dismiss(toastId);
          closeModal();
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="py-6 px-3 cursor-pointer">
      <div>
        <div className="">
          <h3 className="font-bold text-blue-900 text-2xl ">
            Bulk Import Sub-Contractors
          </h3>
        </div>

        <div className="mb-4 mt-5 space-y-3">
          <div className="text-lg font-semibold">Instructions :</div>
          <div className="text-sm font-normal text-slate-400">
            1. Download the format file and fill it with proper data.
          </div>
          <div className="text-sm font-normal text-slate-400">
            2. You can download the example file to understand how the data must be filled.
          </div>
          <div className="text-sm font-normal text-slate-400">
            3. Once you have downloaded and filled the format file, upload it in the form below and submit. Make sure the phone numbers and email are unique.
          </div>
        </div>

        <div className="my-8">
          <div className="flex justify-center mb-2">
            <div className="text-lg font-bold">
              Download Spreadsheet Template
            </div>
          </div>

          <div className="flex justify-center items-center gap-5 mb-3">
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

        <form onSubmit={handleSubmit}>
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
                <span className="text-red-500 text-[15px] font-bold leading-loose ml-2">
                  browse
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                CSV files are allowed
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <div className="flex gap-5 justify-end">
            <div className="w-32 mt-5 h-10 bg-gradient-to-r from-primary to-secondary rounded-md shadow justify-center items-center gap-2.5 flex">
              <button
                type="submit"
                className="text-white text-md font-bold leading-loose"
                disabled={isLoading}
              >
                {isLoading ? "Importing..." : "Import"}
              </button>
            </div>
          </div>
        </form>
        {message && (
          <div className="mt-4 text-center text-lg font-semibold text-red-500">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default BuilderImportForm;
