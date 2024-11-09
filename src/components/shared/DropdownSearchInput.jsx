import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const DropdownSearchInput = ({ open, close, icon, label, link }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef(null);

  const options = [
    "Option 1",
    "Option 1",
    "Option 1",
    "Option 2",
    "Option 2",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5",
  ];

  const toggleDropdown = (event) => {
    close(!open);
  };

  const selectOption = (option) => {
    setSelectedOption(option);
    close(false);
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase() === ""
      ? option
      : option.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="relative cursor-pointer" ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className="bg-white px-4 py-3 rounded-md w-full"
      >
        <div className="flex justify-between items-center">
          {selectedOption ? (
            <div className="font-semibold text-sm">{selectedOption}</div>
          ) : (
            <div className="sm:text-sm text-slate-400">Choose...</div>
          )}
          <Icon icon="gridicons:dropdown" />
        </div>
      </div>
      {open && (
        <div className="absolute w-full mt-2 bg-white border rounded-lg border-gray-300 shadow-md">
          <div className="flex items-center border rounded-lg shadow-xl px-3">
            <input
              type="text"
              className="block w-full px-4 py-2 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Icon icon="circum:search" className="h-5 w-5" />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2 text-sm font-semibold font-ray text-primary">
                Match not found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectOption(option)}
                  className="block w-full px-4 py-2 font-semibold text-sm text-left hover:bg-gray-100"
                >
                  {option}
                </button>
              ))
            )}
          </div>

          <div>
            {link ? (
              <Link to={link} className="border-t p-2 flex items-center pl-6">
                <Icon icon={icon} className="h-6 w-6 text-primary" />
                <div className="text-sm text-primary ml-1 font-semibold underline">
                  {label}
                </div>
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownSearchInput;
