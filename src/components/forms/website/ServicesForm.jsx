import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { z } from "zod";

import { setCompany } from "../../../app/feature/company/companySlice";
import useMutate from "../../../hooks/useMutate";
import { convertBase64 } from "../../../utils/convertBase64";
import InputField from "../../shared/InputField";
import { useCompanySelector } from "../../../hooks/useCompanySelector";
import { setWebsite } from "../../../app/feature/company/websiteSlice";

const schema = z.object({
  company_id: z.string().min(1, "Company ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.any(),
});

function ServicesForm({ service, closeModal }) {
  const { company } = useCompanySelector();
  const inputRef = useRef();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const dispatch = useDispatch();

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    defaultValues: {
      company_id: company?.website_id,
      title: service?.title ?? "",
      description: service?.description ?? "",
      icon: service?.icon ?? "",
    },
    resolver: zodResolver(schema),
  });

  const { mutate } = useMutate(["about-us-info"]);
  const submitHandler = (data) => {
    const toastId = toast.loading("Updating info....");
    const formData = new FormData();

    Object.entries(data).forEach((item) => {
      formData.append(...item);
    });

    if (service && image) {
      formData.append("service_image", image);
    } else if (!service) {
      formData.append("icon", image);
    }

    mutate(
      {
        url: `/website${service ? "/service/update" : "/services"}`,
        method: "PATCH",
        data: formData,
        multipart: true,
      },
      {
        onSuccess(data) {
          dispatch(setWebsite(data.message));
          toast.dismiss(toastId);
          toast.success("Header info updated successfully");
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
    if (image) {
      convertBase64(image).then((res) => setPreview(res));
    } else {
      inputRef.current.value = null;
      setPreview(null);
    }
  }, [image]);

  useEffect(() => {
    if (service) {
      setPreview(service.icon);
    }
  }, [service]);

  return (
    <div>
      <div className="">
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="mt-5">
            <h3 className="font-semibold text-blue-900 text-3xl">Services</h3>
          </div>
          <div className="bg-white w-full rounded-xl p-5 mt-4">
            <div className="space-y-5">
              <div className="w-full">
                <InputField
                  label="Title"
                  name="title"
                  placeholder="Title"
                  errors={errors}
                  register={register}
                  required
                />
              </div>
              <div className="w-full">
                <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                  Description
                </label>
                <textarea
                  type="text"
                  placeholder="Description"
                  className="placeholder:text-slate-400 block resize-y bg-white w-full outline-none border border-slate-200 rounded-md py-3 pl-9 pr-3 sm:text-sm"
                  {...register("description")}
                />
                {errors["description"] && (
                  <span className="text-red-500 text-[12px]">
                    {errors["description"].message}
                  </span>
                )}
              </div>
              <div className="w-full">
                {preview && (
                  <div className="relative h-32 w-32 mx-auto shrink-0 rounded-md bg-slate-500">
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
                <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                  Image
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
      </div>
    </div>
  );
}

export default ServicesForm;
