import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import metadata from 'libphonenumber-js/metadata.min.json';
import "react-phone-number-input/style.css";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { queryKeys } from "../../constants";
import useFirebase from "../../hooks/useFirebase";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";
import { useUserSelector } from "../../hooks/useUserSelector";
import { capitalize } from "../../utils/capitalize";
import { convertBase64 } from "../../utils/convertBase64";
import Spinner from "../Spinner";
import CustomSelect from "../shared/CustomSelect";
import InputField from "../shared/InputField";
import Modal from "../shared/Modal";
import RoleForm from "./RoleForm";

const schema = (employee) => {
  const schema = z.object({
    company_id: z.string().min(1, "Company ID is required"),
    f_name: z.string().min(1, "First name is required"),
    l_name: z.string().min(1, "Last name is required"),
    email: z.string().email(),
    phone_number: z.string().min(9, "Please enter a phone number"),
    role_id: z.string().min(1, "Role is required"),
    profile_photo: z.any(),
    user_type: z.string().min(1, "User type is required"),
  });

  if (employee) {
    return schema.extend({
      employee_id: z.string().min(1, "Employee ID is required"),
    });
  } else {
    return schema
      .extend({
        password: z.string().min(5, "Passwords must be at least 5 characters"),
        confirmPassword: z.string().min(5, "Please confirm your password"),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
  }
};

function EmployeeForm({ employee = null, setOpenEmployeeDetails }) {
  const { requestForToken } = useFirebase();
  const { user } = useUserSelector();
  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: employee
      ? {
          //...employee,
          employee_id: employee?._id,
          role_id: employee?.role?._id,

          f_name: employee.f_name,
          l_name: employee.l_name,
          email: employee.email,
          phone_number: employee.phone_number,
          fcm_token: employee.fcm_token,
          company_id: employee.company_id,
          user_type: "employee",
        }
      : {
          f_name: "",
          l_name: "",
          email: "",
          phone_number: "",
          password: "",
          fcm_token: "",
          confirmPassword: "",
          role_id: "",
          profile_photo: "",
          company_id:
            user.user_type === "employee" ? user.company_id : user._id,
          user_type: "employee",
        },
    //resolver: zodResolver(schema(employee)),
  });
  const [preview, setPreview] = useState("");
  const [logo, setLogo] = useState(null);
  const [role, setRole] = useState("");
  const [run, setRun] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const { data: roles, isLoading } = usePostQuery({
    queryKey: [queryKeys.RolesForCompany],
    url: "/company/roles",
  });

  const queryClient = useQueryClient();
  const { mutate, isLoading: formLoading } = useMutate([
    `${employee ? "edit" : "add"}-employee`,
  ]);
  const submitHandler = async (data) => {
    delete data.confirmPassword;
    const formData = new FormData();

    if (employee) {
      Array.from(formData.keys()).forEach((key) => formData.delete(key));
      // Append updated data to formData
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
    } else {
      Object.entries(data).forEach((entry) => formData.append(...entry));
    }

    //if (employee) delete data._id;

    mutate(
      {
        url: `/employee/${employee ? "update/profile" : "create"}`,
        method: employee ? "PATCH" : "POST",
        data: formData,
        multipart: true,
      },
      {
        async onSuccess(data) {
          if (employee) {
            await queryClient.setQueryData([queryKeys.Employees], (oldData) => {
              return {
                message: (oldData?.message ?? []).map((item) => {
                  if (item._id === employee._id) {
                    return data;
                  }
                  return item;
                }),
              };
            });
          } else {
            await queryClient.setQueryData([queryKeys.Employees], (oldData) => {
              return {
                message: [data.message, ...(oldData?.message ?? [])],
              };
            });
          }
          toast.success(
            `Employee ${employee ? "info updated" : "added"} successfully`,
          );
          setOpenEmployeeDetails(false);
          
        },
        onError(error) {
          console.log(error);
          toast.error(
            `Error ${employee ? "updating employee info" : "adding employee"}.`,
          );
        },
      },
    );
  };

  useEffect(() => {
    if (logo) {
      convertBase64(logo).then((res) => setPreview(res));
    }
  }, [logo]);

  useEffect(() => {
    if (employee?.profile_photo) {
      setPreview(employee?.profile_photo);
    }
  }, [employee]);

  useEffect(() => {
    if (role) {
      setValue("role_id", role);
    }
  }, [role, setValue]);

  const rolesData =
    roles?.map((role) => ({
      id: role._id,
      label: capitalize(role.name),
    })) ?? [];

  useEffect(() => {
    if (run) {
      const getFcmToken = async () => {
        const token = await requestForToken();
        setValue("fcm_token", token);
        setRun(false);
      };
      getFcmToken();
    }
  }, [requestForToken, run, setValue]);

  return (
    <div className="">
      {(isLoading || formLoading) && (
        <Spinner isSubmitting={isLoading || formLoading} />
      )}
      <Spinner isSubmitting={formLoading} />

      <div className="">
        <div className="mt-6">
          <div className=" text-blue-900 text-2xl font-bold">
            {employee ? "Update Employee Info" : "Add Employee"}
          </div>
          <div className=" text-slate-400 text-[16px] font-normal mt-2">
            {employee ? "Update" : "Add"} the details of the employee below.
          </div>

          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="bg-white rounded-xl">
              <div className="bg-white overflow-y-auto">
                <div className="space-y-2">
                  <div className="form-row">
                    <InputField
                      label="First Name"
                      name="f_name"
                      placeholder="Enter your first name"
                      errors={errors}
                      register={register}
                      errorMessage="First is required"
                      required
                    />
                    <InputField
                      label="Last Name"
                      name="l_name"
                      placeholder="Enter your last name"
                      errors={errors}
                      register={register}
                      errorMessage="Last is required"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <InputField
                      label="Email"
                      name="email"
                      placeholder="Enter your email address"
                      errors={errors}
                      register={register}
                      errorMessage="Email is required"
                      required
                    />

                    <div className=" flex-1 p-1">
                      <label className="w-[650px] text-blue-900 text-md font-semibold leading-loose">
                        Phone Number
                      </label>
                      <PhoneInputWithCountry
                        international
                        name="phone_number"
                        defaultCountry="US"
                        control={control}
                        rules={{ required: true }}
                        metadata={metadata}
                        className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-400 shadow-md rounded-md py-3 pl-9 pr-3 outline-none sm:text-sm"
                      />
                      {errors["phone_number"] && (
                        <span className="text-red-500 text-[12px]">
                          {errors["phone_number"].message}
                        </span>
                      )}
                    </div>
                  </div>
                  {!employee?._id && (
                    <div className="form-row">
                      <InputField
                        type="password"
                        label="Password"
                        name="password"
                        placeholder="Create password"
                        errors={errors}
                        register={register}
                        required
                      />

                      <InputField
                        type="password"
                        label="Confirm Password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        errors={errors}
                        register={register}
                        errorMessage="Confirm password is required"
                        required
                      />
                    </div>
                  )}

                  <div className="form-row">
                    <CustomSelect
                      label="Roles"
                      data={rolesData}
                      onChange={setRole}
                      placeholder="Search for roles..."
                      loading={isLoading}
                      initialValue={employee?.role._id}
                      actionButton={() => (
                        <button>
                          <Icon
                            onClick={setOpenForm(true)}
                            icon="iconamoon:edit-light"
                            className="mt-[0.7rem] h-5 w-5 ml-3"
                          />
                        </button>
                      )}
                    />
                  </div>
                </div>

                <div className="flex-1 mt-4">
                  <label className="text-blue-900 text-md font-semibold leading-loose ">
                    Upload your profile picture
                  </label>
                  <div className="flex flex-col items-center gap-5 mt-2 md:flex-row">
                    {preview && (
                      <div className="h-40 w-full md:w-60 flex justify-center border-2 shrink-0 border-primary border-dashed rounded-lg overflow-hidden">
                        <img
                          src={preview}
                          alt=""
                          className="w-60 h-40 object-cover"
                        />
                      </div>
                    )}
                    <label
                      htmlFor="dropzone-file"
                      className="flex-1 w-full block h-40 border-2 border-primary bg-[#F4F6FB] border-dashed rounded-lg cursor-pointer p-2"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
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
                        <div className="text-center">
                          <span className="text-blue-900 text-[15px] font-bold leading-loose">
                            Drop your logo here, or
                          </span>
                          <span className="text-primary text-[15px] font-bold leading-loose ml-2">
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
                          setValue("profile_photo", e.target.files[0]);
                        }}
                      />
                    </label>
                    {errors["profile_photo"] && (
                      <span className="text-red-500 text-[12px]">
                        {errors["profile_photo"].message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button className="text-white text-md font-bold leading-loose w-60 h-12 py-5 bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex mt-4">
                {employee ? "Update" : "Add"} Employee
              </button>
            </div>
          </form>
        </div>
      </div>

      <Modal
        openModal={openForm}
        closeModal={setOpenForm}
        className="place-content-start"
        width="max-w-4xl"
      >
        <RoleForm role={role} setOpenModal={setOpenForm} />
      </Modal>
    </div>
  );
}

export default EmployeeForm;
