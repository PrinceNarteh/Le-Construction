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

const experienceSchema = z.object({
  company_id: z.string().min(1, "Company ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.any(),
});

function ExperienceForm({ experience, closeModal }) {
  const { company } = useCompanySelector();
  const [experienceImage, setExperienceImage] = useState(null);
  const [previewExperienceImage, setPreviewExperienceImage] = useState(null);
  const { website } = useWebsiteSelector();
  const dispatch = useDispatch();

  // About Us Experience
  const {
    handleSubmit: handleExperienceSubmit,
    formState: { errors: experienceErrors },
    register: experienceRegister,
  } = useForm({
    defaultValues: {
      company_id: company?.website_id,
      title: experience?.title || "",
      description: experience?.description || "",
      image: experience?.image || "",
    },
    resolver: zodResolver(experienceSchema),
  });

  const experienceMutation = useMutate(["about-us-experience"]);
  const experienceSubmit = (data) => {
    const toastId = toast.loading("Updating info....");
    const formData = new FormData();
    Object.entries(data).forEach((item) => {
      formData.append(...item);
    });
    formData.append("image", experienceImage);

    experienceMutation.mutate(
      {
        url: "/website/about/experience",
        method: "PATCH",
        data: formData,
        multipart: true,
      },
      {
        onSuccess(data) {
          dispatch(setCompany(data.message));
          toast.dismiss(toastId);
          toast.success("About Experience updated successfully");
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
    if (experience) {
      setPreviewExperienceImage(experience?.image);
    }
  }, [experience]);

  return (
    <form className="px-7" onSubmit={handleExperienceSubmit(experienceSubmit)}>
      <div className="mt-5">
        <Heading label="About Us Experience" />
      </div>
      <div className="bg-white w-full rounded-xl p-5 mt-4">
        <div className="space-y-5">
          <div className="w-full">
            <InputField
              name="title"
              label="Title"
              errors={experienceErrors}
              register={experienceRegister}
              required
            />
          </div>
          <div className="w-full">
            <InputField
              name="description"
              label="Description"
              errors={experienceErrors}
              register={experienceRegister}
              required
            />
          </div>
          <div className="w-full">
            {previewExperienceImage && (
              <div className="relative h-32 w-32 mx-auto shrink-0 rounded-md bg-slate-500">
                {experienceImage && (
                  <AiOutlineCloseCircle
                    onClick={() => {
                      if (website?.header_section_image) {
                        setExperienceImage(null);
                        setPreviewExperienceImage(
                          website?.header_section_image
                        );
                      } else {
                        setExperienceImage(null);
                      }
                    }}
                    className="absolute -right-2 -top-2 z-10 cursor-pointer rounded-full bg-white text-2xl text-orange-500"
                  />
                )}
                <div className="overflow-hidden">
                  <img
                    src={previewExperienceImage}
                    style={{ objectFit: "cover" }}
                    alt=""
                    className="w-32 h-32 rounded object-cover"
                  />
                </div>
              </div>
            )}
            <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
              Image
            </label>
            <input
              className="block w-full cursor-pointer font-normal rounded-lg border bg-dark-gray file:border-none file:bg-primary file:px-5 file:py-3 file:text-white"
              aria-describedby="user_avatar_help"
              id="user_avatar"
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={(e) => setExperienceImage(e.target.files[0])}
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

export default ExperienceForm;
