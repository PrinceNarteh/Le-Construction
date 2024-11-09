import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AiOutlineCloseCircle } from "react-icons/ai";
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
  about_us_title: z.string().min(1, "Title is required"),
  about_us_description: z.string().min(1, "Description is required"),
  about_us_media: z.any(),
});

function AboutUsForm({ setOpenAboutForm }) {
  const { company } = useCompanySelector();
  const { website } = useWebsiteSelector();
  const [infoImage, setInfoImage] = useState(null);
  const [previewInfoImage, setPreviewInfoImage] = useState(null);

  const dispatch = useDispatch();

  // About Us Info
  const {
    handleSubmit: handleInfoSubmit,
    formState: { errors: infoErrors },
    register: infoRegister,
  } = useForm({
    defaultValues: {
      company_id: company?.website_id,
      about_us_title: website?.about_us_title,
      about_us_description: website?.about_us_description,
      about_us_media: website?.header_section_image,
    },
    resolver: zodResolver(schema),
  });

  const infoMutation = useMutate(["about-us-info"]);

  const infoSubmit = (data) => {
    const toastId = toast.loading("Updating info....");
    const formData = new FormData();

    formData.append("company_id", data.company_id);
    formData.append("about_us_title", data.about_us_title);
    formData.append("about_us_description", data.about_us_description);

    if (infoImage) {
      formData.append("about_us_media", infoImage);
    }

    infoMutation.mutate(
      {
        url: "/website/about/info",
        method: "PATCH",
        data: formData,
        multipart: true,
      },
      {
        onSuccess(data) {
          dispatch(setWebsite(data.message));
          toast.dismiss(toastId);
          toast.success("Header info updated successfully");
          setOpenAboutForm(false);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      }
    );
  };

  return (
    <form className="px-7" onSubmit={handleInfoSubmit(infoSubmit)}>
      <div className="bg-white w-full rounded-xl p-5">
        <h3 className="text-3xl font-bold text-blue-900 mb-5">Edit About US</h3>
        <div className="space-y-5">
          <div className="w-full">
            <InputField
              name="about_us_title"
              label="About Us Title"
              errors={infoErrors}
              register={infoRegister}
              required
            />
          </div>
          <div className="w-full">
            <InputField
              name="about_us_description"
              label="About Us Description"
              errors={infoErrors}
              register={infoRegister}
              required
            />
          </div>
          <div className="w-full">
            {previewInfoImage && (
              <div className="relative h-32 w-32 shrink-0 rounded-md bg-slate-500">
                {infoImage && (
                  <AiOutlineCloseCircle
                    onClick={() => {
                      if (website?.header_section_image) {
                        setInfoImage(null);
                        setPreviewInfoImage(website?.header_section_image);
                      } else {
                        setInfoImage(null);
                      }
                    }}
                    className="absolute -right-2 -top-2 z-10 cursor-pointer rounded-full bg-white text-2xl text-orange-500"
                  />
                )}
                <div className="overflow-hidden">
                  <img
                    src={previewInfoImage}
                    style={{ objectFit: "cover" }}
                    alt=""
                    className="w-32 h-32 rounded object-cover"
                  />
                </div>
              </div>
            )}
            <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
              About Us Image
            </label>
            <input
              className="block w-full cursor-pointer font-normal rounded-lg border bg-dark-gray file:border-none file:bg-primary file:px-5 file:py-3 file:text-white"
              aria-describedby="user_avatar_help"
              id="user_avatar"
              type="file"
              multiple
              onChange={(e) => setInfoImage(e.target.files[0])}
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

export default AboutUsForm;
