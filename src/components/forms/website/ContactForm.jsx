import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import { useDispatch } from "react-redux";
import { z } from "zod";

import { setCompany } from "../../../app/feature/company/companySlice";
import { useCompanySelector } from "../../../hooks/useCompanySelector";
import useMutate from "../../../hooks/useMutate";
import InputField from "../../shared/InputField";
import { useWebsiteSelector } from "../../../hooks/useWebsiteSelector";
import { setWebsite } from "../../../app/feature/company/websiteSlice";

const schema = z.object({
  company_id: z.string().min(1, "Company ID is required"),
  contact_email_1: z.string().email(),
  contact_email_2: z.string().email().optional().or(z.literal("")),
  contact_phone_1: z.string().min(1, "Phone number is required."),
  contact_phone_2: z.union([z.string(), z.null()]),
  contact_address: z.string().min(1, "Address is required"),
});

function ContactForm({ setOpenModal }) {
  const { company } = useCompanySelector();
  const { website } = useWebsiteSelector();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_id: company.website_id,
      contact_email_1: website.contact_email_1,
      contact_email_2: website.contact_email_2,
      contact_phone_1: website.contact_phone_1,
      contact_phone_2: website.contact_phone_2,
      contact_address: website.company_address,
    },
    resolver: zodResolver(schema),
  });

  const dispatch = useDispatch();
  const { mutate } = useMutate(["update-contact"]);
  const submitHandler = (data) => {
    const toastId = toast.loading("Updating contact...");
    mutate(
      {
        url: "/website/contact/update",
        method: "PATCH",
        data,
      },
      {
        onSuccess(data) {
          dispatch(setWebsite(data.message));
          toast.dismiss(toastId);
          toast.success("Contact updated successfully");
          setOpenModal(false);
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
      <div className="">
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="bg-white w-full rounded-xl p-5">
            <h3 className="text-3xl font-bold text-blue-900 mb-5">
              Edit Contact
            </h3>
            <div className="space-y-5">
              <div className="w-full">
                <InputField
                  label="Email"
                  type="email"
                  placeholder="Email"
                  name="contact_email_1"
                  register={register}
                  errors={errors}
                  required
                />
              </div>
              <div className="w-full">
                <InputField
                  label="Email 2"
                  type="email"
                  placeholder="Email 2"
                  name="contact_email_2"
                  register={register}
                  errors={errors}
                />
              </div>
              <div className="w-full">
                <label className="w-[650px] text-blue-900 text-md font-semibold leading-loose">
                  Phone Number
                </label>

                <PhoneInputWithCountry
                  name="contact_phone_1"
                  control={control}
                  placeholder="Phone"
                  rules={{ required: true }}
                  className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-400 shadow-md rounded-md py-3 pl-9 pr-3 outline-none sm:text-sm"
                />
                {errors["phone"] && (
                  <span className="text-red-500 text-[12px]">
                    {errors["phone"].message}
                  </span>
                )}
              </div>
              <div className="w-full">
                <label className="w-[650px] text-blue-900 text-md font-semibold leading-loose">
                  Phone Number 2
                </label>

                <PhoneInputWithCountry
                  name="contact_phone_2"
                  control={control}
                  placeholder="Phone 2"
                  className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-400 shadow-md rounded-md py-3 pl-9 pr-3 outline-none sm:text-sm"
                  rules={{ require: false }}
                />
              </div>
              <div className="w-full">
                <InputField
                  label="Address"
                  placeholder="Address"
                  name="contact_address"
                  register={register}
                  errors={errors}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button className="text-white text-md font-bold leading-loose w-48 mt-5 h-12 py-5 bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex">
                Save Infomation
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;
