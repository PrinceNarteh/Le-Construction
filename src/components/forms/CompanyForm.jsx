import { zodResolver } from "@hookform/resolvers/zod";
import { AsYouType } from "libphonenumber-js";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { useQueryClient } from "@tanstack/react-query";
import "react-phone-number-input/style.css";
import { z } from "zod";

import toast from "react-hot-toast";
import GoogleMaps from "../../components/shared/GoogleMaps";
import { queryKeys } from "../../constants";
import useAlert from "../../hooks/useAlert";
import useCountries from "../../hooks/useCountries";
import useMutate from "../../hooks/useMutate";
import { convertBase64 } from "../../utils/convertBase64";
import Spinner from "../Spinner";
import CustomSelect from "../shared/CustomSelect";
import InputField from "../shared/InputField";

const schema = (company) => {
  const schema = z.object({
    company_name: z.string().min(1, "Company name is required"),
    email: z.string().email(),
    phone_number: z.string().min(1, "Please enter a phone number"),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country_id: z.string().min(1, "Please select your country"),
    lat: z.string(),
    long: z.string(),
    company_logo: z.any(),
    zip: z.string().optional(),
  });

  if (!company) {
    return schema
      .extend({
        password: z.string().min(5, "Passwords must be at least 5 characters"),
        confirmPassword: z.string().min(5, "Please confirm your password"),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"], // path of error
      });
  }

  return schema;
};

const defaultValues = {
  company_name: "",
  email: "",
  phone_number: "",
  password: "",
  confirmPassword: "",
  street: "",
  city: "",
  state: "",
  country_id: "",
  lat: "",
  long: "",
  company_logo: "",
  zip: "",
};

