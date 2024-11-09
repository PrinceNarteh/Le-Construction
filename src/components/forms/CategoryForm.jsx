import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../constants/queryKeys";
import useMutate from "../../hooks/useMutate";
import { useUserSelector } from "../../hooks/useUserSelector";
import { capitalize } from "../../utils/capitalize";
import CustomFileInput from "../shared/CustomFileInput";
import InputField from "../shared/InputField";

export default function CategoryForm({ category = null, closeModal, refetch }) {
  const { user } = useUserSelector();
  const [icon, setIcon] = useState(null);
  const [previewIcon, setPreviewIcon] = useState(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: category
      ? {
          category_id: category._id,
          category_name: capitalize(category.category_name, "_"),
        }
      : {
          company_id: user.company._id,
          category_name: "",
        },
  });

  const { mutate } = useMutate([
    category ? queryKeys.UpdateCategory : queryKeys.CreateCategory,
  ]);
  const submitHandler = async (data) => {
    const toastId = toast.loading(
      `${category ? "Updating" : "Creating"} category...`
    );

    const formData = new FormData();
    formData.append("company_id", data.company_id);
    formData.append("category_name", data.category_name);
    formData.append("category_icon", icon);

    const updateData = {
      category_id: category?._id,
      category_name: data.category_name,
    };
    mutate(
      {
        url: `/${category ? "update" : "new"}/category`,
        data: category ? updateData : formData,
        method: category ? "PATCH" : "POST",
        multipart: category ? false : true,
      },
      {
        onSuccess: async (data) => {
          console.log({ categories: data });
          if (category) {
            await refetch();
          }
          toast.dismiss(toastId);
          toast.success(
            `Category ${category ? "updated" : "created"} successfully`
          );
          closeModal();
        },
        onError: (error) => {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
        onSettled() {
          queryClient.invalidateQueries("categories");
        },
      }
    );
  };

  useEffect(() => {
    if (icon) {
      setPreviewIcon(URL.createObjectURL(icon));
    }
  }, [icon]);

  return (
    <div className="cursor-pointer p-5">
      <div className="text-blue-900 text-3xl font-bold mb-2">
        <h3>{category ? "Update" : "Add"} Category</h3>
      </div>

      <div className=" text-slate-400 text-[15px] font-normal mt-2 mb-6">
        {category ? "Update" : "Add"} category for projects
      </div>

      <div className=" bg-white rounded-lg">
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="mb-5">
            <label className=" text-blue-900 text-md font-semibold leading-loose">
              Category Name
            </label>
            <InputField
              name="category_name"
              register={register}
              errors={errors}
              required
              errorMessage="Category name is required"
            />
          </div>
          <div>
            {category ? (
              <div className="overflow-hidden flex justify-center">
                <img
                  src={category.category_icon}
                  style={{ objectFit: "cover" }}
                  alt=""
                  className="w-32 h-32 rounded object-cover"
                />
              </div>
            ) : null}
            {!category && previewIcon ? (
              <div className="overflow-hidden flex justify-center">
                <img
                  src={previewIcon}
                  style={{ objectFit: "cover" }}
                  alt=""
                  className="w-32 h-32 rounded object-cover"
                />
              </div>
            ) : null}
            <div className="flex items-center gap-5 mt-5">
              {category && previewIcon ? (
                <div className="overflow-hidden flex justify-center basis-40">
                  <img
                    src={previewIcon}
                    style={{ objectFit: "cover" }}
                    alt=""
                    className="w-32 h-32 rounded object-cover"
                  />
                </div>
              ) : null}
              <div className="flex-1">
                <CustomFileInput onChange={setIcon} height="h-32" required />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex mt-6 text-white text-md font-bold leading-loose ">
              {category ? "Update" : "Add"} Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
