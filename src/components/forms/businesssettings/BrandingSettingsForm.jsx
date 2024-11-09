import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

// import { setUser } from "../../../app/feature/user/userSlice";
import { queryKeys } from "../../../constants";
import useMutate from "../../../hooks/useMutate";
// import { useUserSelector } from "../../../hooks/useUserSelector";
import { useCompanySelector } from "../../../hooks/useCompanySelector";
import { setCompany } from "../../../app/feature/company/companySlice";
import useTheme from "../../../hooks/useTheme";

function BrandingSettingsForm() {
  // const { user } = useUserSelector();
  const { company } = useCompanySelector()
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { setTheme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_id: company._id,
      primary_color: company.brand?.primary_color ?? "",
      secondary_color: company.brand?.secondary_color ?? "",
      button_color: company.brand?.button_color ?? "",
    },
  });

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const dispatch = useDispatch();
  const { mutate } = useMutate([queryKeys.UpdateBrand]);
  const submit = (data) => {
    const toastId = toast.loading("Updating company brand...");
    const formData = new FormData();
    Object.entries(data).forEach((item) => {
      formData.append(...item);
    });

    if (image) {
      formData.append("company_logo", image);
    }

    mutate(
      {
        url: "/company/update/branding",
        data: formData,
        method: "PATCH",
        multipart: true,
      },
      {
        onSuccess(data) {
          //console.log("brand-settings:::",data.message);
          dispatch(setCompany(data.message));
          toast.dismiss(toastId);
          toast.success("Brand updated successfully");
          setTheme();
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message.message);
        },
      }
    );
  };

  return (
    <div className="px-7">
      <form onSubmit={handleSubmit(submit)}>
        <div className="w-full rounded-xl">
          <div className="form-row">
            <div className="w-full bg-white p-10 flex flex-col items-center justify-between">
              <div className="h-40 w-full md:w-60 flex justify-center border-2 shrink-0 border-orange-300 border-dashed rounded-lg overflow-hidden">
                <img
                  src={preview || company.brand?.company_logo}
                  alt=""
                  className="w-60 h-40 object-cover"
                />
              </div>
              <div className="w-full">
                <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                  Update Logo
                </label>
                <input
                  className="block w-full cursor-pointer font-normal rounded-lg border bg-dark-gray file:border-none file:bg-primary file:px-5 file:py-3 file:text-white"
                  aria-describedby="user_avatar_help"
                  id="user_avatar"
                  type="file"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="w-full bg-white p-10 space-y-5">
              <div className="flex-1">
                <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                  Primary Color
                </label>
                <input
                  type="color"
                  name="primary_color"
                  className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md h-10 sm:text-sm"
                  {...register("primary_color")}
                />
                {errors.primary_color && (
                  <span className="text-red-500 text-[12px]">
                    {errors.primary_color.message}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                  Secondary Color
                </label>
                <input
                  type="color"
                  name="secondary_color"
                  className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md h-10 sm:text-sm"
                  {...register("secondary_color")}
                />
                {errors.secondary_color && (
                  <span className="text-red-500 text-[12px]">
                    {errors.secondary_color.message}
                  </span>
                )}
              </div>
              {/* <div className="flex-1">
                <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                  Button Color
                </label>
                <input
                  type="color"
                  name="button_color"
                  className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md h-10 sm:text-sm"
                  {...register("button_color")}
                />
                {errors.button_color && (
                  <span className="text-red-500 text-[12px]">
                    {errors.button_color.message}
                  </span>
                )}
              </div> */}
            </div>
          </div>

          <div className="flex gap-5 justify-end">
            <button className="text-white text-md font-bold leading-loose bg-primary py-2 px-20 rounded-md mb-5">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default BrandingSettingsForm;
