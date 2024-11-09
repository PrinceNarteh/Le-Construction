import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { queryKeys } from "../../constants";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";
import CustomFileInput from "../shared/CustomFileInput";
import CustomSelect from "../shared/CustomSelect";
import InputField from "../shared/InputField";
import TextArea from "../shared/TextArea";

const GalleryForm = () => {
  const [projectId, setProjectId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      project_id: "",
      category_id: "",
      gallery_title: "",
      gallery_description: "",
    },
  });

  // Get Projects
  const { data: projects, isLoading: projectLoading } = usePostQuery({
    queryKey: [queryKeys.ProjectsForCompany],
    url: "/projects/for/company",
  });
  const projectsData = projects
    ? projects?.message.map((project) => ({
        id: project._id,
        label: project.project_name,
      }))
    : [];

  // Get Categories
  const { data: categories, isLoading: categoriesLoading } = usePostQuery({
    queryKey: [queryKeys.Categories],
    url: "/all/categories/for/company",
  });
  const categoriesData = categories
    ? categories?.message.map((category) => ({
        id: category._id,
        label: category.category_name,
      }))
    : [];

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

  const { mutate } = useMutate([queryKeys.AddGallery]);
  const submit = (data) => {
    if (images.length < 1) {
      toast.error("Please select at least one image");
      return;
    }
    const toastId = toast.loading("Adding gallery...");
    const formData = new FormData();
    Object.entries(data).forEach((item) => {
      formData.append(...item);
    });

    for (let image of images) {
      formData.append("gallery_images", image);
    }

    mutate(
      {
        url: "/new/gallery",
        data: formData,
        multipart: true,
      },
      {
        onSuccess() {
          toast.dismiss(toastId);
          toast.success("Gallery added successfully!");
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error);
        },
      }
    );
  };

  useEffect(() => {
    if (projectId) {
      setValue("project_id", projectId);
    }
    setValue();
  }, [projectId, setValue]);

  useEffect(() => {
    if (projectId) {
      setValue("category_id", categoryId);
    }
  }, [categoryId, projectId, setValue]);

  useEffect(() => {
    const previewImg = [];
    images.forEach((image) => {
      previewImg.push(URL.createObjectURL(image));
    });
    setPreviewImages(previewImg);
  }, [images]);

  return (
    <div className="p-5">
      <div className="text-blue-900 text-2xl font-bold leading-10">
        Create Gallery
      </div>
      <form onSubmit={handleSubmit(submit)} className="space-y-5">
        <CustomSelect
          label="Project"
          placeholder="Select Project"
          data={projectsData}
          onChange={setProjectId}
          loading={projectLoading}
        />
        <CustomSelect
          label="Category"
          placeholder="Select Category"
          data={categoriesData}
          onChange={setCategoryId}
          loading={categoriesLoading}
        />
        <InputField
          label="Gallery Title"
          name="gallery_title"
          errors={errors}
          register={register}
          required
        />
        <TextArea
          label="Gallery Description"
          name="gallery_description"
          errors={errors}
          register={register}
          required={true}
        />
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
          multiple
          height="h-24"
        />
        <div className="flex justify-end">
          <input
            type="submit"
            value="Add Gallery"
            className="bg-primary py-2 px-5 rounded-md text-white font-bold"
          />
        </div>
      </form>
    </div>
  );
};

export default GalleryForm;
