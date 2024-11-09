import { Icon } from "@iconify/react";
import React from "react";

const CustomFileInput = ({
  onChange,
  label = "",
  required = false,
  errorMessage = "",
  placeholder = "",
  multiple = false,
  height = "h-40",
  ...res
}) => {
  const setInput = (e) => {
    if (multiple) {
      let files = e.target.files;
      let imagesArr = [];
      for (let file of files) {
        imagesArr.push(file);
      }
      onChange(imagesArr);
    } else {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div>
      {label && (
        <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
          {label}{" "}
          {!required && (
            <span className="text-slate-300 text-md">(Optional)</span>
          )}
        </label>
      )}
      <label
        htmlFor="dropzone-file"
        className={`flex-1 w-full flex items-center justify-center  border-2 border-primary bg-[#F4F6FB] border-dashed rounded-lg cursor-pointer p-2 ${height}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Icon
            icon="line-md:cloud-upload-outline-loop"
            className="w-10 h-10 text-gray-400"
          />
          <div className="text-center">
            <span className="text-blue-900 text-[15px] font-bold">
              Drop your logo here, or
            </span>
            <span className="text-red-500 text-[15px] font-bold ml-2">
              browse
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG and GIF files are allowed
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={(e) => setInput(e)}
          multiple
        />
      </label>
    </div>
  );
};

export default CustomFileInput;
