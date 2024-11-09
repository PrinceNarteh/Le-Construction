import React from "react";

function TextArea({
  name,
  register,
  errors,
  label = "",
  rows = 4,
  cols = 50,
  required = false,
  errorMessage = "",
  placeholder = "",
  ...res
}) {
  return (
    <div className="flex-1">
      {label && (
        <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
          {label}{" "}
          {!required && (
            <span className="text-slate-300 text-md">(Optional)</span>
          )}
        </label>
      )}
      <textarea
        rows={rows}
        cols={cols}
        placeholder={placeholder}
        className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-400 shadow-md rounded-md py-3 pl-9 pr-3 sm:text-sm "
        {...register(name, {
          ...(required && {
            required: {
              value: true,
              message: errorMessage,
            },
          }),
        })}
        {...res}
      ></textarea>
      {errors[name] && (
        <span className="text-red-500 text-[12px]">{errors[name].message}</span>
      )}
    </div>
  );
}

export default TextArea;
