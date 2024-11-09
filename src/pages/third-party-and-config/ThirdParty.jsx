import React, { useState } from "react";
import Heading from "../../components/layout/Heading";
import ContentTab from "../../components/shared/ContentTab";
import MailConfig from "../../components/third-party/EmailConfig";
import MapAPI from "../../components/third-party/MapApi";
import PaymentGateway from "../../components/third-party/PaymentGateway";
import PushConfig from "../../components/third-party/PushConfig";
import SMS from "../../components/third-party/SMS";

function ThirdParty() {
  const [active, setActive] = useState("Add Payment Method");
  const tabs = [
    "Add Payment Method",
    "SMS Module",
    "Mail Config",
    // "Map APIs",
    // "Push Config",
  ];

  return (
    <div className="">
      <div>
        <div className="px-16">
          <div className="ml-4">
            <Heading label="Third Party API's" />
          </div>

          <ul className="hidden text-sm font-bold text-center text-gray-500 divide-x sm:flex p-5">
            {tabs.map((tab, index) => (
              <li
                key={index}
                className={`p-2 w-full font-semibold rounded-md flex justify-center items-center focus:ring-2 focus:ring-gray-400 active focus:outline-none cursor-pointer duration-500 ${
                  tab === active ? "bg-primary text-white" : "text-[#79808F]"
                }`}
                onClick={() => setActive(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ContentTab id={"Add Payment Method"} active={active}>
            <PaymentGateway />
          </ContentTab>

          <ContentTab id={"Mail Config"} active={active}>
            <MailConfig />
          </ContentTab>

          <ContentTab id={"Map APIs"} active={active}>
            <MapAPI />
          </ContentTab>

          <ContentTab id={"SMS Module"} active={active}>
            <SMS />
          </ContentTab>

          <ContentTab id={"Push Config"} active={active}>
            <PushConfig />
          </ContentTab>
        </div>
      </div>
    </div>
  );
}

export default ThirdParty;
