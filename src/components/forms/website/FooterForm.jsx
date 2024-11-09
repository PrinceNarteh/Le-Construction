import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { z } from "zod";

import { setCompany } from "../../../app/feature/company/companySlice";
import { useCompanySelector } from "../../../hooks/useCompanySelector";
import useMutate from "../../../hooks/useMutate";
import { useWebsiteSelector } from "../../../hooks/useWebsiteSelector";
import { setWebsite } from "../../../app/feature/company/websiteSlice";

function FooterForm() {
  const { company } = useCompanySelector();
  const { website } = useWebsiteSelector();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_id: company?.website_id,
      footer_section_description: website?.footer_section_description,
    },
    resolver: zodResolver(
      z.object({
        company_id: z.string().min(1, "Company ID is required"),
        footer_section_description: z
          .string()
          .min(1, "Description is required."),
      })
    ),
  });

  const dispatch = useDispatch();
  const { mutate } = useMutate(["create-footer"]);
  const submitHandler = (data) => {
    console.log(data);
    const toastId = toast.loading("Updating footer description info...");
    mutate(
      {
        url: "/website/footer/update",
        method: "PATCH",
        data,
      },
      {
        onSuccess(data) {
          dispatch(setWebsite(data.message));
          toast.dismiss(toastId);
          toast.success("Footer description updated successfully");
        },
        onError(error) {
          console.log({ error });
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
          <div className="mt-5">
            <h3 className="font-semibold text-blue-900 text-3xl">
              Footer Section
            </h3>
          </div>
          <div className="bg-white w-full rounded-xl p-5 mt-4">
            <div className="w-full">
              <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                Footer Description
              </label>
              <textarea
                type="text"
                placeholder="Footer Description"
                className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 rounded-md py-3 pl-9 pr-3 sm:text-sm"
                {...register("footer_section_description")}
              />
              {errors["footer_section_description"] && (
                <span className="text-red-500 text-[12px]">
                  {errors["footer_section_description"].message}
                </span>
              )}
            </div>
            <div className="flex gap-5 justify-end">
              <div className="w-48 mt-5 h-12 py-5 bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex">
                <button className="text-white text-md font-bold leading-loose">
                  Save Infomation
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FooterForm;
