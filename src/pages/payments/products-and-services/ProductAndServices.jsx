import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

import Spinner from "../../../components/Spinner";
import AddProductOrSevicesForm from "../../../components/forms/payments/AddProductOrSevicesForm";
import Heading from "../../../components/layout/Heading";
import Modal from "../../../components/shared/Modal";
import { queryKeys } from "../../../constants";
import useConfirm from "../../../hooks/useConfirm";
import useMutate from "../../../hooks/useMutate";
import usePostQuery from "../../../hooks/usePostQuery";
import { useQueryClient } from "@tanstack/react-query";
import useFormatCurrency from "../../../hooks/useFormatCurrency";
import { Skeleton } from "../../../components/skeleton/Skeleton";

function ProductAndServices() {
  const { formatCurrency } = useFormatCurrency();
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [productOrService, setProductOrService] = useState(null);
  const { confirm, ConfirmationDialog, setIsOpen } = useConfirm();
  const { data: productsOrServices, isLoading } = usePostQuery({
    url: "/pands/all",
    queryKey: [queryKeys.ProductsAndServices],
  });

  const { mutate } = useMutate([queryKeys.DeleteProductOrService]);
  const handleDelete = async (data) => {
    const yes = await confirm({
      title: "Are You Sure?",
      message: `Are you sure you want to delete: ${data.name}?`,
    });
    if (yes) {
      const toastId = toast.loading("Deleting Product/Service");

      mutate(
        {
          url: `/pands/${data._id}`,
          method: "DELETE",
        },
        {
          onSuccess: async () => {
            await queryClient.setQueryData(
              [queryKeys.ProductsAndServices],
              (oldData) => ({
                message: (oldData?.message ?? []).filter(
                  (item) => item._id !== data._id,
                ),
              }),
            );
            toast.dismiss(toastId);
            toast.success("Product/Service deleted successfully");
            setIsOpen(false);
          },
          onError(error) {
            toast.dismiss(toastId);
            toast.error(error.response.data.message);
          },
        },
      );
    }
  };

  useEffect(() => {
    if (!openModal) {
      setProductOrService(null);
    }
  }, [openModal]);

  return (
    <div className="pl-20 pr-20 mt-5 cursor-pointer">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Heading label="Products & Services" />
        </div>

        <div
          onClick={() => setOpenModal(true)}
          className="w-56 bg-primary font-semibold flex justify-center items-center p-3 rounded-md"
        >
          <div className="text-white text-md">Add a Product or Services </div>
        </div>
      </div>
      {isLoading ? (
        <div className=" mt-5">
          <div className="flex text-slate-400 text-[16px] font-bold leading-tight">
            <div className="w-[80%]">
              <Skeleton className="w-20" />
            </div>
            <div className="w-[15%]">
              <Skeleton className="w-20" />
            </div>
            <div className="w-[10%]">
              <Skeleton className="w-20" />
            </div>
          </div>
          <>
            {Array(3)
              .fill(null)
              .map(() => (
                <div className="flex items-center text-black text-[16px] font-semibold leading-tight border-b py-6">
                  <div className="w-[80%] space-y-1">
                    <Skeleton className="w-60" />
                  </div>
                  <div className="w-[15%]">
                    <Skeleton className="w-20" />
                  </div>
                  <div className="w-[10%] flex">
                    <Skeleton className="w-20" />
                  </div>
                </div>
              ))}
          </>
        </div>
      ) : (
        <>
          <div className=" mt-5">
            <div className="flex text-slate-400 text-[16px] font-bold leading-tight ml-2">
              <div className="w-[80%]">Name</div>
              <div className="w-[15%]">Price</div>
              <div className="w-[10%]">Action</div>
            </div>

            <div className="border-b border-black mt-4 mb-2"></div>

            {isLoading && <Spinner isSubmitting={true} />}

            {productsOrServices?.message?.length === 0 ? (
              <div className="h-14 bg-neutral-300 border bg-opacity-10 w-full mt-4 mb-4 rounded-md border-l-8 border-l-primary flex items-center">
                <Icon
                  icon="solar:danger-circle-broken"
                  className="ml-5 mr-1 text-primary h-5 w-5"
                />
                <div className=" text-neutral-500 font-semibold">
                  You don't have any products or services. Why not
                  <Link
                    className="ml-1 text-primary"
                    onClick={() => setOpenModal(true)}
                  >
                    Add a product or service ?
                  </Link>
                </div>
              </div>
            ) : (
              productsOrServices?.message.map((productOrService, index) => (
                <div
                  className="flex items-center text-black text-[16px] font-semibold leading-tight border-b py-4"
                  key={index}
                >
                  <div className="w-[80%] space-y-1">
                    <div>{productOrService.name}</div>
                    <div className="text-slate-500">
                      {productOrService.description}
                    </div>
                  </div>
                  <div className="w-[15%]">
                    {formatCurrency(productOrService.price)}
                  </div>
                  <div className="w-[10%] flex">
                    <button
                      onClick={() => {
                        setProductOrService(productOrService);
                        setOpenModal(true);
                      }}
                    >
                      <Icon
                        icon="iconamoon:edit-light"
                        className="mt-[0.7rem] h-5 w-5 ml-3 text-orange-900"
                      />
                    </button>
                    <button onClick={() => handleDelete(productOrService)}>
                      <Icon
                        icon="fluent:delete-28-regular"
                        className="mt-[0.7rem] h-5 w-5 ml-3 text-red-500"
                      />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <Modal openModal={openModal} closeModal={setOpenModal}>
            <AddProductOrSevicesForm
              productOrService={productOrService}
              closeModal={async () => {
                setOpenModal(false);
              }}
            />
          </Modal>

          {ConfirmationDialog()}
        </>
      )}
    </div>
  );
}

export default ProductAndServices;
