import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { HiOutlineEye } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { setUser } from "../../app/feature/user/userSlice";
import { FullPageSpinner } from "../../components/Spinner";
import OnBoardLayout from "../../components/layout/OnBoardingLayout";
import { login } from "../../services/auth";
import useMutate from "../../hooks/useMutate";
import useFirebase from "../../hooks/useFirebase";
import { setCompanySettings } from "../../app/feature/companySettings/companySettingsSlice";
import { setCompany } from "../../app/feature/company/companySlice";
import { useGetQuery } from "../../hooks/useGetQuery";
import { queryKeys } from "../../constants";

const schema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
  password: z.string().min(1, { message: "Password is required" }),
});

function Login() {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });
  const [errorMessage, setErrorMessage] = useState("");
  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
  });

  const navigate = useNavigate();

  const { mutate, isLoading } = useMutate();
  const { requestForToken } = useFirebase();
  const submitHandler = async (data) => {
    loginMutation.mutate(
      {
        url: "/employee/login",
        data,
      },
      {
        async onSuccess(data) {
          //console.log({ data });
          localStorage.setItem("token", data.message.auth_token);
          localStorage.setItem("role_id", data.message.role._id);
          dispatch(setUser(data.message));
          dispatch(
            setCompanySettings(
              ["super_admin", "owner", "Partner"].includes(data.message.role.name)
                ? data.message.company_settings
                : data.message.company.company_settings
            )
          );

          // Generate FCM token
          const fcm_token = await requestForToken();

          mutate(
            {
              url: `/${
                data?.message.user_type === "company" ? "company" : "employee"
              }/update`, // # TODO: Change the url base on the person login
              method: "PATCH",
              data: {
                ...(data?.message.user_type === "company"
                  ? { company_id: data?.message._id }
                  : { employee_id: data?.message._id }),
                fcm_token,
              },
            },
            {
              onSuccess(data) {
                toast.success("Login successful");
                navigate("/");
              },
              onError(error) {
                setErrorMessage(error.response.data.message.message);
              },
            }
          );

          localStorage.setItem("token", data.message.auth_token);
          localStorage.setItem("role_id", data.message.role._id);
          dispatch(setUser(data.message));
          dispatch(setCompany(data.message.company));
          
          toast.success("Login successful");
          navigate("/");
        },
        onError(error) {
          setErrorMessage(error.response.data.message.message);
        },
      }
    );
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <OnBoardLayout image="/images/builder1.jpg">
      <FullPageSpinner isSubmitting={loginMutation.isLoading || isLoading} />
      <div className="mt-10">
        <div className="mb-10">
          <div className="w-full text-slate-700 text-3xl font-bold tracking-wide">
            Login with us and explore more
          </div>

          <div className="w-full text-slate-500 text-sm font-normal mt-2">
            That will help us better setup account for you
          </div>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
          {errorMessage && (
            <p className="font-ray w-[80%] ml-14 mb-4 font-semibold px-2 py-1 text-sm rounded-md bg-red-100 text-red-500 text-justify tracking-wide">
              {`${errorMessage[0].toUpperCase()}${errorMessage.substring(1)}`}
            </p>
          )}
          <div>
            <h3 className=" text-slate-700 text-[20px] font-normal leading-loose">
              Email
            </h3>
            <input
              type="email"
              placeholder="Enter email"
              className="h-12 border outline-none p-4 bg-transparent w-[100%] placeholder:text-[#ABB3C5] placeholder:font-normal rounded-md"
              {...register("email")}
            />
            {errors["email"] && (
              <span className="pl-4 text-[13px] text-[red]">
                {errors["email"].message}
              </span>
            )}
          </div>

          <div>
            <h3 className=" text-slate-700 text-lg font-normal leading-loose">
              Password
            </h3>
            <div className="flex">
              <input
                type={visible ? "text" : "password"}
                placeholder="Create a password"
                className="h-12 border-t border-l border-b outline-none p-4 bg-transparent w-[100%] placeholder:text-[#ABB3C5] rounded-md rounded-r-none"
                {...register("password")}
              />
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
            {errors["password"] && (
              <span className="pl-4 text-[13px] text-[red]">
                {errors["password"].message}
              </span>
            )}
          </div>

          <div className="flex justify-end mr-3 mt-5 font-ray">
            <Link to="/forgot-password">
              <h3> Forgot Password</h3>
            </Link>
          </div>

          <button className="text-white text-lg font-bold leading-loose w-full h-full px-2 py-2 bg-gradient-to-r from-red-500 to-orange-300 rounded-lg shadow justify-center items-center gap-2.5 inline-flex mt-10">
            Login
          </button>
        </form>
      </div>
    </OnBoardLayout>
  );
}

export default Login;
