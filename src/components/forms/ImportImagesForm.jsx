import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { queryKeys } from "../../constants";
import useMutate from "../../hooks/useMutate";
import CustomFileInput from "../shared/CustomFileInput";
import CustomSelect from "../shared/CustomSelect";

function ImportImagesForm({ gallery, setOpenModal, projects, refetch }) {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("project");
  const [galleryName, setGalleryName] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [projectId, setProjectId] = useState("");

  function deleteSelectedImage(index) {
    const imageCopy = [...images];
    if (images.length === 1) {
      setImages([]);
      setPreviewImages([]);
    } else {
      imageCopy.splice(index, 1);
      setImages(imageCopy);
    }
  }

  const { mutate } = useMutate([queryKeys.AddImageToGallery]);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (category === "project" && !projectId) {
      toast.error("Please kindly select a project");
      return;
    } else if (category === "new-gallery" && !galleryName) {
      toast.error("Please kindly provide gallery name");
      return;
    }

    if (images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const toastId = toast.loading(
      `Adding image(s) to ${gallery.gallery_title}`
    );
    const formData = new FormData();
    formData.append("gallery_id", gallery._id);
    if (category === "project") {
      formData.append("project_id", projectId);
    } else {
      formData.append("gallery_name", galleryName);
    }
    for (let image of images) {
      formData.append("gallery_images", image);
    }

    mutate(
      {
        url: "/add/to/gallery",
        data: formData,
        method: "PATCH",
        multipart: true,
      },
      {
        async onSuccess() {
          await refetch();
          toast.dismiss(toastId);
          toast.success(
            `Image(s) added to ${gallery.gallery_title} successfully!`
          );
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
    const previewImg = [];
    images.forEach((image) => {
      previewImg.push(URL.createObjectURL(image));
    });
    setPreviewImages(previewImg);
  }, [images]);

  return (
    <div className="py-6 px-3 cursor-pointer">
      <div>
        <div className="mb-5">
          <h3 className="font-bold text-blue-900 text-2xl ">
            Import Image from Computer
          </h3>
        </div>

        <div>
          <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
            Import Images Into A:
          </label>
          <div className="relative h-8 w-10/12 mx-auto flex mt-4 mb-2 ring-1 ring-violet-100 rounded-full ring-offset-2">
            <div
              className={`absolute w-1/2 top-0 ${
                category === "project" ? "translate-x-0" : "translate-x-full"
              } h-full px-5 py-2 bg-primary rounded-full shadow transform  duration-500`}
            ></div>
            <button
              type="button"
              className={`text-sm text-blue-900 bg-transparent flex-1 z-10 font-bold ${
                category === "project" && "text-white"
              } duration-500`}
              onClick={() => setCategory("project")}
            >
              Project
            </button>
            <button
              type="button"
              className={`text-sm text-blue-900 bg-transparent flex-1 z-10 font-bold ${
                category === "new-gallery" && "text-white"
              } duration-500`}
              onClick={() => setCategory("new-gallery")}
            >
              New Gallery
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {category === "project" ? (
            <CustomSelect
              label="Project"
              placeholder="Select project..."
              data={projects}
              onChange={setProjectId}
            />
          ) : (
            <div className="flex-1">
              <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                Gallery Name
              </label>
              <input
                onChange={(e) => setGalleryName(e.target.value)}
                className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-400 shadow-md rounded-md py-3 pl-9 pr-3 sm:text-sm"
              />
              {/* <span className="text-red-500 text-[12px]">hello</span> */}
            </div>
          )}
          {previewImages.length > 0 ? (
            <div className="flex gap-5 flex-wrap justify-center py-3">
              {previewImages.map((image, index) => (
                <div
                  key={index}
                  className="relative h-32 w-32 shrink-0 rounded-md bg-slate-500"
                >
                  <Icon
                    icon="line-md:close-circle-twotone"
                    onClick={() => deleteSelectedImage(index)}
                    className="absolute -right-2 -top-2 z-10 cursor-pointer rounded-full bg-white text-2xl text-primary"
                  />
                  <div className="overflow-hidden">
                    <img
                      src={image}
                      style={{ objectFit: "cover" }}
                      alt=""
                      className="w-32 h-32 rounded object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          <CustomFileInput
            label="Gallery Images"
            onChange={setImages}
            height="h-24"
            multiple
            required
          />
          <div className="flex justify-end">
            <button className="bg-primary  mt-5 rounded-md px-10 py-1 text-white text-md font-bold leading-loose">
              Import
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ImportImagesForm;
