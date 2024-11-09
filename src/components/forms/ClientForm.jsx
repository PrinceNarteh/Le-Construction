import { zodResolver } from "@hookform/resolvers/zod";
import { AsYouType } from "libphonenumber-js";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import PhoneInput from "react-phone-number-input";
import en from "react-phone-number-input/locale/en";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

import Spinner from "../../components/Spinner";
import InputField from "../../components/shared/InputField";
import { queryKeys } from "../../constants";
import useCountries from "../../hooks/useCountries";
import useMutate from "../../hooks/useMutate";
import { useUserSelector } from "../../hooks/useUserSelector";
import CustomSelect from "../shared/CustomSelect";

const schema = (client) => {
  const baseSchema = z.object({
    company_id: z.string().min(1, "Please select company"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email(),
    phone: z.string().min(1, "Phone number is required"),
    country: z.string().min(1, "Please select your country"),
    country_code: z.string().min(1, "Please enter your country code"),
    user_type: z.string().min(1, "Please select user type"),
    role: z.string().min(1, "Please select role"),
  });

  if (!client) {
    return baseSchema.extend({
      password: z.string().min(5, "Password should be at least 5 characters"),
      confirmPassword: z.string().min(5, "Please confirm your password"),
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"], // path of error
    });
  }

  return baseSchema;
};

function ClientForm({ client = null, closeModal = null }) {
  const queryClient = useQueryClient();
  const { user } = useUserSelector();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const { clearErrors, setValue, register, formState: { errors }, handleSubmit } = useForm({
    defaultValues: client ? {
      company_id: client.company_id,
      first_name: client.first_name,
      last_name: client.last_name,
      email: client.email,
      phone: client.phone,
      country: client.country,
      country_code: client.country_code,
      user_type: "Client",
      role: "user",
    } : {
      company_id: user.user_type === "company" ? user._id : user.company._id,
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      country: "",
      country_code: "",
      user_type: "Client",
      role: "user",
    },
    resolver: zodResolver(schema(client)),
  });

  const { countries } = useCountries({
    setValue,
    clearErrors,
    fieldName: "country",
    fieldValue: country,
  });

  useEffect(() => {
    if (client) {
      setPhoneNumber(client.phone);
    }
  }, [client]);

  useEffect(() => {
    const selectCountry = () => {
      if (!phoneNumber) return;
      const asYouType = new AsYouType();
      asYouType.input(phoneNumber);
      if (asYouType.country) {
        setValue("country_code", asYouType.formattedOutput.split(" ")[0]);
        setValue("country", en[asYouType.country]);
        setValue("phone", phoneNumber);
      } else {
        setValue("country_code", "");
        setValue("phone", "");
      }
    };

    selectCountry();
  }, [phoneNumber, setValue]);

  const { mutate, isLoading } = useMutate([queryKeys.CreateClient]);
  const submitHandler = async (data) => {
    if (client) data["client_id"] = client._id;

    mutate(
      {
        url: client ? "/company/client/update" : "/company/add/client",
        method: client ? "PATCH" : "POST",
        data,
      },
      {
        async onSuccess(data) {
          await queryClient.invalidateQueries([queryKeys.Clients]); // Invalidate queries here
          toast.success("Client created successfully");
          closeModal();
        },
        onError(error) {
          toast.error(error.response.data.message);
        },
      }
    );
  };

  const clientStatus = client ? "Update" : "Add";

  return (
    <div className={closeModal && "p-5"}>
      {isLoading && <Spinner isSubmitting={isLoading} />}

      <div className="w-full">
        <div className="text-blue-900 text-2xl font-bold">
          {clientStatus} Client
        </div>
        <div className={`text-slate-400 text-[16px] font-normal mt-2`}>
          {clientStatus} the details of the Client below.
        </div>

        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="space-y-2">
            <div className="form-row">
              <InputField
                label="First Name"
                name="first_name"
                errors={errors}
                register={register}
                placeholder="Enter your first name"
                required
              />

              <InputField
                label="Last Name"
                name="last_name"
                errors={errors}
                register={register}
                placeholder="Enter your last name"
                required
              />
            </div>
            <div className="form-row">
              <InputField
                label="Email"
                name="email"
                errors={errors}
                register={register}
                placeholder="Enter email"
                required
              />

              <div className="flex-1 p-1">
                <label className="w-[650px] text-blue-900 text-md font-semibold leading-loose">
                  Phone Number
                </label>

                <PhoneInput
                  international
                  name="phone"
                  defaultCountry="US"
                  onChange={setPhoneNumber}
                  rules={{ required: true }}
                  className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-400 shadow-md rounded-md py-3 pl-9 pr-3 outline-none sm:text-sm"
                  value={phoneNumber}
                />
                {errors["phone"] && (
                  <span className="text-red-500 text-[12px]">
                    {errors["phone"].message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {!client && (
            <div className="form-row">
              <InputField
                type="password"
                label="Password"
                name="password"
                errors={errors}
                register={register}
                placeholder="Create password"
                required
              />

              <InputField
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                errors={errors}
                register={register}
                placeholder="Confirm password"
                required
              />
            </div>
          )}

          <div className="form-row">
            <div className="flex-1">
              <CustomSelect
                data={countries}
                label="Country"
                placeholder="Select country..."
                onChange={setCountry}
                initialValue={client?.country}
              />
              {errors["country"] && (
                <span className="text-red-500 text-[12px]">
                  {errors["country"].message}
                </span>
              )}
            </div>

            {!client ? (
              <InputField
                label="State"
                name="state"
                errors={errors}
                register={register}
                placeholder="Enter state"
              />
            ) : (
              <></>
            )}
          </div>

          {!client ? (
            <div className="form-row">
              <InputField
                label="City"
                name="city"
                errors={errors}
                register={register}
                placeholder="Enter city"
              />

              <InputField
                label="Street"
                name="street"
                errors={errors}
                register={register}
                placeholder="Enter street"
              />

              <InputField
                label="Zip"
                name="zip"
                errors={errors}
                register={register}
                placeholder="Enter zip"
              />
            </div>
          ) : (
            <></>
          )}

          <div className="flex justify-end mt-8">
            <button className="text-white text-md font-bold leading-loose bg-primary py-2 px-5 rounded-md">
              {clientStatus} Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientForm;
