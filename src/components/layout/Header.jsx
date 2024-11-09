import { Icon } from "@iconify/react";
import React, { useRef, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearCompany } from "../../app/feature/company/companySlice";
import { clearUser } from "../../app/feature/user/userSlice";
import { useUserSelector } from "../../hooks/useUserSelector";
import { clearCompanySettings } from "../../app/feature/companySettings/companySettingsSlice";
import { clearWebsite } from "../../app/feature/company/websiteSlice";

const Header = () => {
  const { user } = useUserSelector();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuRef = useRef();
  const imgRef = useRef();

  window.addEventListener("click", (e) => {
    if (e.target !== menuRef.current && e.target !== imgRef.current) {
      setOpen(false);
    }
  });

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearCompany());
    dispatch(clearWebsite());
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="z-30 fixed flex bg-[#f4f3f5] h-16  justify-end items-center w-full cursor-pointer">
      <div className="flex items-center justify-end rounded-xl text-slate-700 text-[24px] font-bold leading-loose item-center pr-5">
        <div className="flex bg-white h-12 rounded-xl text-slate-700 text-[24px] font-bold leading-loose item-center">
          {/* <div className="h-8 w-72 bg-[#F4F6FB] flex mt-2 ml-2 rounded-lg">
            <Icon icon="circum:search" className="mt-[0.4rem] h-5 w-5 ml-3" />

            <input
              type="text"
              name="name"
              placeholder="Search "
              className="bg-[#F4F6FB] w-40 outline-none p-2 placeholder:text-gray-700 text-sm placeholder:font-normal placeholder:mb-3"
            />
          </div> */}

          <div className="flex items-center">
            <Link to="/notification">
              <Icon
                icon="ic:outline-notifications"
                className=" ml-2 h-7 w-7 "
              />
            </Link>
            <a href="https://www.nailed.biz/" target="_blank">
              <Icon icon="ep:warning" rotate={2} className=" ml-2 h-7 w-7" />
            </a>
          </div>

          <img
            className="w-8 h-8 mr-2 ml-2 mt-2 rounded-full object-cover cursor-pointer"
            src={
              user.user_type === "company"
                ? user.brand.company_logo
                : user.company.brand.company_logo
            }
            ref={imgRef}
            onClick={() => setOpen(!open)}
            alt=""
          />

          {open && (
            <div
              ref={menuRef}
              className="z-10 bg-white shadow-xl absolute h-40 w-60 right-4 top-20 rounded-xl ease-in-out duration-150"
            >
              <ul className="text-lg space-y-4 font-ray font-sm mt-4">
                <Link to="/main-profile">
                  <div className="flex items-center">
                    <AiOutlineUser
                      size={25}
                      className="ml-4 text-neutral-900"
                    />
                    <li className="cursor-pointer ml-3">View profile</li>
                  </div>
                </Link>

                <Link to="/settings">
                  <div className="flex items-center mt-5">
                    <IoSettingsOutline
                      size={20}
                      className="ml-5 text-neutral-900"
                    />
                    <li className="cursor-pointer ml-3">Settings</li>
                  </div>
                </Link>

                <div className="flex items-center mt-5" onClick={handleLogout}>
                  <IoLogOutOutline
                    size={20}
                    className="ml-5 text-neutral-900"
                  />
                  <li className="cursor-pointer ml-3">Logout</li>
                </div>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
