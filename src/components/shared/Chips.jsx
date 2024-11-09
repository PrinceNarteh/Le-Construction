import React from "react";
import { Icon } from "@iconify/react";

const Chips = ({ label, onClick }) => {
  return (
    <div className="text-sm bg-orange-100 px-3 py-1 rounded-full flex items-center gap-2 w-fit">
      <span className="font-semibold">{label}</span>
      <Icon
        onClick={onClick}
        icon="ic:round-close"
        className="hover:scale-110 duration-200"
      />
    </div>
  );
};

export default Chips;
