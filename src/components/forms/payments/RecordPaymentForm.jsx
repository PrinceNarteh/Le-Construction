import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { queryKeys } from "../../../constants";
import useMutate from "../../../hooks/useMutate";
import InputField from "../../shared/InputField";
import { useQueryClient } from "@tanstack/react-query";

function RecordPaymentForm({ invoice_id, setOpenPaymentModal }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      invoice_id,
      amount: 0,
    },
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutate([queryKeys.RecordPayment]);
  const submit = (data) => {
    const toastId = toast.loading("Add Payment Record...");

    mutate(
      {
        url: "/invoice/record/payment",
        method: "PATCH",
        data,
      },
      {
        async onSuccess(data) {
          await queryClient.setQueryData(
            [queryKeys.Invoices, invoice_id],
            data
          );
          toast.dismiss(toastId);
          toast.success("Payment Record added successfully!");
          setOpenPaymentModal(false);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      }
    );
  };

  return (
    <div className="p-4">
      <div>
        <div className="text-blue-900 font-bold text-2xl mb-5">
          Record a payment
        </div>
      </div>

      <form onSubmit={handleSubmit(submit)}>
        <div className="space-y-5">
          {/* <div className="w-full">
            <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
              Payment date
            </label>
            <input
              type="date"
              className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 rounded-md py-3 pl-9 pr-3 sm:text-sm"
            />
          </div> */}

          <div className="w-full">
            <InputField
              type="number"
              label="Amount"
              name="amount"
              register={register}
              errors={errors}
              required
            />
          </div>

          {/* <div className="w-full">
            <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
              Payment method
            </label>
            <select className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 rounded-md py-3 pl-9 pr-3 sm:text-sm">
              <option>Select a payment method</option>
              <option>benjamin@codecoast.com.gh</option>
            </select>
          </div>

          <div className="w-full">
            <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
              Payment Account
            </label>
            <select className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 rounded-md py-3 pl-9 pr-3 sm:text-sm">
              <option>Select a payment method</option>
              <option>benjamin@codecoast.com.gh</option>
            </select>
          </div>

          <div className="w-full">
            <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
              Memo / Notes
            </label>
            <textarea
              type="text"
              placeholder="Description"
              className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 rounded-md py-3 pl-9 pr-3 sm:text-sm"
            />
          </div> */}
        </div>

        <div className="flex justify-end">
          <button className="h-10 w-28 rounded-md bg-primary text-white mt-4">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecordPaymentForm;
