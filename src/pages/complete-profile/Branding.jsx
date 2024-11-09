import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { BsArrowLeft } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";

import { setUser } from "../../app/feature/user/userSlice";
import { FullPageSpinner } from "../../components/Spinner";
import OnBoardLayout from "../../components/layout/OnBoardingLayout";
import { queryKeys } from "../../constants";
import useMutate from "../../hooks/useMutate";
import { useUserSelector } from "../../hooks/useUserSelector";
import { convertBase64 } from "../../utils/convertBase64";
import { useCompanySelector } from "../../hooks/useCompanySelector";

const schema = z.object({
  user_id: z.string().min(1, "User is required"),
  primary_color: z.string().min(1, "Primary color is required"),
  secondary_color: z.string().min(1, "Secondary color is required"),
  company_logo: z.any(),
});

function Branding() {
  const dispatch = useDispatch();
  const { user } = useUserSelector();
  const { company } = useCompanySelector()
  const {
    getValues,
    setValue,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      user_id: user?.auth_token ? user?._id : "",
      primary_color: company.has_branding, //? user.company.brand.primary_color : "",
      secondary_color: company.has_branding, //? user.company.brand.secondary_color : "",
      company_logo: company.has_branding, //? user.company.brand.company_logo : "",
    },
    resolver: zodResolver(schema),
  });
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState();

  const navigate = useNavigate();
  const { mutate, isLoading } = useMutate([queryKeys.CreateBranding]);
  const submitHandler = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(
      function (entry) {
        if (entry[0] === "company_logo") {
          formData.append(entry[0], logo);
          return;
        }
        formData.append(entry[0], entry[1]);
      }
      //formData.append(entry[0], entry[1])
    );

    mutate(
      { url: "/add/branding", data: formData, multipart: true },
      {
        onSuccess(data) {
          dispatch(setUser(data.message));
          toast.success("Branding created successfully");
          navigate("/");
        },
        onError(error) {
          toast.error(error.response.data.message);
        },
      }
    );
  };

  useEffect(() => {
    if (logo) {
      convertBase64(logo).then((res) => setPreview(res));
    }
  }, [logo]);

  if (!user?.auth_token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="mt-5">
      {isLoading && <FullPageSpinner isSubmitting={isLoading} />}
      <OnBoardLayout image="/images/builder11.jpg">
        <div className="mt-5">
          <Link to="/profile">
            <div className="flex justify-between items-center mb-5">
              <BsArrowLeft size={25} />
            </div>
          </Link>

          <div className="mb-6">
            <div className="w-full text-slate-700 text-3xl font-bold tracking-wide">
              Upload logo and color palette
            </div>

            <div className="w-full text-slate-500 text-sm font-normal mt-2">
              This will help us better setup your dashboard for you
            </div>
          </div>

          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="items-center justify-center w-full mt-4">
              <label className="text-blue-900 text-md font-semibold leading-loose ">
                Upload your logo
              </label>
              <div className="flex flex-col items-center gap-5 mt-2 md:flex-row">
                {getValues()?.company_logo || preview ? (
                  <div className="h-40 w-full md:w-48 flex justify-center border-2 shrink-0 border-orange-300 border-dashed rounded-lg overflow-hidden">
                    <img
                      src={
                        getValues()?.company_logo && !preview
                          ? getValues()?.company_logo
                          : preview
                      }
                      alt=""
                      className="w-60 h-40 object-cover"
                    />
                  </div>
                ) : null}

                <label
                  htmlFor="dropzone-file"
                  className="flex-1 w-full block h-40 border-2 border-orange-300 bg-[#F4F6FB] border-dashed rounded-lg cursor-pointer p-2"
                >
                  <div className="flex flex-col items-center justify-center pt-2 pb-6">
                    <svg
                      aria-hidden="true"
                      className="w-10 h-10 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <div className="text-center overflow-hidden">
                      <span className="text-blue-900 text-[15px] font-bold leading-loose">
                        Drop your logo here, or
                      </span>
                      <span className="text-red-500 text-[15px] font-bold leading-loose ml-2">
                        browse
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      PNG, JPG and GIF files are allowed
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      setLogo(e.target.files[0]);
                      setValue("company_logo", e.target.files[0]);
                    }}
                  />
                </label>
                {errors["company_logo"] && (
                  <span className="text-red-500 text-[12px]">
                    {errors["company_logo"].message}
                  </span>
                )}
              </div>
            </div>

            <h3 className=" text-slate-700 text-[20px] font-normal leading-loose mt-3">
              Select your color palette
            </h3>

            <div className="grid grid-cols-2 items-center mt-2">
              <div>
                <p className="text-slate-700 text-[20px] font-normal leading-loose">
                  Primary Color:
                </p>
                <input
                  type="color"
                  className="h-12 border outline-none bg-transparent w-32 placeholder:text-[#ABB3C5] rounded-xl cursor-pointer placeholder:rounded-xl"
                  {...register("primary_color")}
                />
              </div>
              <div>
                <p className="text-slate-700 text-[20px] font-normal leading-loose">
                  Secondary Color:
                </p>
                <input
                  type="color"
                  className="h-12 border outline-none bg-transparent w-36 placeholder:text-[#ABB3C5] rounded-xl cursor-pointer placeholder:rounded-xl"
                  {...register("secondary_color")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 items-center mt-2"></div>

            <button className="w-full h-full px-2 py-2 bg-gradient-to-r from-red-500 to-orange-300 rounded-lg shadow justify-center items-center gap-2.5 inline-flex mt-5">
              <div className="text-white text-lg font-bold leading-loose">
                Submit
              </div>
            </button>
          </form>
        </div>
      </OnBoardLayout>
    </div>
  );
}

export default Branding;
