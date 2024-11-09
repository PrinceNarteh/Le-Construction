import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { setCompany } from "../../../app/feature/company/companySlice";
import { useCompanySelector } from "../../../hooks/useCompanySelector";
import useMutate from "../../../hooks/useMutate";
import { convertBase64 } from "../../../utils/convertBase64";
import InputField from "../../shared/InputField";
import { setWebsite } from "../../../app/feature/company/websiteSlice";

function TeamForm({ closeModal }) {
  const { company } = useCompanySelector();
  const inputRef = useRef();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_id: company.website_id,
      designation: "",
      name: "",
      facebook_link: "",
      instagram_link: "",
      linkedin_link: "",
      twitter_link: "",
      profile_image: "",
    },
  });

  const dispatch = useDispatch();
  const { mutate } = useMutate(["add-team-member"]);
  const submitHandler = (data) => {
    console.log(data);
    const toastId = toast.loading("Adding Team Member...");
    const formData = new FormData();
    Object.entries(data).forEach((item) => {
      formData.append(...item);
    });

    if (image) {
      formData.append("profile_image", image);
    }

    mutate(
      {
        url: "/website/about/team",
        method: "PATCH",
        data: formData,
        multipart: true,
      },
      {
        onSuccess(data) {
          console.log(data);
          dispatch(setWebsite(data.message));
          toast.dismiss(toastId);
          toast.success("Team Member Added Successfully!");
          closeModal(false);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.message);
        },
      }
    );
  };

  useEffect(() => {
    if (image) {
      convertBase64(image).then((res) => setPreview(res));
    } else {
      if (inputRef.current?.value) inputRef.current.value = null;
      setPreview(null);
    }
  }, [image]);

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="bg-white w-full rounded-xl p-5">
        <h3 className="text-3xl font-bold text-blue-900 mb-5">
          Add Team Member
        </h3>
        <div className="space-y-5">
          <div className="w-full">
            <InputField
              label="Member Name"
              name="name"
              placeholder="Member Name"
              errors={errors}
              register={register}
              required
              errorMessage="Team member name is required"
            />
          </div>
          <div className="w-full">
            <InputField
              label="Member Designation"
              name="designation"
              placeholder="Position"
              errors={errors}
              register={register}
              required
              errorMessage="Team position name is required"
            />
          </div>
          <div className="w-full">
            <InputField
              label="Facebook Link"
              name="facebook_link"
              placeholder="Facebook Link"
              errors={errors}
              register={register}
            />
          </div>
          <div className="w-full">
            <InputField
              label="Instagram Link"
              name="instagram_link"
              placeholder="Instagram Link"
              errors={errors}
              register={register}
            />
          </div>
          <div className="w-full">
            <InputField
              label="LinkedIn Link"
              name="linkedin_link"
              placeholder="Linkedin Link"
              errors={errors}
              register={register}
            />
          </div>
          <div className="w-full">
            <InputField
              label="Twitter Link"
              name="twitter_link"
              placeholder="Twitter Link"
              errors={errors}
              register={register}
            />
          </div>
          <div className="w-full">
            <div className="flex justify-center">
              {preview && (
                <div className="relative h-32 w-32 shrink-0 rounded-md bg-slate-500">
                  <AiOutlineCloseCircle
                    onClick={() => setImage(null)}
                    className="absolute -right-2 -top-2 z-10 cursor-pointer rounded-full bg-white text-2xl text-orange-500"
                  />

                  <div className="overflow-hidden">
                    <img
                      src={preview}
                      style={{ objectFit: "cover" }}
                      alt=""
                      className="w-32 h-32 rounded object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
              Profile Image
            </label>
            <input
              ref={inputRef}
              className="block w-full cursor-pointer font-normal rounded-lg border bg-dark-gray file:border-none file:bg-primary file:px-5 file:py-3 file:text-white"
              aria-describedby="user_avatar_help"
              id="user_avatar"
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={(e) => setImage(e.target.files[0])}
            />
            {errors["profile_image"] && (
              <span className="text-red-500 text-[12px]">
                {errors["profile_image"].message}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-5 justify-end">
          <button className="mt-5 py-1.5 px-5 text-white text-md font-bold leading-loose bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex">
            Add Member
          </button>
        </div>
      </div>
    </form>
  );
}

export default TeamForm;
