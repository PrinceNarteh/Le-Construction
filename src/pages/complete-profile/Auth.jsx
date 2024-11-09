import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";

function Auth() {
  return (
    <div className="bg-gray-50 cursor-pointer">
      <div className="grid grid-cols-2 gap-4">
        <div className=" h-screen p-16">
          <div className="mt-28">
            <Link to="/profile">
              <div className="flex justify-end items-center mb-10">
                <BsArrowRight size={25} />
              </div>
            </Link>

            <div className="mb-10">
              <div className="w-full text-slate-700 text-3xl font-bold tracking-wide">
                Login with us and explore more
              </div>

              <div className="w-full text-slate-500 text-sm font-normal mt-2">
                That will help us better setup account for you
              </div>
            </div>

            <form>
              <div>
                <h3 className=" text-slate-700 text-[20px] font-normal leading-loose">
                  Email
                </h3>
                <input
                  type="text"
                  placeholder="Enter email"
                  className="h-12 border outline-none p-4 bg-transparent w-[100%] placeholder:text-[#ABB3C5] placeholder:font-normal rounded-md"
                />
              </div>

              <div className="mt-5">
                <h3 className=" text-slate-700 text-lg font-normal leading-loose">
                  Password
                </h3>
                <input
                  type="text"
                  placeholder="Create a password"
                  className="h-12 border outline-none p-4 bg-transparent w-[100%] placeholder:text-[#ABB3C5] rounded-md"
                />
              </div>


              <button className="w-full h-full px-2 py-2 bg-gradient-to-r from-red-500 to-orange-300 rounded-lg shadow justify-center items-center gap-2.5 inline-flex mt-10">
                <div className="text-white text-lg font-bold leading-loose">
                  Continue
                </div>
              </button>
            </form>
          </div>
        </div>

        <div className="p-5 mr-5 flex justify-center items-center">
          <img
            src="/images/cons.jpeg"
            alt=""
            className="h-[40rem] object-cover rounded-xl "
          />
        </div>
      </div>
    </div>
  );
}

export default Auth;
