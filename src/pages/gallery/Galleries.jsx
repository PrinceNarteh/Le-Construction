import React, { useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import GalleryForm from "../../components/forms/GalleryForm";
import Heading from "../../components/layout/Heading";
import Modal from "../../components/shared/Modal";
import usePostQuery from "../../hooks/usePostQuery";
import { queryKeys } from "../../constants";

const Galleries = () => {
  const [openModal, setOpenModal] = useState(false);
  const { data: galleries, isLoading } = usePostQuery({
    queryKey: [queryKeys.Galleries],
    url: "/company/galleries",
  });

  return (
    <div className="px-12">
      <div className="mb-5 flex justify-between items-center">
        <Heading label="Galleries" />
        {/* <button
          onClick={() => setOpenModal(true)}
          className="bg-primary py-2 px-4 text-xs rounded-md text-white flex items-center gap-1"
        >
          <Icon icon="ant-design:plus-circle-outlined" className="font-bold" />
          <span>Add Gallery</span>
        </button> */}
      </div>
      {isLoading ? <Spinner isSubmitting={isLoading} /> : null}
      <div className="flex flex-wrap gap-5 bg-white p-5 justify-center">
        {galleries?.message.map((gallery, idx) => (
          <Link
            key={idx}
            to={`/galleries/${gallery._id}`}
            className="relative w-[350px] h-[250px] bg-white rounded-lg border shadow-sm shadow-primary cursor-pointer group"
          >
            <div className="relative w-full h-full p-2">
              <div className="w-full h-full overflow-hidden rounded-md">
                <img
                  src={gallery.thumbnail}
                  alt=""
                  className="h-full object-cover group-hover:scale-105 duration-1000"
                />
              </div>
              <div className="absolute top-0 left-0 right-0 bottom-2 w-full text-white p-5   overflow-hidden">
                <div className="inset-2 flex flex-col justify-end pb-3 px-2 rounded-b-md absolute bottom-0 bg-gradient-to-t from-black/100 to-black/0">
                  <h3 className="font-bold line-clamp-1">
                    {gallery.gallery_title}
                  </h3>
                  <p className="line-clamp-2 text-xs my-1">
                    {gallery.gallery_description}
                  </p>
                  <p className="text-xs line-clamp-1">
                    <span className="font-bold">Category:</span>{" "}
                    {gallery.project_category.category_name}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Modal
        width="max-w-2xl"
        openModal={openModal}
        closeModal={setOpenModal}
        className="place-content-start"
      >
        <GalleryForm />
      </Modal>
    </div>
  );
};

export default Galleries;
