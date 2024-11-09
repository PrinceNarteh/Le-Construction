import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

import { setCompany } from "../../../app/feature/company/companySlice";
import { useCompanySelector } from "../../../hooks/useCompanySelector";
import useMutate from "../../../hooks/useMutate";
import InputField from "../../shared/InputField";
import { setWebsite } from "../../../app/feature/company/websiteSlice";

function FaqForm({ faq, closeModal }) {
  const { company } = useCompanySelector();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_id: company.website_id,
      question: faq?.question ?? "",
      answer: faq?.answer ?? "",
    },
  });

  const dispatch = useDispatch();
  const { mutate } = useMutate(["add-faq"]);

  const submitHandler = (data) => {
    const toastId = toast.loading("Adding FAQ...");

    mutate(
      {
        url: faq ? "/website/faq/update" : "/website/faq",
        method: "PATCH",
        data,
      },
      {
        onSuccess(data) {
          dispatch(setWebsite(data.message));
          toast.dismiss(toastId);
          toast.success(`FAQ ${faq ? "updated" : "added"} Successfully!`);
          closeModal(false);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="bg-white w-full rounded-xl p-5">
        <h3 className="text-3xl font-bold text-blue-900 mb-5">
          {faq ? "Update" : "Add"} FAQ
        </h3>
        <div className="space-y-5">
          <div className="w-full">
            <InputField
              label="Question"
              name="question"
              placeholder="Question"
              errors={errors}
              register={register}
              required
              errorMessage="Question is required"
            />
          </div>
          <div className="w-full">
            <InputField
              label="Answer"
              name="answer"
              placeholder="Answer"
              errors={errors}
              register={register}
              required
              errorMessage="Answer is required"
            />
          </div>
        </div>

        <div className="flex gap-5 justify-end">
          <button className="text-white text-md font-bold leading-loose w-48 mt-5 h-12 py-5 bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex">
            {faq ? "Update" : "Add"} FAQ
          </button>
        </div>
      </div>
    </form>
  );
}

export default FaqForm;
