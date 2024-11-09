import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { useCompanySettingsSelector } from "../../hooks/useCompanySettings";

const ProjectDetails = ({ project }) => {
  const images = useState(project?.project_images || [])[0];
  const { companySettings } = useCompanySettingsSelector();
  const [active, setActive] = useState(0);

  const next = () => {
    if (active + 1 > images.length - 1) {
      setActive(0);
    } else {
      setActive(active + 1);
    }
  };

  const prev = () => {
    if (active - 1 < 0) {
      setActive(images.length - 1);
    } else {
      setActive(active - 1);
    }
  };

  return (
    <div>
      <div className="relative group">
        <img src={[images[active]]} alt="" className="w-full h-80 rounded-md" />
        <div className="absolute top-[50%] w-full flex justify-between">
          <button
            onClick={prev}
            className="bg-slate-800 rounded-full text-white w-7 h-7 flex justify-center items-center opacity-50 group-hover:opacity-100 duration-300"
          >
            <Icon icon="ic:outline-keyboard-arrow-left" fontSize={20} />
          </button>
          <button
            onClick={next}
            className="bg-slate-800 rounded-full text-white w-7 h-7 flex justify-center items-center opacity-50 group-hover:opacity-100 duration-300"
          >
            <Icon icon="ic:outline-keyboard-arrow-right" fontSize={20} />
          </button>
        </div>
      </div>
      <div className="pt-5 px-3">
        <Item label="Title" value={project?.title} />
        <Item
          label="Description"
          value={
            Array.isArray(project?.description)
              ? project?.description.join(" ")
              : project?.description
          }
        />
        <Item label="Location" value={project?.info.location} />
        <div className="flex flex-col md:flex-row py-1">
          <div className="flex-[2] text-blue-900 text-[15px] font-bold leading-snug capitalize">
            Area ( m<span className="align-super">2</span> )
          </div>
          <div className="flex-[4] text-[15px]">{project?.info.area}</div>
        </div>
        <Item label="Year" value={project?.info.year} />
        <Item
          label="Budget"
          value={`${companySettings?.currency.symbol}${project?.info.budget}`}
        />
        <Item label="Category" value={project?.info.category} />
        <Item label="Architect" value={project?.info.architect} />
        <Item label="Client" value={project?.info.client} />
        <Item label="Date" value={project?.date} />
      </div>
    </div>
  );
};

const Item = ({ label, value }) => (
  <div className="flex flex-col md:flex-row py-1">
    <div className="flex-[2] text-blue-900 text-[15px] font-bold leading-snug capitalize">
      {label}
    </div>
    <div className="flex-[4] text-[15px]">{value}</div>
  </div>
);

export default ProjectDetails;
