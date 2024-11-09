import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AiOutlineCloseCircle } from "react-icons/ai";
import CurrencyInput from "react-currency-input";
import { useNavigate } from "react-router-dom";

import Spinner from "../../components/Spinner";
import GoogleMaps from "../../components/shared/GoogleMaps";
import InputField from "../../components/shared/InputField";
import { queryKeys } from "../../constants";
import useAlert from "../../hooks/useAlert";
import useCountries from "../../hooks/useCountries";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";
import { useUserSelector } from "../../hooks/useUserSelector";
import { convertBase64 } from "../../utils/convertBase64";
import CustomSelect from "../shared/CustomSelect";
import Modal from "../shared/Modal";
import CategoryForm from "./CategoryForm";
import ClientForm from "./ClientForm";
import { useCompanySettingsSelector } from "../../hooks/useCompanySettings";
import { Icon } from "@iconify/react";

const defaultValues = {
  project_name: "",
  project_description: "",
  client_id: "",
  project_category_id: "",
  budget: "",
  start_date: "",
  end_date: "",
  project_images: [],
  lat: "",
  long: "",
  street: "",
  city: "",
  state: "",
  country: "",
  country_code: "",
  company_id: "",
  has_ar: false,
};

function ProjectForm({ setOpenProjectForm }) {
  const alert = useAlert();
  const { user } = useUserSelector();
  const { companySettings } = useCompanySettingsSelector();
  const [images, setImages] = useState([]);
  const [amount, setAmount] = useState(0.0);
  const [previewImages, setPreviewImages] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [clientId, setClientId] = useState("");
  const [country, setCountry] = useState("");
  const [openCategoryForm, setOpenCategoryForm] = useState(false);
  const [openClientForm, setOpenClientForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 0,
    lng: 0,
    country: "",
    city: "",
    state: "",
    street: "",
  });

  const {
    clearErrors,
    setValue,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues,
  });

  const handleChange = (_, maskedvalue) => {
    setAmount(maskedvalue);
    setValue(
      "maximum_bid_amount",
      parseFloat(maskedvalue?.replaceAll(",", ""))
    );
    clearErrors("budget");
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  // Get Countries
  const { countries } = useCountries({
    setValue,
    clearErrors,
    fieldName: "country",
    fieldValue: country,
  });

  // Get Categories
  const { data: categories, refetch: refetchCategory } = usePostQuery({
    url: "/all/categories/for/company",
    queryKey: [queryKeys.Categories],
  });

  const categoriesData = categories?.message.map((category) => ({
    id: category._id,
    label: category.category_name,
  }));

  useEffect(() => {
    if (categoryId) {
      setValue("project_category_id", categoryId);
    }
  }, [categoryId, setValue]);

  // Get Clients
  const { data: clients } = usePostQuery({
    url: "/company/clients",
    queryKey: [queryKeys.Clients],
  });

  const clientsData = clients?.message.map((client) => ({
    id: client._id,
    label: `${client.first_name} ${client.last_name}`,
  }));

  useEffect(() => {
    if (clientId) {
      setValue("client_id", clientId);
    }
  }, [clientId, setValue]);

  const selectedImages = (e) => {
    const files = e.target.files;
    let pickedImages = [];
    if (files !== null) {
      pickedImages = Array.from(files);
    }
    const newImages = [...images, ...pickedImages];
    setImages(newImages);
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

  useEffect(() => {
    const getImages = () => {
      const imagesArray = [];
      images?.map((file) =>
        convertBase64(file)
          .then((res) => {
            imagesArray.push(res);
          })
          .finally(() => {
            setPreviewImages(imagesArray);
          })
      );
    };
    getImages();
  }, [images]);

  const navigate = useNavigate();
  const createProjectMutation = useMutate([queryKeys.CreateCompany]);
  const submitHandler = async (data) => {
    // alert.showLoading('Creating Project')
    const formData = new FormData();

    //check if user has selected location from map
    if (selectedLocation.lat === 0 && selectedLocation.lng === 0) {
      alert.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a location from the map",
      });
      return;
    }

    const toastId = toast.loading("Creating project...");

    if (data.street === "") {
      data.company_id = user.company_id;
      data.street = selectedLocation.street;
      data.city = selectedLocation.city;
      data.state = selectedLocation.state;
      data.country = selectedLocation.country;
      data.lat = selectedLocation.lat;
      data.long = selectedLocation.lng;
    } else {
      data.company_id = user.company_id;
      data.lat = selectedLocation.lat;
      data.long = selectedLocation.lng;
    }

    Object.entries(data).map((entry) => formData.append(entry[0], entry[1]));

    for (let image of data.project_images) {
      formData.append("project_images", image);
    }

    createProjectMutation.mutate(
      {
        url: "/project/new",
        data: formData,
        multipart: true,
      },
      {
        onSuccess(data) {
          toast.dismiss(toastId);
          toast.success("Project created successfully");
          setOpenProjectForm(false);
          navigate(`/projects/${data.message._id}`);
        },
        onError() {
          toast.dismiss(toastId);
          toast.error("Error creating project");
        },
      }
    );
  };

  useEffect(() => {
    setValue("project_images", images);
  }, [images, setValue]);

  return (
    <div className="">
      <Spinner isSubmitting={createProjectMutation.isLoading} />

      <div className=" flex justify-center">
        <div className="w-full pt-5 px-3 lg:px-10">
          <div className=" text-blue-900 text-2xl font-bold">Add Project</div>
          <div className=" text-slate-400 text-[16px] font-normal">
            Add the details of the Project below.
          </div>

          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="bg-white px-5 rounded-xl mb-5">
              <div className="bg-white">
                <div className="space-y-2">
                  <div className="form-row">
                    <InputField
                      label="Project Name"
                      name="project_name"
                      errors={errors}
                      register={register}
                      required
                      errorMessage="Project name is required"
                    />

                    <InputField
                      label="Project Description"
                      name="project_description"
                      errors={errors}
                      register={register}
                      required
                      errorMessage="Project description is required"
                    />
                  </div>
                  <div className="form-row">
                    <div className=" flex-1 my-3">
                      <CustomSelect
                        label="Project Category"
                        data={categoriesData}
                        placeholder="Select Category..."
                        onChange={setCategoryId}
                        actionButton={() => setOpenCategoryForm(true)}
                      />
                    </div>
                    <div className=" flex-1 mt-3 mb-3">
                      <CustomSelect
                        label="Client"
                        data={clientsData}
                        placeholder="Select client..."
                        onChange={setClientId}
                        actionButton={() => setOpenClientForm(true)}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <InputField
                      type="date"
                      label="Start Date"
                      name="start_date"
                      errors={errors}
                      register={register}
                      required
                      errorMessage="Start date is required"
                    />

                    <InputField
                      type="date"
                      label="End Date"
                      name="end_date"
                      errors={errors}
                      register={register}
                      required
                      errorMessage="End date is required"
                    />
                  </div>
                  <div className="form-row">
                    <div className="flex-1 mt-2">
                      <label className="block mb-1 text-blue-900 text-md font-semibold whitespace-nowrap">
                        Budget ({companySettings?.currency.symbol})
                      </label>
                      <CurrencyInput
                        onChangeEvent={handleChange}
                        value={amount}
                        className="currency-input"
                      />
                    </div>

                    <InputField
                      label="Street"
                      name="street"
                      errors={errors}
                      register={register}
                      // set selected location to form data if user selects location from map
                      value={selectedLocation?.street}
                    />
                  </div>
                  <div className="form-row">
                    <InputField
                      label="City"
                      name="city"
                      errors={errors}
                      register={register}
                      // set selected location to form data if user selects location from map
                      value={selectedLocation?.city}
                    />

                    <InputField
                      label="State"
                      name="state"
                      errors={errors}
                      register={register}
                      // set selected location to form data if user selects location from map
                      value={selectedLocation?.state}
                    />
                  </div>
                  <div className="form-row">
                    <div className="flex-1">
                      <CustomSelect
                        data={countries}
                        label="Country"
                        placeholder="Select country..."
                        onChange={setCountry}
                      />
                      {errors["country"] && (
                        <span className="text-red-500 text-[12px]">
                          {errors["country"].message}
                        </span>
                      )}
                    </div>
                  </div>

                  <GoogleMaps onLocationChange={handleLocationChange} />

                  {/* Project Images */}
                  <div className="py-5">
                    <label className="block text-blue-900 text-md font-semibold mb-1">
                      Select Project Image(s)
                    </label>

                    {previewImages.length > 0 ? (
                      <div className="flex justify-center gap-5 overflow-x-auto py-3">
                        {previewImages.map((image, index) => (
                          <div
                            key={index}
                            className="relative h-32 w-32 shrink-0 rounded-md bg-slate-500"
                          >
                            <AiOutlineCloseCircle
                              onClick={() => deleteSelectedImage(index)}
                              className="absolute -right-2 -top-2 z-10 cursor-pointer rounded-full bg-white text-2xl text-orange-500"
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

                    <label
                      htmlFor="dropzone-file"
                      className={`flex-1 w-full flex items-center justify-center  border-2 border-primary bg-[#F4F6FB] border-dashed rounded-lg cursor-pointer p-2`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Icon
                          icon="line-md:cloud-upload-outline-loop"
                          className="w-10 h-10 text-gray-400"
                        />
                        <div className="text-center">
                          <span className="text-blue-900 text-[15px] font-bold">
                            Drop your logo here, or
                          </span>
                          <span className="text-red-500 text-[15px] font-bold ml-2">
                            browse
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG and GIF files are allowed
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={(e) => selectedImages(e)}
                        multiple
                      />
                    </label>
                  </div>
                  <div className="flex justify-end">
                    <button className="text-white text-md font-bold leading-loose w-60 h-12 py-5 bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex mt-4">
                      Add Project
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Modal openModal={openCategoryForm} closeModal={setOpenCategoryForm}>
        <CategoryForm
          refetch={refetchCategory}
          closeModal={() => setOpenCategoryForm(false)}
        />
      </Modal>

      <Modal
        openModal={openClientForm}
        closeModal={setOpenClientForm}
        width="max-w-3xl"
        className="place-content-start"
      >
        <ClientForm closeModal={() => setOpenClientForm(false)} />
      </Modal>
    </div>
  );
}

export default ProjectForm;
