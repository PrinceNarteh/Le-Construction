import { Icon } from "@iconify/react";
import React, { useState } from "react";
import BrandingSettingsForm from "../../components/forms/businesssettings/BrandingSettingsForm";
import Heading from "../../components/layout/Heading";
import SettingsPage from "../../components/settingspage/SettingsPage";
import Modal from "../../components/shared/Modal";
import { useUserSelector } from "../../hooks/useUserSelector";
import { capitalize } from "../../utils/capitalize";

function MainProfile() {
  const { user } = useUserSelector();

  const [openEditForm, setOpenEditForm] = useState(false);

  return (
    <div className="cursor-pointer">
      <div className="ml-9">
        <Heading label="Profile" />
      </div>

      <div className="px-10 mt-2">
        <div className="">
          <div className="">
            <div className="h-80 w-full bg-white col-span-3 rounded-xl p-5 ">
              <div className="h-[8rem] flex justify-center w-full bg-[url('/public/images/BackgroundImage.png')] bg-cover bg-center bg-no-repeat rounded-xl relative">
                <div className="absolute top-0 mt-20 ">
                  <img
                    src={user?.brand?.company_logo}
                    alt=""
                    className="h-24 w-24 rounded-full object-cover border-4 border-white"
                  />
                </div>
              </div>

              <div className="text-center text-blue-900 text-xl font-bold leading-loose mt-10">
                {capitalize(user?.company_name, " ")}
              </div>
              <div
                className="flex justify-center items-center"
                onClick={() => setOpenEditForm(true)}
              >
                <div className="w-[74px] text-slate-400 text-sm font-normal leading-normal">
                  Edit Profile
                </div>
                <Icon icon="iconamoon:edit-thin" className="" />
              </div>

              <div className="flex justify-center ">
                <div className="mr-8">
                  <div className="text-center text-blue-900 text-2xl font-bold leading-normal">
                    {user?.projects.length}
                  </div>
                  <div className="text-center text-slate-400 text-sm font-normal leading-tight">
                    Projects
                  </div>
                </div>
                <div className="mr-8">
                  <div className="text-center text-blue-900 text-2xl font-bold leading-normal">
                    {
                      user?.projects.filter(
                        (project) => project.status === "Completed"
                      ).length
                    }
                  </div>
                  <div className="text-center text-slate-400 text-sm font-normal leading-tight">
                    Completed
                  </div>
                </div>
                <div className="mr-8">
                  <div className="text-center text-blue-900 text-2xl font-bold leading-normal">
                    {
                      user?.projects.filter(
                        (project) => project.status === "Wip"
                      ).length
                    }
                  </div>
                  <div className="text-center text-slate-400 text-sm font-normal leading-tight">
                    Work In Progress
                  </div>
                </div>
                <div className="mr-8">
                  <div className="text-center text-blue-900 text-2xl font-bold leading-normal">
                    20
                  </div>
                  <div className="text-center text-slate-400 text-sm font-normal leading-tight">
                    Employees
                  </div>
                </div>
                <div>
                  <div className="text-center text-blue-900 text-2xl font-bold leading-normal">
                    32
                  </div>
                  <div className="text-center text-slate-400 text-sm font-normal leading-tight">
                    Tasks
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full mt-4">
              <SettingsPage />
            </div>
          </div>
        </div>
      </div>

      <Modal openModal={openEditForm} closeModal={setOpenEditForm}>
        <BrandingSettingsForm />
      </Modal>
    </div>
  );
}

export default MainProfile;
