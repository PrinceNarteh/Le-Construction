import React from "react";

const SelectField = ({
  label,
  register,
  name,
  errors,
  children,
  required = false,
  errorMessage = "",
  ...props
}) => {
  return (
    <div className="flex-1">
      <label className="text-blue-900 text-md font-semibold leading-loose mb-1 block">
        {label}
      </label>
      <select
        {...register(name, {
          ...(required && {
            required: {
              value: true,
              message: errorMessage,
            },
          }),
        })}
        {...props}
        className="bg-white w-full border border-slate-400 rounded-md shadow-md py-2.5 px-5 outline-none flex items-center justify-center gap-2"
      >
        {children}
      </select>
      {errors[name] && (
        <span className="text-red-500 text-[12px]">{errors[name].message}</span>
      )}
    </div>
  );
};

export default SelectField;
