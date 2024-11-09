import React, { useState } from "react";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";

const ExtraImages = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const next = () => {
    if (current + 1 > images.length - 1) {
      setCurrent(0);
    } else {
      setCurrent((prevState) => prevState + 1);
    }
  };

  const prev = () => {
    if (current - 1 < 0) {
      setCurrent(images.length - 1);
    } else {
      setCurrent((prevState) => prevState - 1);
    }
  };

  return (
    <div>
      <div className="overflow-x-scroll">
        <div className="flex">
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => {
                setCurrent(i);
                setOpenModal(true);
              }}
              className="shrink-0 ml-[6px] w-32 mr-1 flex justify-center rounded-xl mt-4 cursor-pointer"
            >
              <img
                className={`h-20 w-full rounded-lg object-cover`}
                src={img}
                alt=""
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 bottom-0 left-60 min-h-screen  p-5 overflow-y-auto  bg-black/80 z-50 transform ${
          openModal ? "scale-100 opacity-100" : "scale-0 opacity-0"
        } duration-500`}
      >
        <div className={`relative rounded-xl w-full mx-auto h-full`}>
          <button
            onClick={() => {
              setCurrent(0);
              setOpenModal(false);
            }}
            className="absolute right-2 top-0 z-50 text-primary w-10 h-10 cursor-pointer"
          >
            <IoIosCloseCircleOutline size={35} />
            {/* <Icon icon="line-md:close-circle-twotone" className="text-4xl" /> */}
          </button>
          <div id="default-carousel" className="relative w-full h-[85%]">
            <div className="overflow-hidden rounded-lg">
              {/* images */}
              {images.map((image, idx) => (
                <div
                  key={idx}
                  className={`${
                    current === idx ? "opacity-100" : "opacity-0"
                  } duration-700 ease-in-out`}
                  data-carousel-item
                >
                  <img
                    src={image}
                    className="aspect-auto absolute block h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                    alt="..."
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => prev()}
              type="button"
              className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white">
                <FaChevronCircleLeft size={35} />
                <span className="sr-only">Previous</span>
              </span>
            </button>
            <button
              onClick={() => next()}
              type="button"
              className="absolute top-0 right-0 z-10 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white">
                <FaChevronCircleRight size={35} />
                <span className="sr-only">Previous</span>
              </span>
            </button>
          </div>
          {/* thumbnail */}
          <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-0 left-1/2">
            {Array(images.length)
              .fill(null)
              .map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer ${
                    current === idx ? "ring-4 ring-primary p-1" : ""
                  }`}
                >
                  <img
                    src={images[idx]}
                    alt=""
                    className={`w-20 h-20 object-cover rounded-md`}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtraImages;
