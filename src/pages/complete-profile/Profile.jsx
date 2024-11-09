import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { getCountries } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import "react-phone-number-input/style.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";

import { FullPageSpinner } from "../../components/Spinner";
import OnBoardLayout from "../../components/layout/OnBoardingLayout";
import useMutate from "../../hooks/useMutate";
import { useUserSelector } from "../../hooks/useUserSelector";
import { queryKeys } from "../../constants/queryKeys";

const schema = z.object({
  user_id: z.string().min(1, "User is required"),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().min(1, "Country is required"),
});

function Profile() {
  const { user } = useUserSelector();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      user_id: user?.auth_token ? user._id : "",
      street: user?.has_address ? user.address.street : "",
      city: user?.has_address ? user.address.city : "",
      state: user?.has_address ? user.address.state : "",
      zip: user?.has_address ? user.address.zip : "",
      country: user?.has_address ? user.address.country : "",
    },
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
  const { mutate, isLoading } = useMutate([queryKeys.UserProfile]);
  const submitHandler = async (formData) => {
    mutate(
      { url: "/add/profile", data: formData },
      {
        onSuccess(data) {
          toast.success("Profile created successfully");
          navigate("/branding");
        },
        onError(error) {
          toast.error(error.response.data.message.message);
        },
      }
    );
  };

  if (!user?.auth_token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="mt-10">
      <OnBoardLayout image="/images/builder2.jpg">
        <FullPageSpinner isSubmitting={isLoading} />
        <div className="mt-5 relative w-full">
          <div className="flex justify-between items-center mb-5">
            <Link to="/login">
              <BsArrowLeft size={25} />
            </Link>

            <Link to="/branding">
              <BsArrowRight size={25} />
            </Link>
          </div>

          <div className="mb-6">
            <div className="w-full text-slate-700 text-3xl font-bold tracking-wide">
              Kindly fill in your information
            </div>

            <div className="w-full text-slate-500 text-sm font-normal mt-2">
              That will help us better setup account for you
            </div>
          </div>

          <form className="w-full" onSubmit={handleSubmit(submitHandler)}>
            <div className="">
              <div className="flex-1">
                <label className=" text-blue-900 text-md font-semibold leading-loose">
                  Country
                </label>
                <select
                  className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-200 rounded-md py-3 pl-9 pr-3 outline-none sm:text-sm"
                  {...register("country")}
                >
                  <option value="">{en["ZZ"]}</option>
                  {getCountries().map((country, idx) => (
                    <option key={idx} value={en[country]}>
                      {en[country]}
                    </option>
                  ))}
                </select>
                {errors["country"] && (
                  <span className="text-red-500 text-[12px]">
                    {errors["country"].message}
                  </span>
                )}
              </div>

              <div className="mt-2">
                <h3 className=" text-slate-700 text-lg font-normal leading-loose">
                  State
                </h3>
                <input
                  placeholder="Enter your state"
                  className="h-12 border outline-none p-4 bg-transparent w-[100%] placeholder:text-[#ABB3C5] rounded-md"
                  {...register("state")}
                />
              </div>

              <div className="mt-2 w-full">
                <h3 className=" text-slate-700 text-lg font-normal leading-loose">
                  City
                </h3>
                <input
                  placeholder="Enter your city"
                  className="h-12 border outline-none p-4 bg-transparent w-[100%] placeholder:text-[#ABB3C5] rounded-md"
                  {...register("city")}
                />
              </div>

              <div className="mt-2">
                <h3 className=" text-slate-700 text-lg font-normal leading-loose">
                  Zip
                </h3>
                <input
                  placeholder="Enter your zip"
                  className="h-12 border outline-none p-4 bg-transparent w-[100%] placeholder:text-[#ABB3C5] rounded-md"
                  {...register("zip")}
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full h-full text-white text-lg font-bold leading-loose px-2 py-2 bg-gradient-to-r from-red-500 to-orange-300 rounded-lg shadow justify-center items-center gap-2.5 inline-flex mt-10"
            >
              Submit
            </button>
          </form>
        </div>
      </OnBoardLayout>
    </div>
  );
}

export default Profile;
