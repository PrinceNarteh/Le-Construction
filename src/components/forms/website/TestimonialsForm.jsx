import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { z } from "zod";

import { setCompany } from "../../../app/feature/company/companySlice";
import { useCompanySelector } from "../../../hooks/useCompanySelector";
import useMutate from "../../../hooks/useMutate";
import { convertBase64 } from "../../../utils/convertBase64";
import InputField from "../../shared/InputField";
import { setWebsite } from "../../../app/feature/company/websiteSlice";

const schema = z.object({
  company_id: z.string().min(1, "Company ID is required"),
  name: z.string().min(1, "Title is required"),
  designation: z.string().min(1, "Designation is required"),
  description: z.string().min(1, "Description is required"),
  profile_image: z.any(),
});

function TestimonialsForm({ testimonial, closeModal }) {
  const { company } = useCompanySelector();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    defaultValues: {
      company_id: company?.website_id,
      name: testimonial?.name ?? "",
      designation: testimonial?.designation ?? "",
      description: testimonial?.description ?? "",
      profile_image: "",
    },
    resolver: zodResolver(schema),
  });

  const { mutate } = useMutate(["update-header"]);
  const submitHandler = (data) => {
    const toastId = toast.loading(
      `${testimonial ? "Updating" : "Creating"} Testimonial....`
    );
    const formData = new FormData();

    if (!testimonial) {
      Object.entries(data).forEach((item) => {
        formData.append(...item);
      });

      if (image) {
        formData.append("profile_image", image);
      }
    }

    mutate(
      {
        url: testimonial
          ? "/website/testimonial/update"
          : "/website/testimonial",
        data: !testimonial ? formData : data,
        method: "PATCH",
        multipart: !testimonial,
      },
      {
        onSuccess(data) {
          dispatch(setWebsite(data.message));
          toast.dismiss(toastId);
          toast.success(
            `Testimonial ${testimonial ? "updated" : "created"} successfully`
          );
          closeModal(false);
        },
        onError(error) {
          toast.dismiss(toastId);
          if (error.code === "ERR_NETWORK") {
            toast.error(error.message);
          } else {
            toast.error(error.response.data.message);
          }
        },
      }
    );
  };

  useEffect(() => {
    if (image) {
      convertBase64(image).then((res) => setPreview(res));
    } else {
      if (inputRef.current?.value) inputRef.current.value = null;
    }
  }, [image]);

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="bg-white w-full rounded-xl p-5">
          <h3 className="text-3xl mb-5 font-semibold text-blue-900">
            {testimonial ? "Update" : "Add"} Testimonial
          </h3>
          <div className="space-y-3">
            <div className="w-full">
              <InputField
                label="Name"
                name="name"
                placeholder="John Doe"
                errors={errors}
                register={register}
                required
              />
            </div>
            <div className="w-full">
              <InputField
                label="Designation"
                name="designation"
                placeholder="CEO"
                errors={errors}
                register={register}
                required
              />
            </div>
            <div className="w-full">
              <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                Review
              </label>
              <textarea
                type="text"
                placeholder="Description"
                className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-400 shadow-md rounded-md py-3 pl-9 pr-3 sm:text-sm"
                {...register("description")}
              />
              {errors["description"] && (
                <span className="text-red-500 text-[12px]">
                  {errors["description"].message}
                </span>
              )}
            </div>

            {!testimonial && (
              <div className="w-full">
                <div className="flex justify-center">
                  {preview && (
                    <div className="relative h-32 w-32 shrink-0 rounded-md bg-slate-500">
                      {image && (
                        <AiOutlineCloseCircle
                          onClick={() => {
                            if (testimonial?.profile_image) {
                              setImage(null);
                              setPreview(testimonial?.profile_image);
                            } else {
                              setImage(null);
                            }
                          }}
                          className="absolute -right-2 -top-2 z-10 cursor-pointer rounded-full bg-white text-2xl text-orange-500"
                        />
                      )}
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
              </div>
            )}
          </div>

          <div className="flex gap-5 justify-end mt-5">
            <button className="text-white text-xs font-bold leading-loose bg-primary py-1.5 px-5 rounded-md">
              {testimonial ? "Update" : "Add"} Testimonial
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default TestimonialsForm;
