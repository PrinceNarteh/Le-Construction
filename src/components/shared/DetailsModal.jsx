import React from "react";
import { CgCloseO } from "react-icons/cg";

const DetailsModal = ({
  heading,
  openDetails,
  closeDetails,
  children,
  start = false,
}) => {
  return (
    <div
      className={`flex ${
        start ? "items-start" : "items-center"
      } fixed top-0 right-0 bottom-0 left-60 min-h-screen  p-5 overflow-y-auto  bg-black/80 z-50 transform ${
        openDetails ? "scale-100 opacity-100" : "scale-0 opacity-0"
      } duration-500`}
    >
      <div className="w-full px-10">
        <div className="h-28 flex pl-10 items-center bg-primary bg-[url('/public/images/wave.png')] rounded-xl relative">
          <button
            onClick={() => closeDetails()}
            className="absolute -right-4 -top-4 text-white cursor-pointer"
          >
            <CgCloseO size={36} />
          </button>
          <h3 className="text-white text-2xl font-bold">{heading}</h3>
        </div>
        <div className="mt-5 max-w-full">{children}</div>
      </div>
    </div>
  );
};

export default DetailsModal;
