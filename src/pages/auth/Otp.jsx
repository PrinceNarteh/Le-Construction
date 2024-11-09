import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { IoPersonOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import OtpField from "../../components/OtpField";
import Spinner from "../../components/Spinner";
import { queryKeys } from "../../constants/queryKeys";
import { useResetPasswordSelector } from "../../hooks/resetPasswordSelector";
import useMutate from "../../hooks/useMutate";

const schema = z.object({
  email: z.string().email(),
  otp: z.string().min(6, "OTP key must be six characters long"),
});

function Otp() {
  const { email } = useResetPasswordSelector();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      email,
      otp: "",
    },
    resolver: zodResolver(schema),
  });
  const { mutate, isLoading } = useMutate([queryKeys.OTP]);
  const navigate = useNavigate();

  const submitHandler = (data) => {
    mutate(
      {
        url: "/reset/step2",
        data,
      },
      {
        onSuccess() {
          navigate("/new-password");
        },
      }
    );
  };

  if (isLoading) return <Spinner isSubmitting={isLoading} />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 md:p-0">
      <div className="bg-white shadow-2xl rounded-2xl p-5 w-[500px]">
        <div className="mb-5">
          <img src="/images/logolemarini.webp" alt="" className="w-20 mb-5" />
          <h3 className="text-4xl font-bold mb-1">Forgot Password!</h3>
          <p>Please enter your email again</p>
        </div>
        <form className="space-y-7" onSubmit={handleSubmit(submitHandler)}>
          <div className="username flex">
            <IoPersonOutline size={45} className="p-2 h-12 text-black" />
            <div className="w-full">
              <input
                disabled={true}
                type="email"
                placeholder="Email"
                className="h-12 border outline-none p-4 bg-transparent w-full font-ray placeholder-black rounded-md"
                {...register("email")}
              />
              {errors["email"] && (
                <span className="text-red-500 text-[12px]">
                  {errors["email"].message}
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-center mb-2">
            <div>
              <OtpField setValue={setValue} />
              {errors["otp"] && (
                <span className="block text-red-500 text-[12px] pl-3 mt-1">
                  {errors["otp"].message}
                </span>
              )}
            </div>
          </div>
          <button className="text-white text-center w-full py-2 px-5 rounded bg-orange-900 hover:bg-orange-900 duration-200">
            Submit
          </button>
        </form>
        <div className="text-center text-sm mt-5">
          Take me back to
          <Link to="/login">
            <span className="font-bold text-orange-900 cursor-pointer ml-1">
              Log In
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Otp;
