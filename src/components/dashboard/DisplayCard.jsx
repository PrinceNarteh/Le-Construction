import React from "react";
import { Icon } from "@iconify/react";
import { useCompanySettingsSelector } from "../../hooks/useCompanySettings";

const displayCardsColors = [
  "bg-gradient-to-r from-blue-900 to-indigo-300",
  "bg-emerald-500",
  "bg-indigo-500",
  "bg-gradient-to-r from-cyan-600 to-cyan-400",
];

const DisplayCard = ({ card: { icon, iconColor, title, value }, idx }) => {
  const { companySettings } = useCompanySettingsSelector();

  return (
    <div className="max-w-sm p-[0.9rem] bg-white rounded-2xl justify-start items-center flex">
      <div className="self-stretch justify-start items-start gap-[18px] inline-flex">
        <div className="w-10 h-14 relative flex item-center">
          <div
            className={`w-12 h-12 left-0 top-0 absolute rounded-full flex items-center justify-center ${iconColor}`}
          >
            <Icon icon={icon} className="h-6 w-6 text-white" />
          </div>
          <div className="w-[30px] h-[30px] left-[13px] top-[13px] absolute" />
        </div>
        <div className="w-36 relative">
          <div className="w-[117px] h-[22.58px] left-0 top-0 absolute text-slate-400 text-sm font-semibold leading-normal">
            {title}
          </div>
          <div className="w-36 h-[31px] left-0 top-5 absolute text-slate-700 text-xl font-bold leading-loose">
            {["Total Revenue", "Out Payment"].includes(title) &&
              companySettings?.currency?.symbol}
            {value}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayCard;
