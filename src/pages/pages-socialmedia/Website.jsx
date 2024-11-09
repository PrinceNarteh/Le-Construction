import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Spinner from "../../components/Spinner";
import FooterForm from "../../components/forms/website/FooterForm";
import HeaderForm from "../../components/forms/website/HeaderForm";
import ContentTab from "../../components/shared/ContentTab";
import { queryKeys } from "../../constants";
import { useGetQuery } from "../../hooks/useGetQuery";
import { useUserSelector } from "../../hooks/useUserSelector";
import AboutUs from "../website/AboutUs";
import AppDownload from "../website/AppDownload";
import Contact from "../website/Contact";
import FAQ from "../website/FAQ";
import FunFacts from "../website/FunFacts";
import Partners from "../website/Partners";
import Services from "../website/Services";
import SocialMediaLinks from "../website/SocialMediaLinks";
import Team from "../website/Team";
import Testimonials from "../website/Testimonials";
import Projects from "../website/Projects";
import { setWebsite } from "../../app/feature/company/websiteSlice";

const tabs = [
  "Header",
  "About Us",
  "Team",
  "Links",
  "Projects",
  "Partners & Services",
  "Fun Facts",
  "Testimonials",
  "FAQ",
  "Contacts & Footer",
];

function Website() {
  const { user } = useUserSelector();
  const [active, setActive] = useState("Header");

  const dispatch = useDispatch();
  const { data, isLoading } = useGetQuery({
    queryKey: [queryKeys.Website],
    url: "/website",
    options: {
      headers: {
        companyid: user.company._id,
      },
    },
  });

  //console.log("data:::", data);

  useEffect(() => {
    if (data?.message) {
      dispatch(setWebsite(data.message));
    }
  }, [data?.message, dispatch]);

  // if (isLoading) return <Spinner isSubmitting={isLoading} />;

  // className={`p-2 w-full font-semibold rounded-md flex justify-center items-center focus:ring-2 focus:ring-gray-400 active focus:outline-none cursor-pointer duration-500 ${
  //   tab === active ? "bg-primary text-white" : "text-[#79808F]"
  // }`}
  return (
    <div className="">
      <div className="grid grid-auto-fit-xs my-10 px-10 gap-5 divide-x-2">
        {/* relative text-xl w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center */}
        {tabs.map((tab, index) => (
          <li
            className={`text-center font-semibold  min-w-fit relative block after:block after:content-[''] after:absolute after:h-[3px] after:bg-primary after:w-full after:${
              tab === active
                ? "scale-x-100 text-gray-700"
                : "scale-x-0 text-gray-400"
            } after:hover:scale-x-100 after:transition after:duration-300 after:origin-center cursor-pointer`}
            key={index}
            onClick={() => setActive(tab)}
          >
            {tab}
          </li>
        ))}
      </div>
      <div>
        {isLoading && (
          <Spinner isSubmitting={isLoading} /> // Display the spinner
        )}

        <ContentTab id={"Projects"} active={active}>
          <Projects />
        </ContentTab>

        <ContentTab id={"Header"} active={active}>
          <HeaderForm />
        </ContentTab>

        <ContentTab id={"About Us"} active={active}>
          <AboutUs />
        </ContentTab>

        <ContentTab id={"Contacts & Footer"} active={active}>
          <div className="pl-7 pr-7">
            <Contact />
            <FooterForm />
          </div>
        </ContentTab>

        <ContentTab id={"Partners & Services"} active={active}>
          <div className="pl-7  pr-7">
            <Partners />
            <Services />
          </div>
        </ContentTab>

        <ContentTab id={"Testimonials"} active={active}>
          <Testimonials />
        </ContentTab>

        <ContentTab id={"Links"} active={active}>
          <div className="pl-7 pr-7">
            <SocialMediaLinks />
            <AppDownload />
          </div>
        </ContentTab>

        <ContentTab id={"Team"} active={active}>
          <Team />
        </ContentTab>

        <ContentTab id={"Fun Facts"} active={active}>
          <FunFacts />
        </ContentTab>

        <ContentTab id={"FAQ"} active={active}>
          <FAQ />
        </ContentTab>
      </div>
    </div>
  );
}

export default Website;
