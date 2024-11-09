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

function FunFactForm({ closeModal }) {
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
      title: "",
      count: "",
      icon: "",
    },
  });

  const dispatch = useDispatch();
  const { mutate } = useMutate(["add-fun-fact"]);
  const submitHandler = (data) => {
    const toastId = toast.loading("Adding Fun Fact...");
    const formData = new FormData();
    Object.entries(data).forEach((item) => {
      formData.append(...item);
    });

    if (image) {
      formData.append("icon", image);
    }

    mutate(
      {
        url: "/website/about/funfact",
        method: "PATCH",
        data: formData,
        multipart: true,
      },
      {
        onSuccess(data) {
          dispatch(setWebsite(data.message));
          toast.dismiss(toastId);
          toast.success("Fun Fact added Successfully!");
          closeModal(false);
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
        <div className="mb-5">
          <h3 className="font-semibold text-blue-900 text-3xl">Fun Fact</h3>
        </div>{" "}
        <div className="space-y-5">
          <div className="w-full">
            <InputField
              label="Title"
              name="title"
              placeholder="Title"
              errors={errors}
              register={register}
              required
              errorMessage="Title is required"
            />
          </div>
          <div className="w-full">
            <InputField
              type="number"
              label="Count"
              placeholder="Count"
              name="count"
              errors={errors}
              register={register}
              required
              errorMessage="Count is required"
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
            Add Fact
          </button>
        </div>
      </div>
    </form>
  );
}

export default FunFactForm;
