import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

import Spinner from "../../components/Spinner";
import ImportImagesForm from "../../components/forms/ImportImagesForm";
import CustomSelect from "../../components/shared/CustomSelect";
import Modal from "../../components/shared/Modal";
import { queryKeys } from "../../constants";
import useConfirm from "../../hooks/useConfirm";
import { useGetQuery } from "../../hooks/useGetQuery";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";

const GalleryDetails = () => {
  const [current, setCurrent] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [openModalGallery, setOpenModalGallery] = useState(false);
  const [openModalProject, setOpenModalProject] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [images, setImages] = useState([]);

  const { galleryId } = useParams();
  const {
    data: gallery,
    isLoading,
    isRefetching,
    refetch,
  } = useGetQuery({
    queryKey: [queryKeys.ProjectsForCompany, galleryId],
    url: `/gallery/${galleryId}`,
  });

  const [isOpen, setIsOpen] = useState(false);

  const modalRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const { data: projects, isLoading: projectLoading } = usePostQuery({
    queryKey: [queryKeys.ProjectsForCompany],
    url: "/projects/for/company",
  });

  const next = () => {
    if (current + 1 > images.length - 1) {
      setCurrent(0);
    } else {
      setCurrent((prevState) => prevState + 1);
    }
  };

  const prev = () => {
    if (current - 1 < 0) {
      setCurrent(images.length - 1);
    } else {
      setCurrent((prevState) => prevState - 1);
    }
  };

  const projectsData = projects?.message.map((project) => {
    if (project.file_type !== 'usdz' && project.file_type !== 'video') {
      return ({
        id: project._id,
        label: project.project_name,
      })
    }
  });

  useEffect(() => {
    let handler = (e) => {
      if (!modalRef?.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousemove", handler);
  }, [isOpen]);

  useEffect(() => {
    if (!openModal) {
      setImages([]);
    }
  }, [openModal]);

  const groups = gallery?.message.groups ?? [];

  const { mutate } = useMutate([queryKeys.ImportImageToGallery]);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!projectId) {
      toast.error("Please select a project");
      return;
    }

    const toastId = toast.loading("Importing images...");

    mutate(
      {
        url: "/import/gallery/from/project",
        data: {
          gallery_id: galleryId,
          project_id: projectId,
        },
      },
      {
        async onSuccess() {
          await refetch();
          toast.dismiss(toastId);
          toast.success("Images imported successfully");
          setOpenModalProject(false);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error("Error importing images");
        },
      }
    );
  };

  // Delete Gallery
  const navigate = useNavigate();
  const { confirm, ConfirmationDialog, setIsOpen: openAlert } = useConfirm();
  const { mutate: deleteGalleryMutate } = useMutate([queryKeys.DeleteGallery]);
  const deleteGallery = async () => {
    const isConfirmed = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to delete "${gallery?.message.gallery_title}"?`,
    });

    if (isConfirmed) {
      const toastId = toast.loading(
        `Deleting ${gallery?.message.gallery_title}...`
      );

      deleteGalleryMutate(
        {
          url: "/delete/gallery",
          method: "DELETE",
          data: {
            gallery_id: galleryId,
          },
        },
        {
          async onSuccess(data) {
            toast.dismiss(toastId);
            toast.success(
              `${gallery?.message.gallery_title} deleted successfully`
            );
            openAlert(false);
            navigate("/galleries");
          },
          onError(error) {
            toast.dismiss(toastId);
            toast.error(error.response.data.message);
            openAlert(false);
          },
        }
      );
    }
  };

  if (projectLoading) return <Spinner isSubmitting={isLoading} />;

  return (
    <div className="px-10">
      <div className="bg-white p-10 mt-5 mb-10 space-y-4 rounded-md">
        <div
          className="flex flex-col gap-5 justify-between lg:flex-row"
          ref={modalRef}
        >
          <div>
            <h3 className="text-primary text-3xl mb-1">
              {gallery?.message.gallery_title}
            </h3>
            <p className="text-xl text-gray-500">
              <span className="font-bold text-gray-600">Category:</span>{" "}
              {gallery?.message.project_category.category_name}
            </p>
          </div>
          <div className="relative flex items-center gap-3 text-left cursor-pointer">
            <div>
              <button
                onClick={toggleDropdown}
                className="flex items-center bg-primary py-2 px-3 rounded-md text-white "
              >
                <p className="text-xs">Add Gallery</p>
                <Icon icon="solar:import-broken" className="ml-1" />
              </button>

              {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <div
                      onClick={() => setOpenModalGallery(true)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-semibold"
                      role="menuitem"
                    >
                      Import Images from Computer
                    </div>

                    <div
                      onClick={() => setOpenModalProject(true)}
                      className="block px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Import Images from Project
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => deleteGallery()}
              className="text-red-500 text-xs border inline-flex items-center gap-1 border-red-500 py-2 rounded-md px-3"
            >
              <Icon
                icon="fluent:delete-28-regular"
                className="cursor-pointer text-red-500"
              />
              Delete
            </button>
          </div>
        </div>
      </div>

      {isRefetching ? (
        <Spinner isSubmitting={isRefetching} />
      ) : (
        <div className="grid grid-auto-fit-xl justify-center gap-5">
          {groups.map((group, idx) => (
            <div
              key={idx}
              onClick={() => {
                setImages(group.photos);
                setOpenModal(true);
              }}
              className="max-w-sm p-3 border border-red-500 bg-white rounded space-y-2 cursor-pointer"
            >
              <div className="rounded-md overflow-hidden h-60">
                <img
                  src={group.photos[0]}
                  alt=""
                  className="h-60 object-cover"
                />
              </div>
              <div className="p-2 rounded-md bg-gray-100">
                <h3 className="line-clamp-1 font-semibold">
                  {group.project_name}
                </h3>
                <p className="text-sm">
                  <span className="font-bold">Client:</span> {group.client_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className={`fixed top-0 right-0 bottom-0 left-60 min-h-screen  p-5 overflow-y-auto  bg-black/80 z-50 transform ${
          openModal ? "scale-100 opacity-100" : "scale-0 opacity-0"
        } duration-500`}
      >
        <div className={`relative rounded-xl w-full mx-auto h-full`}>
          <button
            onClick={() => {
              setCurrent(0);
              setOpenModal(false);
            }}
            className="absolute right-2 top-0 z-50 text-primary w-10 h-10 cursor-pointer"
          >
            <IoIosCloseCircleOutline size={35} />
            {/* <Icon icon="line-md:close-circle-twotone" className="text-4xl" /> */}
          </button>
          <div id="default-carousel" className="relative w-full h-[85%]">
            <div className="overflow-hidden rounded-lg">
              {/* images */}
              {images.map((image, idx) => (
                <div
                  key={idx}
                  className={`${
                    current === idx ? "opacity-100" : "opacity-0"
                  } duration-700 ease-in-out`}
                  data-carousel-item
                >
                  <img
                    src={image}
                    className="aspect-auto absolute block h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                    alt="..."
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => prev()}
              type="button"
              className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white">
                <FaChevronCircleLeft size={35} />
                <span className="sr-only">Previous</span>
              </span>
            </button>
            <button
              onClick={() => next()}
              type="button"
              className="absolute top-0 right-0 z-10 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white">
                <FaChevronCircleRight size={35} />
                <span className="sr-only">Previous</span>
              </span>
            </button>
          </div>
          {/* thumbnail */}
          <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-0 left-1/2">
            {Array(images.length)
              .fill(null)
              .map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer ${
                    current === idx ? "ring-4 ring-primary p-1" : ""
                  }`}
                >
                  <img
                    src={images[idx]}
                    alt=""
                    className={`w-20 h-20 object-cover rounded-md`}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      <Modal openModal={openModalGallery} closeModal={setOpenModalGallery}>
        <ImportImagesForm
          gallery={gallery?.message}
          setOpenModal={setOpenModalGallery}
          projects={projectsData}
          refetch={refetch}
        />
      </Modal>

      <Modal openModal={openModalProject} closeModal={setOpenModalProject}>
        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-7">
            <h3 className="font-bold text-blue-900 text-2xl ">
              Import Images from Project
            </h3>
          </div>
          <CustomSelect
            label="Project"
            placeholder="Select project..."
            data={projectsData}
            onChange={setProjectId}
          />
          <div className="flex gap-5 justify-end mt-3">
            <div className="w-32 mt-5 h-10 bg-gradient-to-r from-primary to-secondary rounded-md shadow justify-center items-center gap-2.5 flex">
              <button className="text-white text-md font-bold leading-loose">
                Import
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Gallery  */}
      {ConfirmationDialog()}
    </div>
  );
};

export default GalleryDetails;
