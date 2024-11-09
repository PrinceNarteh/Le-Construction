import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import useMutate from "../../hooks/useMutate";
import { useUserSelector } from "../../hooks/useUserSelector";
import showPartial from "../../utils/showPartial";
import Heading from "../layout/Heading";
import InputField from "../shared/InputField";
import Item from "../shared/Item";
import Modal from "../shared/Modal";

function MapAPI() {
  const { user } = useUserSelector();
  const [openModal, setOpenModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_id: user._id,
      client_map_api_key: user.map_config?.client_map_api_key ?? "",
      server_map_api_key: user.map_config?.server_map_api_key ?? "",
    },
  });

  const { mutate } = useMutate(["add-sms-gateway"]);
  const submitHandler = (data) => {
    const toastId = toast.loading("Updating Google Map API...");

    mutate(
      {
        url: "/thirdparty/map/config",
        method: "PATCH",
        data,
      },
      {
        onSuccess(data) {
          toast.dismiss(toastId);
          toast.success("Google Map API updated successfully!");
          setOpenModal(false);
        },
      }
    );
  };

  return (
    <div className="px-20 mt-5">
      <div className="">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center">
            <img
              src="/images/mapslogo1.png"
              alt=""
              className="h-6 w-6 object-contain"
            />
            <Heading label="Google Maps API Setup" />
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="bg-primary flex items-center text-white py-2 px-7 rounded-md text-xs font-bold"
          >
            <Icon icon="iconamoon:edit-light" className="mr-2" />
            Edit
          </button>
        </div>
        <div className="bg-white rounded-lg p-10">
          <div>
            <Item
              label="API Key (Client)"
              value={showPartial(user.map_config?.client_map_api_key ?? "")}
            />
            <Item
              label="API Key (Server)"
              value={showPartial(user.map_config?.server_map_api_key ?? "")}
            />
          </div>
        </div>
      </div>

      <Modal openModal={openModal} closeModal={setOpenModal}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="bg-white w-full rounded-xl p-5">
            <div className="text-blue-900 text-2xl font-bold leading-10 mb-5">
              Google Map API
            </div>
            <div className="space-y-2">
              <div className="w-full">
                <InputField
                  label="API Key (Client)"
                  name="client_map_api_key"
                  register={register}
                  errors={errors}
                  required
                  placeholder="API Key (Client)"
                  errorMessage="API Key (Client) is required"
                />
              </div>
              <div className="w-full">
                <InputField
                  label="API Key (Server)"
                  name="server_map_api_key"
                  register={register}
                  errors={errors}
                  required
                  placeholder="API Key (Server)"
                  errorMessage="API Key (Server) is required"
                />
              </div>
            </div>

            <div className="flex gap-5 justify-end mr-">
              <div className="w-48 mt-5 h-12 py-5 bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex">
                <button className="text-white text-md font-bold leading-loose">
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default MapAPI;
