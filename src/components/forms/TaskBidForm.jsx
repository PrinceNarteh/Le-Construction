import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import CurrencyInput from "react-currency-input";
import { z } from "zod";
import { queryKeys } from "../../constants";
import { useGetQuery } from "../../hooks/useGetQuery";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";
import { useUserSelector } from "../../hooks/useUserSelector";
import CustomSelect from "../shared/CustomSelect";
import InputField from "../shared/InputField";
import { useCompanySettingsSelector } from "../../hooks/useCompanySettings";

const schema = z.object({
  task_id: z
    .string({ required_error: "Task is required" })
    .min(1, "Task ID must be provided"),
  maximum_bid_amount: z
    .number({
      required_error: "Please enter the maximum bid amount",
    })
    .gt(0.0, "Maximum bid amount must be provided"),
  bid_duration: z
    .number({ required_error: "Bid duration is required" })
    .gt(0, "Please enter the bid duration"),
});

function TaskBidForm({ taskId, closeModal, refetch, budget }) {
  const { user } = useUserSelector();
  const { companySettings } = useCompanySettingsSelector();
  const [sendTo, setSendTo] = useState("builder");
  const [id, setId] = useState(null);
  const [amount, setAmount] = useState(budget);
  const [category, setCategory] = useState({
    category: "builder",
    id: "",
  });

  // Builders
  const { data: buildersData } = useGetQuery({
    queryKey: [queryKeys.Builders],
    url: "/my/builders",
    options: {
      headers: {
        companyid: user._id,
      },
    },
  });

  const builders = buildersData?.message.map((item) => ({
    id: item._id,
    label: `${item.f_name} ${item.l_name}`,
  }));

  // Builders Groups
  const { data: buildersGroupsData } = usePostQuery({
    queryKey: [queryKeys.BuildersGroups],
    url: "/builder/groups",
  });
  const buildersGroups = buildersGroupsData?.message.map((item) => ({
    id: item._id,
    label: `${item.group_name}`,
  }));

  const {
    clearErrors,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      task_id: taskId ?? "",
      maximum_bid_amount: 0.00 ?? "",
      bid_duration: 0,
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (id) {
      setCategory({
        category: sendTo,
        id,
      });
    }
  }, [id, sendTo]);

  const { mutate } = useMutate([queryKeys.SubmitBidForTask]);
  const submitBid = (formData) => {
    if (sendTo === "builder" && category.id === "") {
      toast.error("Please select which builder to submit");
      return;
    } else if (sendTo === "group" && category.id === "") {
      toast.error("Please select which group to submit");
      return;
    }

    const toastId = toast.loading("Submitting bid for task...");

    const data = {
      ...formData,
      ...(category.category === "builder"
        ? { builder_id: category.id }
        : { group_id: category.id }),
    };

    mutate(
      {
        url: "/open/task/for/bid",
        data,
      },
      {
        async onSuccess(data) {
          await refetch();
          toast.dismiss(toastId);
          toast.success("Task opened for bid successfully");
          closeModal(false);
        },
        async onError(error) {
          await refetch();
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      }
    );
  };

  const handleChange = (_, maskedvalue) => {
    setValue(
      "maximum_bid_amount",
      parseFloat(maskedvalue?.replaceAll(",", ""))
    );
    setAmount(maskedvalue);
    clearErrors("budget");
  };

  return (
    <div className="p-7">
      <div className="flex justify-between items-center mb-5">
        <div className="text-blue-900 text-2xl font-bold leading-10">
          Open Task For Bidding
        </div>
      </div>

      <form onSubmit={handleSubmit(submitBid)} className="space-y-4">
        <div className="flex-1">
          <label className="block mb-1 text-blue-900 text-md font-semibold whitespace-nowrap">
            Budget ({user.company.company_settings?.currency?.symbol})
          </label>
          <CurrencyInput
            onChangeEvent={handleChange}
            className="currency-input"
            value={amount}
          />
        </div>

        <InputField
          min={0}
          type="number"
          label="Bid Duration (In Hours)"
          name="bid_duration"
          register={register}
          errors={errors}
          errorMessage="Bid duration is required"
          required
        />
        <div className="flex items-center pt-4 gap-10">
          <h3 className="mb-1 block text-blue-900 text-md font-semibold leading-loose whitespace-nowrap">
            Send To:
          </h3>
          <div className="relative h-8 w-full flex ring-1 rounded-full ring-offset-4">
            <div
              className={`absolute w-1/2 top-0 ${
                sendTo === "builder" ? "translate-x-0" : "translate-x-full"
              } h-full px-5 py-2 bg-primary rounded-full shadow transform  duration-500`}
            ></div>
            <button
              type="button"
              className={`text-blue-900 bg-transparent flex-1 z-10 font-bold ${
                sendTo === "builder" && "text-white"
              } duration-500`}
              onClick={() => setSendTo("builder")}
            >
              Builder
            </button>
            <button
              type="button"
              className={`text-blue-900 bg-transparent flex-1 z-10 font-bold ${
                sendTo === "group" && "text-white"
              } duration-500`}
              onClick={() => setSendTo("group")}
            >
              Group
            </button>
          </div>
        </div>

        {sendTo === "builder" ? (
          <CustomSelect
            data={builders}
            label="Builders"
            placeholder="Select Builder"
            onChange={setId}
          />
        ) : (
          <CustomSelect
            data={buildersGroups}
            label="Groups"
            placeholder="Select Group"
            onChange={setId}
          />
        )}

        <div className="flex justify-end">
          <div className="w-52 mt-6 flex h-12 px-2 py-2 bg-gradient-to-r from-primary to-secondary rounded-md shadow justify-center items-center gap-2.5">
            <button className="text-white text-md font-bold leading-loose">
              Send For Bidding{" "}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default TaskBidForm;
