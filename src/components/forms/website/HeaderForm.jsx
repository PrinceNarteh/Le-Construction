import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { setCompany } from "../../../app/feature/company/companySlice";
import { useCompanySelector } from "../../../hooks/useCompanySelector";
import useMutate from "../../../hooks/useMutate";
import { useUserSelector } from "../../../hooks/useUserSelector";
import { convertBase64 } from "../../../utils/convertBase64";
import InputField from "../../shared/InputField";
import Modal from "../../shared/Modal";
import VideoPlayer from "../../shared/VideoPlayer";
import { useWebsiteSelector } from "../../../hooks/useWebsiteSelector";
import { setWebsite } from "../../../app/feature/company/websiteSlice";

const headerSchema = z.object({
  company_id: z.string().min(1, "Company ID is required"),
  header_section_image: z.any(),
  header_section_title: z.string().min(1, "Title is required"),
  header_section_description: z.string().min(1, "Description is required"),
});

function HeaderForm() {
  const { user } = useUserSelector();
  const { company } = useCompanySelector();
  const [openModal, setOpenModal] = useState(false);
  const [video, setVideo] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);
  const [uploaded, setUploaded] = useState(0);
  const [videoModal, setVideoModal] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(null);
  const { website } = useWebsiteSelector();

  const dispatch = useDispatch();

  // header section
  const {
    handleSubmit: handleHeaderSubmit,
    formState: { errors: headerErrors },
    register: headerRegister,
  } = useForm({
    defaultValues: {
      company_id: company.website_id,
      header_section_title: website?.header_section_title,
      header_section_description: website?.header_section_description,
      header_section_image: website?.header_section_image,
    },
    resolver: zodResolver(headerSchema),
  });

  const headerMutation = useMutate(["update-header"]);
  const headerSubmitHandler = (data) => {
    const toastId = toast.loading("Updating info....");
    const formData = new FormData();
    formData.append("company_id", data.company_id);
    formData.append("header_section_title", data.header_section_title);
    formData.append(
      "header_section_description",
      data.header_section_description
    );
    formData.append("header_section_image", image);

    headerMutation.mutate(
      {
        url: "/website/header/update",
        data: formData,
        method: "PATCH",
        multipart: true,
      },
      {
        onSuccess(data) {
          dispatch(setWebsite(data.message));
          toast.dismiss(toastId);
          toast.success("Header info updated successfully");
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      }
    );
  };

  // header video
  const videoSubmitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("company_id", user.company_id);
    formData.append("header_section_video", video);

    setVideoModal(true);

    axios
      .patch(
        `${process.env.REACT_APP_BASE_URL}/website/header/video/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.auth_token}`,
            roleid: user?.role._id,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (data) => {
            setUploaded(Math.round((data.loaded / data.total) * 100));
          },
        }
      )
      .then((res) => {
        setVideoModal(false);
        toast.success("Section Header Video Uploaded successfully");
      })
      .catch((error) => {
        setVideoModal(false);
        toast.error(error.response.data.message);
      });
  };

  useEffect(() => {
    if (image) {
      convertBase64(image).then((res) => setPreview(res));
    } else {
      inputRef.current.value = null;
    }
  }, [image]);

  useEffect(() => {
    if (website?.header_section_image) {
      setPreview(website.header_section_image);
    }
    if (website?.header_section_video) {
      setPreviewVideo(website?.header_section_video);
    }
  }, [website]);

  useEffect(() => {
    if (video) {
      setPreviewVideo(URL.createObjectURL(video));
    }
  }, [video]);

  return (
    <div className="">
      <div className="pl-7 pr-7">
        <form onSubmit={handleHeaderSubmit(headerSubmitHandler)}>
          <div className="mb-5">
            <h3 className="font-semibold text-blue-900 text-3xl">
              Header Section
            </h3>
          </div>
          <div className="bg-white w-full rounded-xl p-5">
            <div className="space-y-5">
              <div className="w-full">
                <InputField
                  label="Header Title"
                  name="header_section_title"
                  register={headerRegister}
                  errors={headerErrors}
                  placeholder="Title"
                  required
                />
              </div>
              <div className="w-full">
                <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                  Header Description
                </label>
                <textarea
                  type="text"
                  placeholder="Sub Title"
                  className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-400 shadow-md rounded-md py-3 pl-9 pr-3 sm:text-sm"
                  {...headerRegister("header_section_description")}
                />
                {headerErrors["header_section_description"] && (
                  <span className="text-red-500 text-[12px]">
                    {headerErrors["header_section_description"].message}
                  </span>
                )}
              </div>
              {preview && (
                <div className="relative h-32 w-32 shrink-0 rounded-md bg-slate-500">
                  {image && (
                    <AiOutlineCloseCircle
                      onClick={() => {
                        if (website?.header_section_image) {
                          setImage(null);
                          setPreview(website?.header_section_image);
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
              <div className="w-full">
                <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                  Header Image (Mobile View)
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
                {headerErrors["header_section_image"] && (
                  <span className="text-red-500 text-[12px]">
                    {headerErrors["header_section_image"].message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-5 justify-end ">
              <button
                disabled={headerMutation.isLoading}
                className={`text-white text-md font-bold py-2 px-5 mt-5 leading-loose bg-gradient-to-r from-primary to-secondary rounded-lg shadow ${
                  headerMutation.isLoading
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                Save Infomation
              </button>
            </div>
          </div>
        </form>

        <form onSubmit={videoSubmitHandler}>
          <div className="bg-white mt-5 w-full rounded-xl p-5">
            {previewVideo && (
              <div className="relative h-32 w-60 shrink-0 rounded-md bg-slate-500 mb-5 cursor-pointer">
                {image && (
                  <AiOutlineCloseCircle
                    onClick={() => {
                      if (website?.header_section_image) {
                        setImage(null);
                        setPreview(website?.header_section_image);
                      } else {
                        setImage(null);
                      }
                    }}
                    className="absolute -right-2 -top-2 z-10 cursor-pointer rounded-full bg-white text-2xl text-orange-500"
                  />
                )}
                <div
                  className="overflow-hidden"
                  onClick={() => setOpenModal(true)}
                >
                  <video src={video}></video>
                </div>
              </div>
            )}
            <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
              Header Video (Tablet and Desktop View)
            </label>{" "}
            <input
              className="block w-full cursor-pointer font-normal rounded-lg border bg-dark-gray file:border-none file:bg-primary file:px-5 file:py-3 file:text-white"
              aria-describedby="user_avatar_help"
              id="user_avatar"
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
            />
            <div className="flex gap-5 justify-end">
              <div className="py-2 px-5 mt-5 bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex">
                <button className="text-white text-md font-bold leading-loose">
                  Upload Video
                </button>
              </div>
            </div>
          </div>
        </form>

        <Modal openModal={videoModal} closeModal={setVideoModal}>
          <div className="flex justify-center">
            <Icon
              icon="line-md:cloud-upload-outline-loop"
              className="text-7xl text-gray-500"
            />
          </div>
          <div class="flex justify-between mb-1">
            <span class="text-base font-medium text-primary">Uploading</span>
            <span class="text-sm font-medium text-primary">{uploaded}%</span>
          </div>
          <div class="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 w-96">
            <div
              class="bg-primary h-2.5 rounded-full"
              style={{ width: `${uploaded}%` }}
            ></div>
          </div>
        </Modal>

        <VideoPlayer
          url={previewVideo}
          openModal={openModal}
          closeModal={setOpenModal}
        />
      </div>
    </div>
  );
}

export default HeaderForm;
