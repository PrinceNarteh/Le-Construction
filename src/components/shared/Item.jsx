import React from "react";

const Item = ({ label, value }) => (
  <div className="flex flex-col md:flex-row py-3">
    <div className="flex-1 text-blue-900 text-[15px] font-bold leading-snug capitalize">
      {label}
    </div>
    <div className="flex-[3]">{value}</div>
  </div>
);

export default Item;
