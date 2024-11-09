import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

import useMutate from "../../../hooks/useMutate";
import usePostQuery from "../../../hooks/usePostQuery";
import { useUserSelector } from "../../../hooks/useUserSelector";
import Heading from "../../layout/Heading";
import CustomSelect from "../../shared/CustomSelect";
import ErrorMessage from "../../shared/ErrorMessage";
import InputField from "../../shared/InputField";
import TextArea from "../../shared/TextArea";
import { queryKeys } from "../../../constants";
import { useLocation, useNavigate } from "react-router-dom";
import { capitalize } from "../../../utils/capitalize";
import { useCompanySettingsSelector } from "../../../hooks/useCompanySettings";

const productsScheme = z.object({
  product_id: z.string(),
  quantity: z.number(),
  price: z.number(),
});

const schema = (path) => {
  return z
    .object({
      company_id: z
        .string({ required_error: "Company ID is required" })
        .min(1, "Company ID is required"),
      client_id: z
        .string({ required_error: "Client ID is required" })
        .min(1, "Please select client"),
      title: z
        .string({ required_error: "Title is required" })
        .min(1, "Title is required"),
      currency: z
        .string({ required_error: "Currency is required" })
        .min(1, "Please select currency"),
      due_date: z
        .string({ required_error: "Due date is required" })
        .min(1, "Please select due date"),
      sub_heading: z.string().optional(),
      footer: z.string().optional(),
      po_so_number: z.string().optional(),
      products: z
        .array(productsScheme)
        .nonempty({ message: "Please add at least on product" }),
      sub_total: z.number().gte(0),
      total: z.number().gte(0),
      [path === "invoice" ? "note_and_terms_to_client" : "memo"]: z
        .string()
        .optional(),
      [path === "invoice" ? "invoice_date" : "date"]: z
        .string({ required_error: "Date is required" })
        .min(1, "Please select date"),
    })
    .refine(
      (value) => {
        const date = new Date(
          path === "invoice" ? value.invoice_date : value.date
        );
        const dueDate = new Date(value.due_date);
        return date.getTime() <= dueDate.getTime();
      },
      {
        message: "Due date cannot be earlier that created date",
        path: ["due_date"],
      }
    );
};

const initialData = {
  id: "",
  price: 0,
  description: "",
  quantity: 1,
  sales_tax: "",
};

const convertProducts = (products) =>
  products.map((product) => ({
    id: product._id,
    price: parseFloat(product.price),
    description: product.description,
    quantity: parseInt(product.quantity),
    sales_tax: parseFloat(product.sales_tax),
  }));

