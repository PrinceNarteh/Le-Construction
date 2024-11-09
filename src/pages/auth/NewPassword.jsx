import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { CiLock } from "react-icons/ci";
import { HiOutlineEye } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { clearEmail } from "../../app/feature/resetPassword/resetPasswordSlice";
import Spinner from "../../components/Spinner";
import { queryKeys } from "../../constants/queryKeys";
import { useResetPasswordSelector } from "../../hooks/resetPasswordSelector";
import useMutate from "../../hooks/useMutate";

const schema = z.object({
  email: z.string().email(),
  new_password: z.string().min(5, "Password must be at least 5 characters"),
});

function NewPassword() {
  const { email } = useResetPasswordSelector();
  const [visible, setVisible] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email,
      new_password: "",
    },
    resolver: zodResolver(schema),
  });

  const { mutate, isLoading } = useMutate([queryKeys.NewPassword]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (data) => {
    mutate(
      {
        url: "/reset/step3",
        data,
      },
      {
        onSuccess() {
          dispatch(clearEmail());
          navigate("/login");
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
          <h3 className="text-4xl font-bold mb-1">New Password!</h3>
          <p>Please enter your password</p>
        </div>
        <form className="space-y-7" onSubmit={handleSubmit(submitHandler)}>
          <div className="mt-6">
            <div className="flex">
              <CiLock size={50} className="p-2 h-12 text-black" />
              <div>
                <input
                  type={visible ? "text" : "password"}
                  placeholder="Password"
                  className="h-12 border-t border-l border-b outline-none p-4 bg-transparent font-ray w-[100%] placeholder-black rounded-md rounded-r-none"
                  {...register("new_password")}
                />
                {errors["new_password"] && (
                  <span className="text-red-500 text-[12px]">
                    {errors["new_password"].message}
                  </span>
                )}
              </div>
              <span
                onClick={() => setVisible(!visible)}
                className="cursor-pointer"
              >
                {visible ? (
                  <AiOutlineEyeInvisible
                    size={45}
                    className="p-2 border-r border-t border-b rounded-r-md h-12"
                  />
                ) : (
                  <HiOutlineEye
                    size={45}
                    className="p-2 border-r border-t border-b rounded-r-md h-12"
                  />
                )}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="text-white text-center w-full py-2 px-5 rounded bg-orange-900 hover:bg-orange-900 duration-200"
          >
            Create Password
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

export default NewPassword;
