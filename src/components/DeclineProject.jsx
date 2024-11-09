import React from 'react'
import { IoClose } from "react-icons/io5";


function DeclineProject({closeModal}) {
  return (
    <div className="modalBackground fixed flex justify-center inset-0 h-[100%] bg-neutral-900 bg-opacity-60 w-[100vw] cursor-pointer">
      <div className="bg-white h-[33vh] w-[35%] mt-72 rounded-2xl">
        <div className="flex justify-end">
          <div className="flex mt-5 mr-5">
            <IoClose
              size={30}
              className="cursor-pointer flex justify-end"
              onClick={() => {
                closeModal(false);
              }}
            />
          </div>
        </div>
        <form>
          <div className=" w-[100%] p-5">
            <label className="font-semibold font-ray text-[#E06D41]">
              Decline Project
            </label>
           
            <textarea
              type="text"
              placeholder="Reason For Decline"
              className="mt-3 placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-400 rounded-md py-3 pl-9 pr-3 shadow-md focus:outline-none  focus:border-orange-700 focus:ring-orange-700 focus:ring-1 sm:text-sm h-20"
            />
          </div>

          <div className="">
            <button
              type="submit"
              className="ml-4 text-white text-sm w-32 rounded-full h-10 bg-red-700 hover:scale-105 duration-200 "
            >
              SEND
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeclineProject