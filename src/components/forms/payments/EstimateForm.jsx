import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useCurrencies from "../../../hooks/useCurrencies";
import useMutate from "../../../hooks/useMutate";
import usePostQuery from "../../../hooks/usePostQuery";
import { useUserSelector } from "../../../hooks/useUserSelector";
import Heading from "../../layout/Heading";
import CustomSelect from "../../shared/CustomSelect";
import ErrorMessage from "../../shared/ErrorMessage";
import InputField from "../../shared/InputField";
import TextArea from "../../shared/TextArea";
import { queryKeys } from "../../../constants";
import Modal from "../../shared/Modal";
import AddProductOrSevicesForm from "./AddProductOrSevicesForm";

const productsScheme = z.object({
  product_id: z.string(),
  quantity: z.number(),
  price: z.number(),
});

const schema = z
  .object({
    company_id: z
      .string({ required_error: "Company ID is required" })
      .min(1, "Company ID is required"),
    client_id: z
      .string({ required_error: "Client ID is required" })
      .min(1, "Please select client"),
    title: z
      .string({ required_error: "Estimate title is required" })
      .min(1, "Estimate title is required"),
    currency: z
      .string({ required_error: "Currency is required" })
      .min(1, "Please select currency"),
    date: z
      .string({ required_error: "Estimate is required" })
      .min(1, "Please select estimate date"),
    due_date: z
      .string({ required_error: "Estimate due date is required" })
      .min(1, "Please select estimate due date"),
    sub_heading: z.string().optional(),
    footer: z.string().optional(),
    po_so_number: z.string().optional(),
    memo: z.string().optional(),
    products: z
      .array(productsScheme)
      .nonempty({ message: "Please add at least on product" }),
    sub_total: z.number().gte(0),
    total: z.number().gte(0),
  })
  .refine(
    (value) => {
      const date = new Date(value.date);
      const dueDate = new Date(value.due_date);
      return date.getTime() <= dueDate.getTime();
    },
    {
      message: "Due date cannot be earlier that estimate date",
      path: ["due_date"],
    }
  );

const estimateData = {
  id: "",
  price: 0,
  description: "",
  quantity: 1,
  sales_tax: "",
};

