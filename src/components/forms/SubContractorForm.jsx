import { zodResolver } from "@hookform/resolvers/zod";
import { AsYouType } from "libphonenumber-js";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import PhoneInput from "react-phone-number-input";
import { z } from "zod";

import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import "react-phone-number-input/style.css";
import { queryKeys } from "../../constants";
import useCountries from "../../hooks/useCountries";
import useFirebase from "../../hooks/useFirebase";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";
import { useUserSelector } from "../../hooks/useUserSelector";
import { convertBase64 } from "../../utils/convertBase64";
import CustomSelect from "../shared/CustomSelect";
import GoogleMaps from "../shared/GoogleMaps";
import InputField from "../shared/InputField";
import Modal from "../shared/Modal";
import AddBuildersGroupForm from "./AddBuildersGroupForm";

const schema = (builder) => {
  const schema = z.object({
    f_name: z.string().min(1, "First name is required"),
    l_name: z.string().min(1, "Last name is required"),
    email: z.string().email(),
    phone: z.string().min(1, "Phone number is required"),
    approved: z.boolean().default(false),
    user_type: z.string().min(1, "User type is required/"),
    company_id: z.string().min(1, "Company ID is required"),
    profile_image: z.any().optional(),
    group_id: z.string().min(1, "Please select group"),
    country_code: z.string().min(1, "Please select your country code"),

    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().min(1, "Please select your country"),
    lat: z.string(),
    long: z.string(),
    zip: z.string().optional(),

    ssn_last_4: z
      .string()
      .max(4, "Enter Last 4 Digits Of Social Security Number"),
    dob: z.string(),
  });

  if (!builder) {
    return schema
      .extend({
        password: z.string().min(5, "Password should be at least 5 characters"),
        confirmPassword: z.string().min(5, "Confirm password is required"),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"], // path of error
      });
  }

  return schema;
};

