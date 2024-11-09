import { Icon } from "@iconify/react";
import React, { useState } from "react";
import Heading from "../../components/layout/Heading";

const images = [
  "/images/builder11.jpg",
  "/images/building.jpg",
  "/images/builder2.jpg",
  "/images/alien1.jpg",
];

function IncomingProjectDetails() {
  const [sliderData, setSliderData] = useState(images[0]);

  const handleClick = (index) => {
    const slider = images[index];
    setSliderData(slider);
  };

  return (
    <div className="">
      <div className="ml-9">
        <Heading label="Incoming Project Details" />
      </div>

      <div className="pl-10 pr-10">
        <div className="grid grid-cols-2 gap-5 mt-5 ">
          <div className="w-full max-h-[47rem] bg-white rounded-xl p-6 space-y-3 col-span-1">
            <div className="flex justify-between items-center w-full">
              <div className=" text-blue-900 text-[20px] font-bold leading-10">
                School Building
              </div>
              <div className="flex items-center">
                <Icon
                  icon="solar:calendar-date-outline"
                  className="h-4 w-4 text-slate-400 mr-1"
                />
                <div className="text-blue-900 text-[16.19999885559082px] font-semibold">
                  Date:10/11/2023
                </div>
              </div>
            </div>

            <div>
              <img
                src={sliderData}
                alt=""
                className="rounded-xl h-64 w-full object-cover"
              />
            </div>

            <div className="flex mt-10">
              <div className="grid grid-cols-4 space-x-2">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className=" ml-[6px] mr-1 flex justify-center rounded-xl mt-4"
                  >
                    <img
                      className={`${
                        sliderData === i ? "opacity-20" : ""
                      } h-20 w-full rounded-lg object-cover`}
                      src={img}
                      alt=""
                      onClick={() => handleClick(i)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="w-[684px] text-blue-900 text-[20px] font-bold leading-9">
                Description
              </div>
            </div>

            <div>
              <div className="w-full text-slate-500 text-[14px] font-normal leading-7 tracking-wide">
                Lorem ipsum dolor sit amet consectetur. Ut integer egestas risus
                dui. Diam ipsum tristique tortor vitae pellentesque arcu nisl
                ut. Ut in cursus fermentum arcu ornare at. Morbi eros lorem nisl
                odio duis quis quam arcu mauris. Gravida pellentesque arcu
                scelerisque massa morbi arcu. Morbi eros lorem nisl odio duis
                quis quam arcu mauris. Gravida pellentesque arcu scelerisque
                massa morbi arcu.
              </div>
            </div>

            <div className="flex justify-between items-center mt-12 ">
              <div className="px-10 py-3 bg-emerald-500 rounded-lg justify-center items-center">
                <div className="w-28 text-center text-white text-[16px] font-bold leading-normal">
                  Accept project
                </div>
              </div>
              <div className="px-10 py-3 border border-blue-600 rounded-lg justify-center items-center">
                <div className="w-28 text-center text-blue-600 text-[16px] font-bold leading-normal">
                  Set for biding
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-h-[22rem] bg-white rounded-xl p-6 space-y-3 col col-span-1">
            <div className="w-[545px] text-blue-900 text-[20px] font-bold leading-9">
              Client Information
            </div>

            <div>
              <div className="flex items-center">
                <div className="text-slate-500 text-md font-semibold leading-loose mr-2">
                  Name:
                </div>

                <div className="text-blue-600 text-md font-bold leading-9">
                  Moses Ibrahim
                </div>
              </div>

              <div className="flex items-center">
                <div className="text-slate-500 text-md font-semibold leading-loose mr-2">
                  Email:
                </div>

                <div className="text-slate-500 text-md font-bold leading-9">
                  mosesibrahim@gmail.com{" "}
                </div>
              </div>

              <div className="flex items-center">
                <div className="text-slate-500 text-md font-semibold leading-loose mr-2">
                  Amount:
                </div>

                <div className="text-blue-600 text-md font-bold leading-9">
                  $20,000
                </div>
              </div>

              <div className="flex items-center">
                <div className="text-slate-500 text-md font-semibold leading-loose mr-2">
                  Phone:
                </div>

                <div className="text-slate-500 text-md font-bold leading-9">
                  +1 (203) 7845-344{" "}
                </div>
              </div>

              <div className="flex items-center">
                <Icon icon="codicon:location" className="mr-2" />
                <div className="w-[513px] text-blue-900 text-md font-semibold leading-9">
                  USA, Gorge Bush Road 213.5.4881208-0.4219455
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <div className="w-52 px-10 py-3 border border-red-600 rounded-lg ">
                <div className=" text-center text-red-600 font-bold leading-normal">
                  Decline project
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomingProjectDetails;