function EstimateForm({ estimate = null }) {
  const { user } = useUserSelector();
  const currency = user.company.company_settings.currency.symbol;
  const [client, setClient] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [products, setProducts] = useState([
    estimate ? estimate.product : estimateData,
  ]);
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);

  const {
    setValue,
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_id: user._id,
      client_id: estimate?.client._id ?? "",
      title: estimate?.title ?? "",
      date: estimate?.date ?? "",
      due_date: estimate?.due_date ?? "",
      sub_heading: estimate?.sub_heading ?? "",
      po_so_number: estimate?.po_so_number ?? "",
      footer: estimate?.footer ?? "",
      products: estimate?.product ?? [],
      sub_total: estimate?.sub_total ?? 0,
      total: estimate?.total ?? 0,
      memo: estimate?.memo ?? "",
    },
    resolver: zodResolver(schema),
  });

  // clients
  const { data: clientsData, isLoading: clientsLoading } = usePostQuery({
    queryKey: [queryKeys.Clients],
    url: "/company/clients",
  });
  const clients = clientsData?.message.map((client) => ({
    id: client._id,
    label: `${client.first_name} ${client.last_name}`,
  }));

  // All Products Or Services
  const { data: productsOrServicesData } = usePostQuery({
    url: "/pands/all",
    queryKey: [queryKeys.ProductsAndServices],
  });
  const productsOrServices = productsOrServicesData?.message.map(
    (productsOrServices) => ({
      id: productsOrServices._id,
      label: productsOrServices.name,
    })
  );

  useEffect(() => {
    if (currency) {
      clearErrors("currency");
      setValue("currency", currency);
    }
  }, [currency, setValue, clearErrors]);

  const quantityChange = (e, idx) => {
    const newProducts = [...products];
    newProducts[idx].quantity = e.target.value;
    setProducts(newProducts);
  };

  const handleChange = (id, idx) => {
    const product = productsOrServicesData?.message.find(
      (product) => product._id === id
    );
    const newProducts = [...products];
    newProducts[idx] = product
      ? {
          id: product._id,
          description: product.description,
          price: parseFloat(product.price),
          quantity: 1,
          sales_tax: parseFloat(product.sales_tax),
        }
      : estimateData;

    setProducts(newProducts);
  };

  const append = () => {
    setProducts([...products, estimateData]);
  };

  const remove = (idx) => {
    const deleteVal = [...products];
    deleteVal.splice(idx, 1);
    setProducts(deleteVal);
  };

  useEffect(() => {
    // sub total
    const subTotal = products.reduce(
      (amt, item) => amt + item.price * item.quantity,
      0
    );
    setValue("sub_total", subTotal);
    setSubTotal(subTotal);

    // total
    const total = products.reduce(
      (amt, item) => amt + item.price * item.quantity,
      0
    );
    setValue("total", total);
    setTotal(total);

    // set product IDs
    const productIds = () => {
      const productsData = [];
      for (let product of products) {
        if (!product.id) continue;

        productsData.push({
          product_id: product.id,
          quantity: parseInt(product.quantity),
          price: product.price,
        });
      }

      return productsData;
    };
    setValue("products", productIds());

    if (subTotal !== 0) {
      clearErrors("product_ids");
    }
  }, [products, setValue, clearErrors]);

  const { mutate } = useMutate(["estimate"]);
  const submitEstimate = (data) => {
    const toastId = toast.loading(
      `${estimate ? "Updating" : "Adding"} estimate...`
    );

    mutate(
      {
        url: `/estimate/${estimate ? "update" : "new"}`,
        method: estimate ? "PATCH" : "POST",
        data,
      },
      {
        onSuccess(data) {
          data;
          toast.dismiss(toastId);
          toast.success(
            `Estimate ${estimate ? "updated" : "added"} successfully`
          );
        },
        onError(error) {
          toast.dismiss(toastId);
          if (error.code === "ERR_NETWORK") {
            toast.error(error.message);
          } else {
            toast.error(error.response.data.message);
          }
        },
      }
    );
  };

  return (
    <div className="px-32 relative">
      <div className="mb-4">
        <Heading label={`${estimate ? "Update" : "Add"} an Estimate`} />
      </div>

      <form
        onSubmit={handleSubmit(submitEstimate)}
        className="bg-white px-10 py-5 rounded-md"
      >
        <div className="flex gap-4">
          <InputField
            label="Estimate Title"
            name="title"
            errors={errors}
            register={register}
            errorMessage="Estimate Title is required"
            required
          />
        </div>

        <div className="border-b mt-4 mb-4"></div>

        <div className="flex gap-6">
          <div className="w-full space-y-2">
            <InputField
              label="Sub Heading"
              name="sub_heading"
              register={register}
              errors={errors}
              required
              errorMessage="Sub Heading is required"
            />
            <CustomSelect
              data={clients}
              label="Client"
              onChange={setClient}
              loading={clientsLoading}
              link="/clients/add-client"
            />
            <ErrorMessage errors={errors} name="client_id" />
          </div>

          <div className="w-full space-y-2">
            <InputField
              type="date"
              label="Date"
              name="date"
              register={register}
              errors={errors}
              required
              errorMessage="Estimate date is required"
            />

            <InputField
              type="date"
              label="Expires On"
              name="due_date"
              register={register}
              errors={errors}
              required
              errorMessage="Estimate due date is required"
            />

            <InputField
              label="P.O/S.O"
              name="po_so_number"
              register={register}
              errors={errors}
            />
          </div>

          <div className="w-full space-y-2">
            <InputField
              label="Footer"
              name="footer"
              register={register}
              errors={errors}
            />
            <TextArea
              label="Memo / Notes"
              name="memo"
              register={register}
              errors={errors}
              rows={6}
            />
          </div>
        </div>

        <div className="w-full border mt-4 rounded-md p-3 bg-white">
          <div className="flex w-full text-black text-sm font-bold leading-tight">
            <div className="w-[30%]">
              <div className="ml-3">Product</div>
            </div>
            <div className="w-[30%]">Description</div>
            <div className="w-[15%]">Price</div>
            <div className="w-[15%]">Quantity</div>
            <div className="w-[15%]">Tax</div>
            <div className="w-[15%]">Amount</div>
            <div className="w-[5%]"></div>
          </div>

          <div className="border-b mt-4 mb-1"></div>

          {products.map((product, index) => (
            <div
              key={index}
              className="flex w-full text-black text-sm font-bold leading-tight gap-4 p-2 border-b z-auto"
            >
              <div className="w-[30%]">
                <CustomSelect
                  placeholder="Select product..."
                  data={productsOrServices}
                  onChange={(value) => {
                    return handleChange(value, index);
                  }}
                  actionButton={() => {
                    setOpenModal(true);
                  }}
                />
              </div>

              <div className="w-[30%]">
                <input
                  type="text"
                  value={products[index].description}
                  readOnly
                  className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-300 shadow rounded-md py-3 pl-2 pr-3 sm:text-sm "
                />
              </div>

              <div className="w-[15%]">
                <input
                  type="text"
                  value={products[index].price}
                  readOnly
                  className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-300 shadow rounded-md py-3 pl-2 pr-3 sm:text-sm "
                />
              </div>

              <div className="w-[15%]">
                <input
                  type="number"
                  value={products[index].quantity}
                  min={1}
                  className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-300 shadow rounded-md py-3 pl-2 pr-3 sm:text-sm "
                  onChange={(e) => quantityChange(e, index)}
                />
              </div>

              <div className="w-[15%]">
                <input
                  type="number"
                  value={products[index].sales_tax}
                  readOnly
                  className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-300 shadow rounded-md py-3 pl-2 pr-3 sm:text-sm "
                />
              </div>

              <div className="w-[15%] flex mt-2">
                {user?.company_settings.currency.code}{" "}
                {products[index].quantity * products[index].price}
              </div>

              <div
                onClick={() => remove(index)}
                className="w-[5%] flex mt-2 cursor-pointer"
              >
                <Icon icon="carbon:delete" className=" h-5 w-5 text-red-700" />
              </div>
            </div>
          ))}

          <div className="flex justify-between p-3 text-sm font-bold">
            <button
              type="button"
              onClick={() => append(estimateData)}
              className="flex text-primary cursor-pointer"
            >
              <Icon icon="ei:plus" className="h-5 w-5" />
              Add a line
            </button>
            <div className="space-y-2">
              <div className="flex">
                <div className="flex justify-end mr-5 w-32">SubTotal:</div>
                <div>
                  {user?.company_settings.currency.code}
                  {subTotal}
                </div>
              </div>
              <div className="flex">
                <div className="flex justify-end mr-5 w-32">Total(GHS):</div>
                <div>
                  {user?.company_settings.currency.code}
                  {total}
                </div>
              </div>
            </div>
          </div>

          <ErrorMessage errors={errors} name="products" />
        </div>

        <div>
          <button className="w-40 flex justify-center text-md mt-4 p-2 rounded-md bg-primary text-white">
            Save
          </button>
        </div>
      </form>

      <Modal openModal={openModal} closeModal={setOpenModal}>
        <AddProductOrSevicesForm
          closeModal={() => {
            setOpenModal(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default EstimateForm;