function EstimateAndInvoiceForm({ estimateOrInvoice = null }) {
  //const { companySettings } = useCompanySettingsSelector();
  const { pathname } = useLocation();
  const path = pathname.split("/")[2];
  const { user } = useUserSelector();
  const [client, setClient] = useState("");
  const [products, setProducts] = useState([
    estimateOrInvoice
      ? path === "invoice"
        ? estimateOrInvoice.products
        : estimateOrInvoice.product
      : initialData,
  ]);
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      company_id: user.company._id,
      client_id: estimateOrInvoice?.client._id ?? "",
      title: estimateOrInvoice?.title ?? "",
      currency: user.company.company_settings.currency.symbol,
      due_date: estimateOrInvoice?.due_date ?? "",
      sub_heading: estimateOrInvoice?.sub_heading ?? "",
      products: estimateOrInvoice?.products ?? [],
      sub_total: estimateOrInvoice?.sub_total ?? 0,
      total: estimateOrInvoice?.total ?? 0,
      footer: estimateOrInvoice?.footer ?? "",
      po_so_number: estimateOrInvoice?.po_so_number ?? "",
      [path === "invoice" ? "invoice_date" : "date"]:
        (path === "invoice" ? today : today) ?? "",
      [path === "invoice" ? "note_and_terms_to_client" : "memo"]:
        (path === "invoice"
          ? estimateOrInvoice?.note_and_terms_to_client
          : estimateOrInvoice?.memo) ?? "",
    },
    resolver: zodResolver(schema(path)),
  });

  // clients
  const { data: clientsData, isLoading: clientsLoading } = usePostQuery({
    url: "/company/clients",
    queryKey: [queryKeys.Clients],
  });
  const clients = clientsData?.message.map((client) => ({
    id: client._id,
    label: `${client.first_name} ${client.last_name}`,
  }));

  // All Products Or Services
  const { data: productsOrServicesData, isLoading: productsOrServicesLoading } =
    usePostQuery({
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
    if (client) {
      setValue("client_id", client);
      clearErrors("client_id");
    }
  }, [client, setValue, clearErrors]);

  const quantityChange = (e, idx) => {
    const newProducts = [...products];
    newProducts[idx].quantity = e.target.value;
    setProducts(newProducts);
  };

  const handleChange = (id, idx) => {
    //console.log(idx);
    const product = productsOrServicesData?.message.find(
      (product) => product._id === id
    );
    const newProducts = [...products];
    newProducts[idx] = product
      ? {
          id: product?._id,
          description: product?.description,
          price: parseFloat(product?.price),
          quantity: 1,
          sales_tax: parseFloat(product?.sales_tax),
        }
      : initialData;

    setProducts(newProducts);
  };

  const remove = (idx) => {
    const deleteVal = [...products];
    deleteVal.splice(idx, 1);
    setProducts(deleteVal);
  };

  useEffect(() => {
    // sub total
    const subTotal = products.reduce(
      (amt, item) => amt + item?.price * item?.quantity,
      0
    );
    setValue("sub_total", subTotal);
    setSubTotal(subTotal);

    // total
    const total = products.reduce(
      (amt, item) => amt + item?.price * item?.quantity,
      0
    );
    setValue("total", total);
    setTotal(total);

    // set product IDs
    const productIds = () => {
      const productsData = [];
      for (let product of products) {
        if (!product?.id) continue;

        productsData.push({
          product_id: product?.id,
          quantity: parseInt(product?.quantity),
          price: parseFloat(product?.price),
        });
      }

      return productsData;
    };
    setValue("products", productIds());

    if (subTotal !== 0) {
      clearErrors("products");
    }
  }, [products, estimateOrInvoice, setValue, clearErrors]);

  useEffect(() => {
    if (estimateOrInvoice) {
      setProducts(convertProducts(estimateOrInvoice.products));
      setSubTotal(estimateOrInvoice.sub_total);
      setTotal(estimateOrInvoice.total);
    }
  }, [estimateOrInvoice]);

  const { mutate } = useMutate([
    estimateOrInvoice ? queryKeys.UpdateInvoice : queryKeys.CreateInvoice,
  ]);
  const submitData = (data) => {
    const toastId = toast.loading(
      `${estimateOrInvoice ? "Updating" : "Adding"} ${path}...`
    );

    if (estimateOrInvoice) {
      data[`${path}_id`] = estimateOrInvoice._id;
    }

    console.log({ data });

    mutate(
      {
        url: `/${path}/${estimateOrInvoice ? "update" : "new"}`,
        data,
        method: estimateOrInvoice ? "PATCH" : "POST",
      },
      {
        onSuccess(data) {
          console.log({ message: data });
          toast.dismiss(toastId);
          toast.success(
            `Invoice ${estimateOrInvoice ? "updated" : "added"} successfully`
          );
          navigate(`/payment/${path}`);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      }
    );
  };

  return (
    <div className="px-12 relative">
      <div className="mb-4">
        <Heading
          label={`${estimateOrInvoice ? "Update" : "Add"} an ${capitalize(
            path
          )}`}
        />
      </div>

      <form
        onSubmit={handleSubmit(submitData)}
        className="bg-white px-10 py-5 rounded-md"
      >
        <div className="form-row">
          <InputField
            label={`${capitalize(path)} Title`}
            name="title"
            errors={errors}
            register={register}
            errorMessage="Invoice Title is required"
            required
          />
          <div className="flex-1 ">
            <CustomSelect
              data={clients}
              label="Client"
              onChange={setClient}
              loading={clientsLoading}
              link="/clients/add-client"
              initialValue={estimateOrInvoice?.client._id}
            />
            <ErrorMessage errors={errors} name="client_id" />
          </div>
        </div>

        <div className="border-b mt-4 mb-4"></div>

        <div className="flex gap-6">
          <div className="w-full space-y-2">
            {/* <InputField
              label="Sub Heading"
              name="sub_heading"
              register={register}
              errors={errors}
              required
              errorMessage="Sub Heading is required"
            /> */}
            {/* <div>
              <CustomSelect
                data={currencies}
                label="Currency"
                onChange={setCurrency}
                loading={currenciesLoading}
                initialValue={estimateOrInvoice?.currency}
              />
              <ErrorMessage errors={errors} name="currency" />
            </div> */}{" "}
            <InputField
              type="date"
              label={`${capitalize(path)} date`}
              name={`${path === "invoice" ? "invoice_date" : "date"}`}
              register={register}
              errors={errors}
              required
              errorMessage={`${capitalize(path)} date is required`}
            />
            <InputField
              type="date"
              label="Due Date"
              name="due_date"
              register={register}
              errors={errors}
              required
              errorMessage="Invoice due date is required"
            />
          </div>

          <div className="w-full space-y-2">
            <InputField
              label="P.O/S.O"
              name="po_so_number"
              register={register}
              errors={errors}
            />
            <InputField
              label="Footer"
              name="footer"
              register={register}
              errors={errors}
            />
          </div>

          <div className="w-full space-y-2">
            <TextArea
              label="Memo / Notes"
              name={`${
                path === "invoice" ? "note_and_terms_to_client" : "memo"
              }`}
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
                  loading={productsOrServicesLoading}
                  initialValue={product._id}
                />
              </div>

              <div className="w-[30%]">
                <input
                  type="text"
                  value={products[index]?.description}
                  readOnly
                  className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-300 shadow rounded-md py-3 pl-2 pr-3 sm:text-sm "
                />
              </div>

              <div className="w-[15%]">
                <input
                  type="text"
                  value={products[index]?.price}
                  readOnly
                  className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-300 shadow rounded-md py-3 pl-2 pr-3 sm:text-sm "
                />
              </div>

              <div className="w-[15%]">
                <input
                  type="number"
                  value={products[index]?.quantity}
                  min={1}
                  className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-300 shadow rounded-md py-3 pl-2 pr-3 sm:text-sm "
                  onChange={(e) => quantityChange(e, index)}
                />
              </div>

              <div className="w-[15%]">
                <input
                  type="number"
                  value={products[index]?.sales_tax}
                  readOnly
                  className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-300 shadow rounded-md py-3 pl-2 pr-3 sm:text-sm "
                />
              </div>

              <div className="w-[15%] flex mt-2">
                {user.company.company_settings.currency.symbol}{" "}
                {products[index]?.quantity * parseFloat(products[index]?.price)}
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
              onClick={() => setProducts([...products, initialData])}
              className="flex text-primary cursor-pointer"
            >
              <Icon icon="ei:plus" className="h-5 w-5" />
              Add a line
            </button>
            <div className="space-y-2">
              <div className="flex">
                <div className="flex justify-end mr-5 w-32">SubTotal:</div>
                <div>
                  {user.company.company_settings.currency.symbol}
                  {subTotal}
                </div>
              </div>
              <div className="flex">
                <div className="flex justify-end mr-5 w-32">Total:</div>
                <div>
                  {user.company.company_settings.currency.symbol}
                  {total}
                </div>
              </div>
            </div>
          </div>

          <ErrorMessage errors={errors} name="products" />
        </div>
        <div className="flex justify-end gap-5">
          <button className="w-40 flex justify-center text-md mt-4 p-2 rounded-md bg-primary text-white">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default EstimateAndInvoiceForm;
