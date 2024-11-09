import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import CategoryForm from "../../components/forms/CategoryForm";
import Heading from "../../components/layout/Heading";
import Modal from "../../components/shared/Modal";
import Table from "../../components/shared/Table";
import { queryKeys } from "../../constants/queryKeys";
import useConfirm from "../../hooks/useConfirm";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";
import { capitalize } from "../../utils/capitalize";

function Categories() {
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const [openModal, setOpenModal] = useState(false);
  const [category, setCategory] = useState(null);

  const { data, isLoading, refetch, isRefetching } = usePostQuery({
    queryKey: [queryKeys.Categories],
    url: "/all/categories/for/company",
  });

  const handleEdit = (category) => {
    setOpenModal(true);
    setCategory(category);
  };

  const { mutate } = useMutate([queryKeys.DeleteCategory]);
  const handleDelete = async (category) => {
    const isConfirmed = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to delete "${capitalize(
        category.category_name,
      )}"`,
    });

    if (isConfirmed) {
      const toastId = toast.loading("Deleting category...");
      mutate(
        {
          url: "/delete/category",
          method: "DELETE",
          data: {
            category_id: category._id,
          },
        },
        {
          async onSuccess() {
            await refetch();
            toast.dismiss(toastId);
            toast.success("Category deleted successfully!");
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
      setCategory(null);
    }
  }, [openModal]);

  const categories = data ? data?.message : [];
  const columns = [
    {
      id: "SN",
      header: "SN",
      accessorKey: "",
      cell: (info) => <span className="px-1">{info.row.index + 1}</span>,
    },
    {
      accessorKey: "category_name",
      header: "Category",
      cell: (cell) => (
        <span className="">{cell.row.original.category_name}</span>
      ),
    },
    {
      header: "Icon",
      cell: (cell) => (
        <img
          src={cell.row.original.category_icon}
          alt={cell.row.original.category_name}
          className="w-8 h-8 mt-2 rounded-full object-cover cursor-pointer"
        />
      ),
    },
    {
      header: "Actions",
      cell: (props) => (
        <span className="flex items-center gap-5">
          <button
            onClick={() => handleEdit(props.row.original)}
            className="p-2"
          >
            <Icon icon="iconamoon:edit-light" className="text-xl" />
          </button>
          <button onClick={() => handleDelete(props.row.original)}>
            <Icon
              icon="fluent:delete-28-regular"
              className="text-red-500 text-xl"
            />
          </button>
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="ml-9 flex justify-between items-center">
        <Heading label="Categories" />
      </div>

      <div className="px-12 mx-auto">
        <div className="w-full mt-7 rounded-lg p-5">
          {!(isLoading || isRefetching) && categories.length === 0 ? (
            <div className="h-14 bg-neutral-300 border bg-opacity-10 w-full mt-4 mb-4 rounded-md border-l-8 border-l-primary flex items-center">
              <Icon
                icon="solar:danger-circle-broken"
                className="ml-5 mr-1 text-primary h-5 w-5"
              />
              <div className=" text-neutral-500 font-semibold">
                You don't have any categories. Why not
                <button
                  onClick={() => setOpenModal(true)}
                  className="ml-1 text-primary"
                >
                  Add a category?
                </button>
              </div>
            </div>
          ) : (
            <Table
              loading={isLoading || isRefetching}
              data={categories}
              columns={columns}
              actionButton={() => (
                <button
                  onClick={() => setOpenModal(true)}
                  className="py-2 px-7 bg-primary text-white text-xs rounded"
                >
                  Add Category
                </button>
              )}
            />
          )}
        </div>
      </div>

      <Modal openModal={openModal} closeModal={setOpenModal}>
        <CategoryForm
          refetch={refetch}
          category={category}
          closeModal={() => setOpenModal(false)}
        />
      </Modal>

      {ConfirmationDialog()}
    </div>
  );
}

export default Categories;
