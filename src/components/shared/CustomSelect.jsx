import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { Link } from "react-router-dom";

const CustomSelect = ({
  data = [],
  placeholder = "",
  label = "",
  onChange,
  loading = false,
  link = null,
  actionButton = null,
  initialValue = null,
  reset = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState({
    id: "",
    label: "",
  });
  const [open, setOpen] = useState(false);
  const optionsRef = useRef();
  const inputRef = useRef(null);
  const [run, setRun] = useState(true);

  useEffect(() => {
    if (reset) {
      setSelected({
        id: "",
        label: "",
      });
    }
  }, [reset]);

  useEffect(() => {
    let handler = (e) => {
      if (!optionsRef?.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousemove", handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      inputRef.current.focus();
    } else {
      inputRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (initialValue && data.length > 0 && run) {
      const item = data.find(
        (item) => item.id === initialValue || item.label === initialValue
      );

      if (item) {
        setSelected(item);
      }
      setRun(false);
    }
  }, [data, initialValue, run]);

  return (
    <div
      ref={optionsRef}
      className="relative w-full font-medium cursor-pointer"
    >
      {label && (
        <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
          {label}{" "}
        </label>
      )}
      <div
        onClick={() => setOpen(!open)}
        className={`bg-white w-full p-2.5 flex items-center justify-between
        border border-slate-400 shadow-md rounded-md pl-5
        ${!selected.id ? "text-gray-400" : "text-gray-700"}`}
      >
        <div className="line-clamp-1">
          {selected.id ? selected.label : placeholder}
        </div>
        <BiChevronDown
          size={20}
          className={`duration-300 ${open && "rotate-180"}`}
        />
      </div>
      {open ? (
        <ul
          className={`absolute w-full z-10 bg-white mt-2 overflow-y-auto border border-slate-400 shadow-md rounded-md px-2 pt-2 max-h-60 ${
            actionButton ? "pb-0" : "pb-2"
          }`}
        >
          <div className="flex items-center px-2 sticky top-0 mb-2 bg-white border border-slate-400 shadow-md rounded-md">
            <AiOutlineSearch size={18} className="text-gray-700" />
            <input
              type="text"
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`${placeholder}`}
              className="placeholder:text-gray-700 p-2 outline-none w-full"
            />
          </div>
          {data?.map((item, index) => (
            <li
              key={index}
              className={`p-2 z-50 text-sm hover:bg-sky-600 hover:text-white rounded
            ${
              item?.id?.toLowerCase() === selected?.id &&
              "bg-sky-600 text-white"
            }
            ${
              item?.label?.toLowerCase().includes(inputValue)
                ? "block"
                : "hidden"
            }`}
              onClick={() => {
                if (
                  item?.label?.toLowerCase() !== selected.label.toLowerCase()
                ) {
                  onChange(item.id);
                  setSelected(item);
                  setOpen(false);
                  setInputValue("");
                } else {
                  setOpen(false);
                }
              }}
            >
              {item?.label}
            </li>
          ))}
          {loading ? (
            <li className="p-2 text-sm hover:bg-sky-600 hover:text-white rounded flex items-end">
              <span>Loading</span>
              <Icon icon="eos-icons:three-dots-loading" className="text-base" />
            </li>
          ) : null}
          {actionButton ? (
            <button
              type="button"
              onClick={() => actionButton()}
              className="w-full bg-white sticky bottom-0 border-t p-2 flex justify-center items-center pl-6"
            >
              <Icon
                icon="ant-design:plus-circle-outlined"
                className="h-4 w-4 text-primary"
              />
              <span className="text-sm text-primary ml-1 font-semibold">
                Add {label}
              </span>
            </button>
          ) : link ? (
            <Link
              to={link}
              className="w-full bg-white sticky bottom-0 border-t p-2 flex justify-center items-center pl-6"
            >
              <Icon
                icon="ant-design:plus-circle-outlined"
                className="h-4 w-4 text-primary"
              />
              <span className="text-sm text-primary ml-1 font-semibold">
                Add {label}
              </span>
            </Link>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
};

export default CustomSelect;
