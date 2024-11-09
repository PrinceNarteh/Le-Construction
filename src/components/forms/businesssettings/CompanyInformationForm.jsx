import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import PhoneInput from "react-phone-number-input";
import { useDispatch } from "react-redux";

import { setUser } from "../../../app/feature/user/userSlice";
import { queryKeys } from "../../../constants";
import useMutate from "../../../hooks/useMutate";
import { useUserSelector } from "../../../hooks/useUserSelector";
import InputField from "../../shared/InputField";
import { setCompany } from "../../../app/feature/company/companySlice";
import { useCompanySelector } from "../../../hooks/useCompanySelector";

function CompanyInformationForm() {
  const { user } = useUserSelector();
  const { company } = useCompanySelector();
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || "");

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      company_id: user.company._id,
      company_name: company.company_name,
      email: company.email,
      phone: company.phone_number,
    },
  });

  const dispatch = useDispatch();
  const { mutate } = useMutate([queryKeys.UpdateCompany]);
  const submit = (data) => {
    data.phone = phoneNumber;
    const toastId = toast.loading("Updating company info...");

    mutate(
      {
        url: "/company/update",
        method: "PATCH",
        data,
      },
      {
        onSuccess(data) {
          dispatch(setCompany(data.message));
          toast.dismiss(toastId);
          toast.success("Company info updated successfully");
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      }
    );
  };

  return (
    <div>
      <div className="pl-7 pr-7">
        <form onSubmit={handleSubmit(submit)}>
          <div className="bg-white w-full rounded-xl p-10">
            <div className="space-y-5">
              <InputField
                label="Company Name"
                name="company_name"
                register={register}
                errors={errors}
                required
                errorMessage="Company name is required"
              />
              <div className="flex gap-5">
                <InputField
                  type="email"
                  label="Email"
                  name="email"
                  register={register}
                  errors={errors}
                  required
                  errorMessage="Company email is required"
                />

                <div className=" flex-1 p-1">
                  <label className="w-[650px] text-blue-900 text-md font-semibold leading-loose">
                    Phone Number
                  </label>

                  <PhoneInput
                    international
                    name="phone"
                    defaultCountry="US"
                    onChange={(value) => {
                      setPhoneNumber(value);
                      setValue("phone", value, { shouldValidate: true });
                    }}
                    value={phoneNumber}
                    className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-400 shadow-md rounded-md py-3 pl-9 pr-3 outline-none sm:text-sm"
                  />
                  {errors["phone"] && (
                    <span className="text-red-500 text-[12px]">
                      {errors["phone"].message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-5 justify-end mt-5">
              <button className="text-white bg-primary px-20 py-2 rounded-md text-md font-bold leading-loose">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanyInformationForm;