function SubContractorForm({ builder = null, closeModal }) {
  const { requestForToken } = useFirebase();
  const { user } = useUserSelector();
  const queryClient = useQueryClient();
  const [profileImage, setProfileImage] = useState(null);

  const {
    clearErrors,
    setValue,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: builder
      ? {
          //...builder,
          f_name: builder.f_name,
          l_name: builder.l_name,
          email: builder.email,
          dob: builder.dob,
          country: builder.country,
          country_code: builder.country_code,
          ssn_last_4: builder.ssn_last_4,
          builder_id: builder?._id,
          lat: builder?.address?.lat,
          long: builder?.address?.long,
          group_id: builder?.group._id,

          phone: builder.phone,
          approved: true,
          user_type: builder.user_type,
          company_id: builder.company_id,

          street: builder.street,
          city: builder.city,
          state: builder.state,
          zip: builder.zip,
        }
      : {
          f_name: "",
          l_name: "",
          email: "",
          phone: "",
          profile_image: "",
          country: "",
          country_code: "",
          approved: false,
          company_id:
            user.user_type === "company" ? user._id : user.company._id,
          group_id: "",
          user_type: "Builder",

          street: "",
          city: "",
          state: "",
          lat: "",
          long: "",
          zip: "",
          password: "",
          confirmPassword: "",
          ssn_last_4: "",
          dob: "",
        },
    resolver: zodResolver(schema(builder)),
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [groupId, setGroupId] = useState("");
  const [country, setCountry] = useState("");
  const [preview, setPreview] = useState("");
  const [fcm_token, setFcmToken] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [run, setRun] = useState(true);

  // Get Countries
  const { countries } = useCountries({
    fieldName: "country",
    fieldValue: country,
    setValue,
    clearErrors,
  });

  const [selectedLocation, setSelectedLocation] = useState({
    country: builder ? builder.country : "",
    street: builder ? builder.street : "",
    city: builder ? builder.city : "",
    state: builder ? builder.state : "",
    lat: builder ? builder.lat : 0,
    lng: builder ? builder.long : 0,
    zip: builder ? builder.zip_code : "",
  });

  useEffect(() => {
    const selectCountry = () => {
      if (!phoneNumber) return;
      const asYouType = new AsYouType();
      asYouType.input(phoneNumber);
      if (asYouType.country) {
        setValue("country_code", asYouType.formattedOutput.split(" ")[0]);
        setValue("phone", phoneNumber);
      } else {
        setValue("country_code", "");
        setValue("phone", "");
      }
    };

    selectCountry();
  }, [phoneNumber, setValue]);

  useEffect(() => {
    if (profileImage) {
      convertBase64(profileImage).then((res) => setPreview(res));
    }
  }, [profileImage]);

  useEffect(() => {
    if (builder) {
      setPreview(builder?.profile_image);
      setPhoneNumber(builder?.phone);
    }
  }, [builder]);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  const { data: buildersGroups, isLoading: buildersGroupsLoading } =
    usePostQuery({
      queryKey: [queryKeys.BuildersGroups],
      url: "/builder/groups",
    });
  const buildersGroupsData = buildersGroups?.message
    ? buildersGroups?.message.map((group) => ({
        id: group._id,
        label: group.group_name,
      }))
    : [];

  const { mutate } = useMutate([
    builder ? queryKeys.CreateBuilder : queryKeys.UpdateBuilder,
  ]);
  const submitHandler = async (data) => {
    const formData = new FormData();

    // Check if user has selected location from map
    if (selectedLocation.lat === 0 && selectedLocation.lng === 0) {
      alert.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a location from the map",
      });
      return;
    }

    // Update data with selected location details
    data.street = selectedLocation.street;
    data.city = selectedLocation.city;
    data.state = selectedLocation.state;
    data.zip_code = selectedLocation.zip;
    data.lat = selectedLocation.lat;
    data.long = selectedLocation.lng;
    //data.fcm_token = fcm_token;

    // Set builder_id if builder exists
    if (builder) {
      data["builder_id"] = builder._id;
    }

    // If builder exists, re-append all entries to formData
    if (builder) {
      delete data.profile_image;
      // Clear all formData entries
      Array.from(formData.keys()).forEach((key) => formData.delete(key));

      // Append updated data to formData
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append profile_image again if it exists
      //if (profileImage) {
        //console.log(profileImage);
        //formData.append("profile_image", profileImage);
      //}

      // const values = Array.from(formData.values());
      // console.log(values)
      // Debugging: Log formData entries again after re-append
      // for (let [key, value] of formData.entries()) {
      //     console.log(`${key}: ${value}`);
      // }
    } else {
      // Append data to formData
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Debugging: Log formData entries
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}: ${value}`);
      // }

      // Append profile_image if it exists
      if (!builder && profileImage) {
        formData.append("profile_image", profileImage);
      }
    }

    const toastId = toast.loading(
      `${builder ? "Updating" : "Creating"} sub-contractor...`
    );

    mutate(
      {
        url: `/builder/${builder ? "profile/update" : "new"}`,
        method: builder ? "PATCH" : "POST",
        data: formData,
        multipart: true,
      },
      {
        async onSuccess(data) {
          await queryClient.setQueryData([queryKeys.Builders], (oldData) => {
            if (builder) {
              return {
                message: (oldData?.message ?? []).map((item) => {
                  if (item._id === data.message._id) {
                    return data.message;
                  }
                  return item;
                }),
              };
            } else {
              return {
                message: [data.message, ...(oldData?.message ?? [])],
              };
            }
          });
          toast.dismiss(toastId);
          toast.success(
            `Sub-Contractor ${builder ? "updated" : "added"} successfully`
          );
          closeModal();
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      }
    );
  };

  useEffect(() => {
    if (run) {
      const getFcmToken = async () => {
        const token = await requestForToken();
        setFcmToken(token);
        setRun(false);
      };
      getFcmToken();
    }
  }, [requestForToken, run]);

  useEffect(() => {
    if (groupId) {
      setValue("group_id", groupId);
      clearErrors("group_id");
    }
  }, [groupId, setValue, clearErrors]);

  return (
    <div className="p-5">
      {/* <Spinner isSubmitting={isLoading} /> */}

      <div className="w-full">
        <div className=" text-blue-900 text-2xl font-bold">
          Add Sub Contractor
        </div>
        <div className=" text-slate-400 text-[16px] font-normal mt-2">
          Add the details of the Sub Contractor below.
        </div>

        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="bg-white rounded-xl mb-5">
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
            </div>

            <div className="form-row">
              <InputField
                label="Email"
                name="email"
                errors={errors}
                placeholder="Enter email"
                register={register}
                required
              />

              <div className=" flex-1 p-1">
                <label className="w-[650px] text-blue-900 text-md font-semibold leading-loose">
                  Phone Number
                </label>

                <PhoneInput
                  international
                  name="phone"
                  defaultCountry="US"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  rules={{ required: true }}
                  className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-400 shadow-md rounded-md py-3 pl-9 pr-3 outline-none sm:text-sm"
                />
                {errors["phone"] && (
                  <span className="text-red-500 text-[12px]">
                    {errors["phone"].message}
                  </span>
                )}
              </div>
            </div>

            <div className="form-row">
              <InputField
                label="Social Security - (Last 4 Digit)"
                name="ssn_last_4"
                placeholder="Last 4 Digits Of Your Social Security Number"
                register={register}
                errors={errors}
              />

              <InputField
                label="Date Of Birth"
                type="date"
                name="dob"
                placeholder="Enter Date Of Birth"
                errors={errors}
                register={register}
              />
            </div>

            {!builder && (
              <div className="form-row">
                <InputField
                  type="password"
                  label="Password"
                  name="password"
                  errors={errors}
                  placeholder="Create password"
                  register={register}
                  required
                />

                <InputField
                  type="password"
                  label="Confirm Password"
                  name="confirmPassword"
                  errors={errors}
                  placeholder="Confirm password"
                  register={register}
                  required
                />
              </div>
            )}

            <div className="form-row">
              <div className="flex-1">
                <CustomSelect
                  label="Group"
                  placeholder="Select Group"
                  data={buildersGroupsData}
                  onChange={setGroupId}
                  loading={buildersGroupsLoading}
                  initialValue={builder?.group?._id}
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
                {errors["group_id"] && (
                  <span className="text-red-500 text-[12px]">
                    {errors["group_id"].message}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <CustomSelect
                  data={countries}
                  label="Country"
                  placeholder="Select country..."
                  onChange={setCountry}
                  initialValue={builder?.address?.country}
                />
                {errors["country"] && (
                  <span className="text-red-500 text-[12px]">
                    {errors["country"].message}
                  </span>
                )}
              </div>

            </div>

            <div className="form-row">
              <GoogleMaps
                lat={builder ? builder.lat : 0.0}
                lng={builder ? builder.long : 0.0}
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
                value={
                  builder ? builder.city :
                  selectedLocation?.city === "undefined"
                    ? ""
                    : selectedLocation?.city
                }
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
                value={
                  builder ? builder.state :
                  selectedLocation?.state === "undefined"
                    ? ""
                    : selectedLocation?.state
                }
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
                value={
                  builder ? builder.zip_code :
                  selectedLocation?.zip === "undefined"
                    ? ""
                    : selectedLocation?.zip
                }
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
                value={
                  builder ? builder.street :
                  selectedLocation?.street === "undefined"
                    ? ""
                    : selectedLocation?.street
                }
                onChange={(e) => {
                  setSelectedLocation((prev) => ({
                    ...prev,
                    street: e.target.value,
                  }));
                  setValue("street", e.target.value);
                }}
              />
            </div>

            <div className="flex-1 mt-4">
              <label className="text-blue-900 text-md font-semibold leading-loose ">
                Upload your profile picture
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
                      setProfileImage(e.target.files[0]);
                      setValue("profile_photo", e.target.files[0]);
                    }}
                    accept="image/png, image/jpeg, image/jpg"
                  />
                </label>
                {errors["profile_photo"] && (
                  <span className="text-red-500 text-[12px]">
                    {errors["profile_photo"].message}
                  </span>
                )}
              </div>
            </div>

            <div className="w-60 h-12 py-5 bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex mt-5">
              <button className="text-white text-md font-bold leading-loose">
                {builder ? "Update" : "Add"} Sub Contractor
              </button>
            </div>
          </div>
        </form>
      </div>

      <Modal openModal={openForm} closeModal={setOpenForm}>
        <AddBuildersGroupForm setOpenModal={setOpenForm} />
      </Modal>
    </div>
  );
}

export default SubContractorForm;
