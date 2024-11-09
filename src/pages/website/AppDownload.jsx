import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppLinkForm from "../../components/forms/website/AppLinkForm";
import Modal from "../../components/shared/Modal";
import { useCompanySelector } from "../../hooks/useCompanySelector";
import { useWebsiteSelector } from "../../hooks/useWebsiteSelector";

function AppDownload() {
  const { company } = useCompanySelector();
  const { website } = useWebsiteSelector();
  const [openAppModal, setOpenAppModal] = useState(false);

  //console.log('company:::', company);

  return (
    <div>
      <div className="flex justify-between items-center mb-5 mt-10">
        <h3 className="font-semibold text-blue-900 text-3xl">
          App Download Section
        </h3>
        <button
          onClick={() => setOpenAppModal(true)}
          className="w-44 py-3 px-5 bg-primary text-white text-sm rounded-md font-semibold"
        >
          + Add App Link
        </button>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-6 bg-white rounded-md p-5">
          <div className="flex gap-3">
            <div className="rounded-lg w-12 h-12 bg-gray-200 flex justify-center items-center shrink-0">
              <Icon icon="ion:logo-google-playstore" fontSize={30} />
            </div>
            <div className="line-clamp-1">
              <h6 className="font-bold text-blue-900">PlayStore Link</h6>
              <Link to={website?.android_app_link || ""} target="_blank">
                {website?.android_app_link}
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-md p-5 flex gap-3 col-span-12 lg:col-span-6">
          <div className="rounded-lg w-12 h-12 bg-gray-200 flex justify-center items-center shrink-0">
            <Icon icon="simple-icons:appstore" fontSize={30} />
          </div>
          <div className="line-clamp-1">
            <h6 className="font-bold text-blue-900">AppStore Link</h6>
            <Link to={website?.ios_app_link || ""} target="_blank">
              {website?.ios_app_link}
            </Link>
          </div>
        </div>
      </div>

      {/* <div className="bg-white rounded-lg p-5 mt-7">
        <div className="flex pl-3 pr-3  text-slate-400 text-[14px] font-bold leading-tight">
          <div className="w-[35rem]">PlayStore Link</div>
          <div className="w-[35rem]">AppStore Link</div>
          <div className="">Actions</div>
        </div>

        <div className="border-b p-3 w-[100%] flex justify-center border-slate-100"></div>

        <div className="flex items-center px-2 pb-4 text-slate-400 text-[14px] font-bold leading-tight mt-3 border-b border-slate-100">
          <div className="w-[35rem] text-blue-900 text-[15px] font-bold leading-snug">
            <div className="w-[32rem]">
              <h3 className="truncate">
                www.Instagram.com/gh/user/name/2223e344443343j
              </h3>
            </div>
          </div>
          <div className="w-[35rem] text-blue-900 text-[15px] font-bold leading-snug">
            <div className="w-[32rem]">
              <h3 className="truncate">
                www.Instagram.com/gh/user/name/2223e344443343jwfihfifbijkjbhjbkhbkbkbk
              </h3>
            </div>
          </div>

          <div className="flex gap-5 items-center cursor-pointer ">
            <Link to="">
              <Icon
                icon="fluent:delete-28-regular"
                className="h-5 w-5 text-red-500"
              />
            </Link>
          </div>
        </div>
      </div> */}

      <Modal openModal={openAppModal} closeModal={setOpenAppModal}>
        <AppLinkForm />
      </Modal>
    </div>
  );
}

export default AppDownload;
