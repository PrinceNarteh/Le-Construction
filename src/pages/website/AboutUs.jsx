import { Icon } from "@iconify/react";
import React, { useState } from "react";
import AboutUsForm from "../../components/forms/website/AboutUsForm";
import Modal from "../../components/shared/Modal";
import { useCompanySelector } from "../../hooks/useCompanySelector";
import Experiences from "./Experiences";
import Features from "./Features";
import { useWebsiteSelector } from "../../hooks/useWebsiteSelector";

const AboutUs = () => {
  const { company } = useCompanySelector();
  const [openAboutForm, setOpenAboutForm] = useState(false);
  const { website } = useWebsiteSelector();

  return (
    <div className="pl-7 pr-7">
      <div className="">
        {/* ABOUT US */}
        <div className=" mx-auto ">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-semibold text-blue-900 text-3xl">About Us</h3>
            <button
              onClick={() => setOpenAboutForm(true)}
              className="bg-primary flex justify-center items-center text-white w-44 py-3 px-10 rounded-md text-xs font-bold"
            >
              <Icon icon="iconamoon:edit-light" className="mr-2" />
              <h3>Edit</h3>
            </button>
          </div>
          <div className="bg-white rounded-lg p-10">
            <div>
              <div className="flex py-3">
                <div className="flex-1 text-blue-900 text-[15px] font-bold leading-snug capitalize">
                  Title
                </div>
                <div className="flex-[3]">{website?.about_us_title}</div>
              </div>
              <div className="flex py-3">
                <div className="flex-1 text-blue-900 text-[15px] font-bold leading-snug capitalize">
                  Description
                </div>
                <div className="flex-[3]">{website?.about_us_description}</div>
              </div>
              <div className="flex py-3">
                <div className="flex-1 text-blue-900 text-[15px] font-bold leading-snug capitalize">
                  Image
                </div>
                <div className="flex-[3]">
                  <img
                    src={website?.about_us_video}
                    alt=""
                    className="w-20 h-20 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
          <Modal openModal={openAboutForm} closeModal={setOpenAboutForm}>
            <AboutUsForm setOpenAboutForm={setOpenAboutForm} />
          </Modal>
        </div>

        {/* FEATURES  */}
        <Features />

        {/* EXPERIENCE  */}
        <Experiences />
      </div>
    </div>
  );
};

export default AboutUs;
