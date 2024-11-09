import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { z } from "zod";

import { setCompany } from "../../../app/feature/company/companySlice";
import { useCompanySelector } from "../../../hooks/useCompanySelector";
import useMutate from "../../../hooks/useMutate";
import Heading from "../../layout/Heading";
import InputField from "../../shared/InputField";
import { useWebsiteSelector } from "../../../hooks/useWebsiteSelector";
import { setWebsite } from "../../../app/feature/company/websiteSlice";

const schema = z.object({
  company_id: z.string().min(1, "Company ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.any(),
});

function FeaturesForm({ feature, closeModal }) {
  const { company } = useCompanySelector();
  const [featuresImage, setFeaturesImage] = useState(null);
  const [previewFeaturesImage, setPreviewFeaturesImage] = useState(null);
  const { website } = useWebsiteSelector();
  const dispatch = useDispatch();

  const {
    handleSubmit: handleFeaturesSubmit,
    formState: { errors: featuresErrors },
    register: featuresRegister,
  } = useForm({
    defaultValues: {
      company_id: company.website_id,
      title: feature?.title || "",
      description: feature?.description || "",
      icon: null,
    },
    resolver: zodResolver(schema),
  });

  const featuresMutation = useMutate(["about-us-features"]);
  const featuresSubmit = (data) => {
    const toastId = toast.loading("Updating info....");
    const formData = new FormData();
    Object.entries(data).forEach((item) => {
      formData.append(...item);
    });
    formData.append("icon", featuresImage);

    featuresMutation.mutate(
      {
        url: "/website/about/features",
        method: "PATCH",
        data: formData,
        multipart: true,
      },
      {
        onSuccess(data) {
          dispatch(setWebsite(data.message));
          toast.dismiss(toastId);
          toast.success("About Features updated successfully");
          closeModal(false);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      }
    );
  };

  useEffect(() => {
    if (feature) {
      setPreviewFeaturesImage(feature.icon);
    }
  }, [feature]);

  return (
    <form className="px-7" onSubmit={handleFeaturesSubmit(featuresSubmit)}>
      <div className="mt-5">
        <Heading label="About Us Features" />
      </div>
      <div className="bg-white w-full rounded-xl p-5 mt-4">
        <div className="space-y-5">
          <div className="w-full">
            <InputField
              name="title"
              label="Title"
              errors={featuresErrors}
              register={featuresRegister}
              required
            />
          </div>
          <div className="w-full">
            <InputField
              name="description"
              label="Description"
              errors={featuresErrors}
              register={featuresRegister}
              required
            />
          </div>
          <div className="w-full">
            {previewFeaturesImage && (
              <div className="relative h-32 w-32 mx-auto shrink-0 rounded-md bg-slate-500">
                {featuresImage && (
                  <AiOutlineCloseCircle
                    onClick={() => {
                      if (website?.header_section_image) {
                        setFeaturesImage(null);
                        setPreviewFeaturesImage(website?.header_section_image);
                      } else {
                        setFeaturesImage(null);
                      }
                    }}
                    className="absolute -right-2 -top-2 z-10 cursor-pointer rounded-full bg-white text-2xl text-orange-500"
                  />
                )}
                <div className="overflow-hidden">
                  <img
                    src={previewFeaturesImage}
                    style={{ objectFit: "cover" }}
                    alt=""
                    className="w-32 h-32 rounded object-cover"
                  />
                </div>
              </div>
            )}
            <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
              Upload Icon
            </label>
            <input
              className="block w-full cursor-pointer font-normal rounded-lg border bg-dark-gray file:border-none file:bg-primary file:px-5 file:py-3 file:text-white"
              aria-describedby="user_avatar_help"
              id="user_avatar"
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={(e) => setFeaturesImage(e.target.files[0])}
            />
          </div>
        </div>

        <div className="flex gap-5 justify-end mr-5">
          <div className="w-48 mt-5 h-12 py-5 bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex">
            <button className="text-white text-md font-bold leading-loose">
              Save Infomation
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default FeaturesForm;
