import React from "react";

const ErrorMessage = ({ errors, name }) => {
  return (
    <>
      {errors[name] && (
        <span className="text-red-500 text-[12px]">{errors[name].message}</span>
      )}
    </>
  );
};

export default ErrorMessage;
