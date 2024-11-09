import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import useMutate from "../../../hooks/useMutate";
import { useUserSelector } from "../../../hooks/useUserSelector";
import Heading from "../../layout/Heading";
import InputField from "../../shared/InputField";
import { queryKeys } from "../../../constants";

function AddProductOrSevicesForm({ productOrService = null, closeModal }) {
  const { user } = useUserSelector();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_id: user.company._id,
      name: productOrService?.name ?? "",
      description: productOrService?.description ?? "",
      price: productOrService?.price ?? "",
      sales_tax: productOrService?.sales_tax ?? "",
      is_selling: productOrService?.is_selling ?? false,
      is_buying: productOrService?.is_buying ?? false,
    },
  });

  const { mutate } = useMutate([
    productOrService
      ? queryKeys.UpdateProductOrService
      : queryKeys.AddProductOrService,
  ]);
  const submitHandler = (data) => {
    const toastId = toast.loading(
      `${productOrService ? "Updating" : "Creating"} Product or Service...`
    );
    mutate(
      {
        url: productOrService ? `/pands/${productOrService._id}` : "/pands/new",
        method: productOrService ? "PATCH" : "POST",
        data,
      },
      {
        onSuccess: async (data) => {
          await queryClient.setQueryData(
            [queryKeys.ProductsAndServices],
            (oldData) => {
              if (productOrService) {
                return {
                  message: (oldData?.message ?? []).map((item) => {
                    if (item._id === data.message._id) {
                      return data.message;
                    }
                    return item;
                  }),
                };
              } else {
                return {
                  message: [data.message, ...(oldData?.message ?? [])],
                };
              }
            }
          );
          toast.dismiss(toastId);
          toast.success(
            `Product or Service ${
              productOrService ? "updated" : "created"
            } successfully!`
          );
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
    <div className="px-10">
      <div className="mb-10">
        <Heading
          label={`${productOrService ? "Update" : "Add a"} Product or Service`}
        />
      </div>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-3">
        <InputField
          label="Name"
          name="name"
          errors={errors}
          register={register}
          errorMessage="Product or Service name is required"
          required
        />
        <InputField
          type="number"
          label="Price"
          name="price"
          errors={errors}
          register={register}
          errorMessage="Price for Product or Service is required"
          required
        />
        <InputField
          label="Description"
          name="description"
          errors={errors}
          register={register}
          errorMessage="Description for Product or Service is required"
          required
        />
        <InputField
          label="Sales Tax"
          name="sales_tax"
          errors={errors}
          register={register}
        />

        <div className="flex">
          <label
            htmlFor="buying"
            className="flex-1 mb-1 mt-1 ml-2 flex items-center gap-3 cursor-pointer text-blue-900 text-md font-semibold leading-loose"
          >
            <input
              id="buying"
              type="checkbox"
              className="w-5 h-5 accent-primary cursor-pointer"
              {...register("is_buying")}
            />{" "}
            Buying
          </label>

          <label
            htmlFor="selling"
            className="flex-1 mb-1 mt-1 ml-2 flex items-center gap-3 cursor-pointer text-blue-900 text-md font-semibold leading-loose"
          >
            <input
              id="selling"
              type="checkbox"
              className="w-5 h-5 accent-primary cursor-pointer"
              {...register("is_selling")}
            />{" "}
            Selling
          </label>
        </div>

        <div className="flex justify-end mt-2">
          <button className="flex justify-center text-md mt-4 py-2 px-5 rounded-md bg-primary text-white">
            {`${productOrService ? "Update" : "Add a"} Product or Service`}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProductOrSevicesForm;
