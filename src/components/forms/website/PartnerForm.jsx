import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { setCompany } from "../../../app/feature/company/companySlice";
import useMutate from "../../../hooks/useMutate";
import { useUserSelector } from "../../../hooks/useUserSelector";
import { convertBase64 } from "../../../utils/convertBase64";
import InputField from "../../shared/InputField";
import { useCompanySelector } from "../../../hooks/useCompanySelector";
import { useWebsiteSelector } from "../../../hooks/useWebsiteSelector";
import { setWebsite } from "../../../app/feature/company/websiteSlice";

const schema = z.object({
  company_id: z.string().min(1, "Company ID is required"),
  name: z.string().min(1, "Title is required"),
  link: z.string().min(1, "Description is required"),
  image: z.any(),
});

function PartnerForm({ setOpenModal }) {
  const { company } = useCompanySelector();
  const { website } = useWebsiteSelector();
  const inputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const dispatch = useDispatch();

  // About Us Info
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    defaultValues: {
      company_id: company?.website_id,
      name: "",
      link: "",
      image: "",
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
    formData.append("image", image);

    mutate(
      {
        url: "/website/about/partners",
        data: formData,
        method: "PATCH",
        multipart: true,
      },
      {
        onSuccess(data) {
          dispatch(setWebsite(data.message));
          toast.dismiss(toastId);
          toast.success("Header info updated successfully");
          setOpenModal(false);
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

  return (
    <div>
      <div className="">
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="mt-5">
            <h3 className="font-semibold text-blue-900 text-3xl">Partners</h3>
          </div>
          <div className="bg-white w-full rounded-xl p-5">
            <div className="space-y-5">
              <div className="w-full">
                <InputField
                  label="Name"
                  name="name"
                  placeholder="Name"
                  errors={errors}
                  register={register}
                  required
                />
              </div>
              <div className="w-full">
                <InputField
                  label="Link"
                  name="link"
                  placeholder="LInk"
                  errors={errors}
                  register={register}
                  required
                />
              </div>
              <div className="w-full">
                {preview && (
                  <div className="relative h-32 w-32 shrink-0 flex justify-center rounded-md bg-slate-500">
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

export default PartnerForm;