function CompanyForm({ company = null, handleDetails, setOpenCompanyForm }) {
  const alert = useAlert();
  const [selectedLocation, setSelectedLocation] = useState({
    lat: company ? company.address?.lat : 0,
    lng: company ? company.address?.long : 0,
    country: company ? company.address?.country : "",
    city: company ? company.address?.city : "",
    state: company ? company.address?.state : "",
    street: company ? company.address?.street : "",
  });
  const {
    register,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: company
      ? {
          //...company,
          company_id: company._id,
          street: company?.address.street,
          city: company?.address.city,
          phone_number: company.phone_number,
          state: company?.address.state,
          country: company?.address.country,
          lat: company?.address.lat,
          long: company?.address.long,
          company_logo: company?.company_logo,
          zip: company?.address.zip,
        country_id: company?.company_settings?.country?._id,
          
        company_name: company?.company_name,
        email: company?.email,
        }
      : defaultValues,
    //resolver: zodResolver(schema(company)),
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [preview, setPreview] = useState("");
  const [logo, setLogo] = useState(null);
  const [country, setCountry] = useState("");

  // Get Countries
  const { countries, isLoading: loadingCountries } = useCountries({
    fieldName: "country_id",
    fieldValue: country,
    setValue,
    clearErrors,
  });

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutate([
    company ? queryKeys.UpdateCompany : queryKeys.CreateCompany,
  ]);
  const submitHandler = async (data) => {
    //console.log("data:::", data);
    if (selectedLocation.lat === 0 && selectedLocation.lng === 0) {
      alert.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a location from the map",
      });
      return;
    }

    if (data.street === "") {
      data.street = selectedLocation.street;
      data.city = selectedLocation.city;
      data.state = selectedLocation.state;
      data.lat = selectedLocation.lat;
      data.long = selectedLocation.lng;
    } else {
      data.lat = selectedLocation.lat;
      data.long = selectedLocation.lng;
    }

    const formData = new FormData();

    if (company) {
      Array.from(formData.keys()).forEach((key) => formData.delete(key));
      // Append updated data to formData
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}: ${value}`);
      // }
    } else {
      formData.append("company_id", company._id);
      Object.entries(data).forEach((entry) => formData.append(...entry));
      if (!company && logo) {
        formData.append("company_logo", logo);
      }
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}: ${value}`);
      // }
    }

    mutate(
      {
        url: `/company/${company ? "profile/update" : "new"}`,
        data: formData,
        method: company ? "PATCH" : "POST",
        multipart: true,
      },
      {
        async onSuccess(data) {
          if (company) {
            await queryClient.setQueryData([queryKeys.Companies], (oldData) => {
              return {
                message: (oldData?.message ?? []).map((item) => {
                  if (item._id === company._id) {
                    return data.message;
                  }
                  return item;
                }),
              };
            });
          } else {
            await queryClient.setQueryData([queryKeys.Companies], (oldData) => {
              return {
                message: [data.message, ...(oldData?.message ?? [])],
              };
            });
          }

          toast.success("Company added successfully");
          setOpenCompanyForm(false);
          handleDetails(data.message);
        },
        onError(error) {
          toast.error(error.response.data.message.message);
        },
      }
    );
  };

  useEffect(() => {
    if (company) {
      setPhoneNumber(company.phone_number);
    }
  }, [company]);

  useEffect(() => {
    const selectCountry = () => {
      if (!phoneNumber) return;
      const asYouType = new AsYouType();
      asYouType.input(phoneNumber);
      if (asYouType.country) {
        setValue("country_code", asYouType.formattedOutput.split(" ")[0]);
        setValue("phone_number", phoneNumber);
      } else {
        setValue("country_code", "");
        setValue("phone_number", "");
      }
    };

    selectCountry();
  }, [phoneNumber, setValue]);

  useEffect(() => {
    if (logo) {
      convertBase64(logo).then((res) => setPreview(res));
    }
  }, [logo]);

  useEffect(() => {
    if (company?.company_logo) {
      setPreview(company?.company_logo);
    }
  }, [company?.company_logo, setPreview]);

  useEffect(() => {
    if (company) {
      setPreview(company?.brand?.company_logo);
    }
  }, [company]);

  return (
    <div>
      <Spinner isSubmitting={isLoading} />

      <div className="p-5">
        <div className=" text-blue-900 text-2xl font-bold">{`${
          company ? "Update company Info" : "Add company"
        }`}</div>
        <div className=" text-slate-400 text-[16px] font-normal mt-2">
          {`${company ? "Update" : "Add"} the details of the company below.`}
        </div>

        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="bg-white rounded-xl">
            <div className="bg-white overflow-y-auto">
              <div className="form-row">
                <InputField
                  label="Company Name"
                  name="company_name"
                  placeholder="Enter your company's name"
                  errors={errors}
                  register={register}
                  required
                />
                <InputField
                  label="Email"
                  name="email"
                  placeholder="Enter company's email address"
                  errors={errors}
                  register={register}
                  required
                />
              </div>

              {!company && (
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
                <div className=" flex-1 p-1">
                  <label className="w-[650px] text-blue-900 text-md font-semibold leading-loose">
                    Phone Number
                  </label>

                  <PhoneInput
                    international
                    name="phone_number"
                    defaultCountry="US"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    rules={{ required: true }}
                    className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-400 shadow-md rounded-md py-3 pl-9 pr-3 outline-none sm:text-sm"
                    style={{ outline: "solid transparent" }}
                  />
                  {errors["phone_number"] && (
                    <span className="text-red-500 text-[12px]">
                      {errors["phone_number"].message}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <CustomSelect
                    label="Country"
                    placeholder="Select country..."
                    data={countries}
                    onChange={setCountry}
                    loading={loadingCountries}
                    initialValue={company?.company_settings?.country?._id}
                  />
                  {errors["country_id"] && (
                    <span className="text-red-500 text-[12px]">
                      {errors["country_id"].message}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <GoogleMaps
                  lat={company?.address?.lat ?? 0}
                  lng={company?.address?.long ?? 0}
                  onLocationChange={handleLocationChange}
                />
              </div>

              <div className="form-row">
                <InputField
                  label="City"
                  name="city"
                  placeholder="Enter City"
                  errors={errors}
                  register={register}
                  value={selectedLocation?.city}
                  onChange={(e) => {
                    setSelectedLocation((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }));
                    setValue("city", e.target.value);
                  }}
                />

                <InputField
                  label="State"
                  name="state"
                  placeholder="Enter state"
                  errors={errors}
                  register={register}
                  value={selectedLocation?.state}
                  onChange={(e) => {
                    setSelectedLocation((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }));
                    setValue("state", e.target.value);
                  }}
                />
              </div>

              <div className="form-row">
                <InputField
                  label="Zip"
                  name="zip"
                  placeholder="Zip Code"
                  errors={errors}
                  register={register}
                  onChange={(e) => {
                    setSelectedLocation((prev) => ({
                      ...prev,
                      zip: e.target.value,
                    }));
                    setValue("zip", e.target.value);
                  }}
                />

                <InputField
                  label="Street"
                  name="street"
                  placeholder="Enter street"
                  errors={errors}
                  register={register}
                  value={selectedLocation?.street}
                  onChange={(e) => {
                    setSelectedLocation((prev) => ({
                      ...prev,
                      street: e.target.value,
                    }));
                    setValue("street", e.target.value);
                  }}
                />
              </div>

              <div className="items-center justify-center w-full mt-4">
                <label className="text-blue-900 text-md font-semibold leading-loose ">
                  Upload your logo
                </label>
                <div className="flex flex-col items-center gap-5 mt-2 md:flex-row">
                  {preview && (
                    <div className="h-40 w-full md:w-60 flex justify-center border-2 shrink-0 border-orange-300 border-dashed rounded-lg overflow-hidden">
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
                      accept="image/png, image/gif, image/jpeg"
                    />
                  </label>
                  {errors["company_logo"] && (
                    <span className="text-red-500 text-[12px]">
                      {errors["company_logo"].message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button className="text-white bg-primary px-10 py-2 rounded-md mt-5 text-md font-bold leading-loose">
              {`${company ? "Update" : "Add"} Company`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default CompanyForm;
