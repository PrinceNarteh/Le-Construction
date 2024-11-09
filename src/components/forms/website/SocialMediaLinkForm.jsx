import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCompany } from "../../../app/feature/company/companySlice";
import { useCompanySelector } from "../../../hooks/useCompanySelector";
import useMutate from "../../../hooks/useMutate";
import InputField from "../../shared/InputField";
import { setWebsite } from "../../../app/feature/company/websiteSlice";

function SocialMediaLinkForm({ closeModal }) {
  const { company } = useCompanySelector();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_id: company.website_id,
      name: "",
      link: "",
    },
  });

  const dispatch = useDispatch();
  const { mutate } = useMutate(["update-social-media-links"]);
  const submitHandler = (formData) => {
    const toastId = toast.loading(`Adding ${formData.name} Link...`);
    mutate(
      {
        url: "/website/socialmedia/links",
        method: "PATCH",
        data: formData,
      },
      {
        onSuccess(data) {
          dispatch(setWebsite(data.message));
          toast.dismiss(toastId);
          toast.success(`${formData.name} link added successfully!`);
          reset();
          closeModal();
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="mt-5">
        <h3 className="font-semibold text-blue-900 text-3xl">Social Media</h3>
      </div>
      <div className="bg-white w-full rounded-xl p-5">
        <div className="space-y-5">
          <div className="w-full">
            <InputField
              label="Social Media"
              name="name"
              errors={errors}
              register={register}
              placeholder="Social Media Name"
            />
          </div>
          <div className="w-full">
            <InputField
              label="Social Link"
              name="link"
              errors={errors}
              register={register}
              placeholder="Social Media Name"
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

export default SocialMediaLinkForm;
