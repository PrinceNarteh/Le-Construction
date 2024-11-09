import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { z } from "zod";
import { queryKeys } from "../../../constants";
import useMutate from "../../../hooks/useMutate";
import usePostQuery from "../../../hooks/usePostQuery";
import { useSetCompany } from "../../../hooks/useSetCompany";
import CustomFileInput from "../../shared/CustomFileInput";
import CustomSelect from "../../shared/CustomSelect";
import ErrorMessage from "../../shared/ErrorMessage";
import InputField from "../../shared/InputField";
import TextArea from "../../shared/TextArea";
import { useCompanySelector } from "../../../hooks/useCompanySelector";
import { useCompanySettingsSelector } from "../../../hooks/useCompanySettings";
import { setWebsite } from "../../../app/feature/company/websiteSlice";

const schema = z.object({
  company_id: z.string().min(1, "Company ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  client: z.string().min(1, "Please select client"),
  location: z.string().min(1, "Please provide location"),
  area: z.string().min(1, "Area is required"),
  year: z.coerce.number().min(1, "Year is required"),
  budget: z.number().gt(0, "Budget is required"),
  architect: z.string().min(1, "Architect is required"),
  category: z.string().min(1, "Please select category"),
  date: z.string().min(1, "Please select date"),
  project_images: z.any(),
});

const WebsiteProjectForm = ({ setOpenForm }) => {
  const { companySettings } = useCompanySettingsSelector();
  const { company } = useCompanySelector();
  const [amount, setAmount] = useState(0);
  const [clientId, setClientId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const {
    register,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_id: company?.website_id,
      title: "",
      description: "",
      client: "",
      location: "",
      area: "",
      year: "",
      budget: "",
      architect: "",
      category: "",
      date: "",
      project_images: [],
    },
    resolver: zodResolver(schema),
  });

  // Get Categories
  const { data: categories, isLoading } = usePostQuery({
    queryKey: [queryKeys.Categories],
    url: "/all/categories/for/company",
  });

  const categoriesData = categories?.message.map((category) => ({
    id: category.category_name,
    label: category.category_name,
  }));

  // Get Clients
  const { data: clients, isLoading: loadingClients } = usePostQuery({
    url: "/company/clients",
    queryKey: [queryKeys.Clients],
  });

  const clientsData = clients?.message.map((client) => ({
    label: `${client.first_name} ${client.last_name}`,
    id: `${client.first_name} ${client.last_name}`,
  }));

  const handleChange = (_, maskedvalue) => {
    setAmount(maskedvalue);
    setValue("budget", parseFloat(maskedvalue?.replaceAll(",", "")));
    clearErrors("budget");
  };

  function deleteSelectedImage(index) {
    const imageCopy = [...images];
    if (images.length === 1) {
      setImages([]);
      setPreviewImages([]);
    } else {
      imageCopy.splice(index, 1);
      setImages([...imageCopy]);
    }
  }

  const { mutate } = useMutate();
  const setCompany = useSetCompany();
  const submit = (inputData) => {
    const toastId = toast.loading(`Creating ${inputData.title}...`);
    const formData = new FormData();
    Object.entries(inputData).forEach((item) => {
      formData.append(...item);
    });

    for (let image of inputData.project_images) {
      formData.append("project_images", image);
    }

    mutate(
      {
        url: "/website/project",
        method: "PATCH",
        data: formData,
        multipart: true,
      },
      {
        onSuccess(data) {
          setWebsite(data.message);
          toast.dismiss(toastId);
          toast.success(`${inputData.title} created successfully`);
          setOpenForm(false);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      }
    );
  };

  useEffect(() => {
    if (images) {
      setValue("project_images", images);
      setPreviewImages(images.map((image) => URL.createObjectURL(image)));
    }
  }, [images, setValue]);

  useEffect(() => {
    if (categoryId) {
      setValue("category", categoryId);
      clearErrors("category");
    }
  }, [categoryId, setValue, clearErrors]);

  useEffect(() => {
    if (clientId) {
      setValue("client", clientId);
      clearErrors("client");
    }
  }, [clientId, setValue, clearErrors]);

  return (
    <div className="p-5">
      <h3 className=" text-blue-900 text-3xl font-bold">Add Project</h3>
      <form onSubmit={handleSubmit(submit)}>
        <div className="form-row">
          <InputField
            register={register}
            errors={errors}
            name="title"
            label="Title"
            required
          />
          <div className="flex-1 mt-2">
            <label className="block mb-1 text-blue-900 text-md font-semibold whitespace-nowrap">
              Budget ({companySettings?.currency?.symbol})
            </label>
            <CurrencyInput
              onChangeEvent={handleChange}
              value={amount}
              className="currency-input"
            />
            <ErrorMessage name="budget" errors={errors} />
          </div>
        </div>
        <div className="form-row">
          <InputField
            register={register}
            errors={errors}
            name="location"
            label="Location"
            required
          />
          <InputField
            register={register}
            errors={errors}
            name="area"
            label="Area (m2)"
            required
          />
          <InputField
            register={register}
            errors={errors}
            name="architect"
            label="Architect"
            required
          />
        </div>
        <div className="form-row">
          <InputField
            register={register}
            errors={errors}
            type="date"
            name="date"
            label="Date"
            required
          />
          <InputField
            register={register}
            errors={errors}
            type="number"
            name="year"
            label="Year"
            required
          />
        </div>
        <div className="form-row">
          <div className=" flex-1">
            <CustomSelect
              label="Project Category"
              data={categoriesData}
              placeholder="Select Category..."
              onChange={setCategoryId}
              loading={isLoading}
            />
            <ErrorMessage name="category" errors={errors} />
          </div>
          <div className=" flex-1">
            <CustomSelect
              label="Client"
              data={clientsData}
              placeholder="Select client..."
              onChange={setClientId}
              loading={loadingClients}
            />
            <ErrorMessage name="client" errors={errors} />
          </div>
        </div>
        <div className="form-row">
          <TextArea
            name="description"
            errors={errors}
            label="Description"
            register={register}
            required
          />
        </div>

        {/* Project Images */}
        <div className="flex gap-5 justify-center overflow-x-auto py-3">
          {previewImages.map((image, index) => (
            <div
              key={index}
              className="relative h-32 w-32 shrink-0 rounded-md bg-slate-500"
            >
              <AiOutlineCloseCircle
                onClick={() => deleteSelectedImage(index)}
                className="absolute -right-2 -top-2 z-0 cursor-pointer rounded-full bg-white text-2xl text-orange-500"
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
        <CustomFileInput
          height="h-28"
          label="Project Images"
          onChange={setImages}
          multiple
          required
        />
        {/* <div className="my-4">
          <label
            className="mb-1 block text-blue-900 text-md font-semibold leading-loose"
            htmlFor="user_avatar"
          >
            Select Project Image(s)
          </label>
          <input
            className="block w-full cursor-pointer rounded-lg border bg-dark-gray file:border-none file:bg-primary font-bold file:px-5 file:py-3 file:text-white"
            aria-describedby="user_avatar_help"
            id="user_avatar"
            type="file"
            onChange={(e) => selectedImages(e)}
            multiple
            accept=".png, .jpg, .jpeg"
          />
        </div> */}

        <div className="flex justify-end mt-5">
          <button className="bg-primary text-white text-sm py-1.5 px-5">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default WebsiteProjectForm;
