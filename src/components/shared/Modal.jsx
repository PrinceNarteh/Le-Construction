import { Icon } from "@iconify/react";
import React, { useEffect, useRef } from "react";

const Modal = ({
  openModal,
  closeModal,
  children,
  width = "max-w-xl",
  className = "",
  fullWidth = false,
  start = false,
  disableClickedOutside = false,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!disableClickedOutside) {
      let handler = (e) => {
        if (!modalRef?.current?.contains(e.target)) {
          closeModal(false);
        }
      };

      document.addEventListener("mousedown", handler);

      return () => document.removeEventListener("mousemove", handler);
    }
  }, [openModal, closeModal, disableClickedOutside]);

  return (
    <>
      {openModal ? (
        <div
          className={`min-h-screen fixed top-0 right-0 bottom-0 ${
            fullWidth ? "left-0" : "left-60"
          } h-screen grid grid-cols-1 ${
            start ? "place-content-start" : "place-content-center"
          } p-10 overflow-y-auto  bg-neutral-700/30 z-50 ${className}`}
        >
          <div
            ref={modalRef}
            className={`relative p-5 bg-white rounded-xl w-full mx-auto ${width}`}
          >
            <Icon
              onClick={() => closeModal(false)}
              icon="line-md:close-circle-twotone"
              className="absolute -right-4 -top-4 text-4xl text-primary cursor-pointer"
            />
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
