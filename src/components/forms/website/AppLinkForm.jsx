import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

import { setCompany } from "../../../app/feature/company/companySlice";
import { useCompanySelector } from "../../../hooks/useCompanySelector";
import useMutate from "../../../hooks/useMutate";
import InputField from "../../shared/InputField";
import { setWebsite } from "../../../app/feature/company/websiteSlice";

function AppLinkForm() {
  const { company } = useCompanySelector();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_id: company.website_id,
      android_app_link: company?.android_app_link,
      ios_app_link: company?.ios_app_link,
    },
  });

  const dispatch = useDispatch();
  const { mutate } = useMutate(["update-app-links"]);
  const submitHandler = (data) => {
    const toastId = toast.loading("Updating App Download Links...");
    mutate(
      {
        url: "/website/app/links",
        method: "PATCH",
        data,
      },
      {
        onSuccess(data) {
          dispatch(setWebsite(data.message));
          toast.dismiss(toastId);
          toast.success("App Download Links updated successfully!");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className=" mb-5 mt-5">
        <div className="mt-5">
          <h3 className="font-semibold text-blue-900 text-3xl">
            App Download Link
          </h3>
        </div>
      </div>
      <div className="bg-white w-full rounded-xl p-5">
        <div className="space-y-5">
          <div className="w-full">
            <div className="flex">
              <img
                src="/images/playstore.png"
                alt=""
                className="h-8 w-8 object-cover"
              />
              <InputField
                label="PlayStore Download Link"
                name="android_app_link"
                errors={errors}
                register={register}
                placeholder="Paste PlayStore Download Link"
              />
            </div>
          </div>
          <div className="w-full">
            <div className="flex items-start">
              <img
                src="/images/appstore.png"
                alt=""
                className="h-8 w-8 object-cover"
              />
              <InputField
                label="AppStore Download Link"
                name="ios_app_link"
                errors={errors}
                register={register}
                placeholder="Paste AppStore Download Link"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-5 justify-end mr-5">
          <div className="w-48 mt-5 h-12 py-5 bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex">
            <button className="text-white text-md font-bold leading-loose">
              Save Infomation
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default AppLinkForm;
