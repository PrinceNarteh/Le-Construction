import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { RiArrowDropDownFill } from "react-icons/ri";

function ImageNav() {
  const [open, setOpen] = useState(false);

     const navigate = useNavigate();


  const menuRef = useRef();
  const imgRef = useRef();

  window.addEventListener("click", (e) => {
    if (e.target !== menuRef.current && e.target !== imgRef.current) {
      setOpen(false);
    }
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <div>
        <img
          className="w-8 h-8 ml-3 rounded-full mt-2 object-cover cursor-pointer"
          src="images/builder.jpg"
          ref={imgRef}
          onClick={() => setOpen(!open)}
        />
      </div>

      {open && (
        <div
          ref={menuRef}
          className="bg-white shadow-xl absolute w-60 right-4 h-40 mt-2 rounded-xl ease-in-out duration-150 "
        >
          <ul className="text-lg space-y-4 font-ray font-sm mt-4">
            <Link to="/">
              <div className="flex items-center">
                <AiOutlineUser size={25} className="ml-4 text-neutral-900" />
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
              <IoLogOutOutline size={20} className="ml-5 text-neutral-900" />
              <li className="cursor-pointer ml-3">Logout</li>
            </div>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ImageNav;
