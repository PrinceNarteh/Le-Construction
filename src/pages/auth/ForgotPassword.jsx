import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { IoPersonOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { setEmail } from "../../app/feature/resetPassword/resetPasswordSlice";
import Spinner from "../../components/Spinner";
import { queryKeys } from "../../constants/queryKeys";
import useMutate from "../../hooks/useMutate";

function ForgotPassword() {
  const { mutate, isLoading } = useMutate([queryKeys.ForgotPassword]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "" },
    resolver: zodResolver(z.object({ email: z.string().email() })),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (data) => {
    mutate(
      {
        url: "/reset/step1",
        data,
      },
      {
        onSuccess() {
          dispatch(setEmail(data.email));
          navigate("/otp");
        },
        onError() {
          toast.error(
            `Your ${data.email} is not registered, please try again with a registered email`
          );
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
          <p>Please enter your email</p>
        </div>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-7">
          <div className="username flex">
            <IoPersonOutline size={45} className="p-2 h-12 text-black" />
            <div className="w-full">
              <input
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

export default ForgotPassword;
