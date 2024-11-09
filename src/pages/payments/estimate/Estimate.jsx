import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

import Spinner from "../../../components/Spinner";
import Heading from "../../../components/layout/Heading";
import DetailsModal from "../../../components/shared/DetailsModal";
import Table from "../../../components/shared/Table";
import { queryKeys } from "../../../constants";
import useConfirm from "../../../hooks/useConfirm";
import useMutate from "../../../hooks/useMutate";
import usePostQuery from "../../../hooks/usePostQuery";
import EstimateDetails from "./EstimateDetails";
import useFormatCurrency from "../../../hooks/useFormatCurrency";

function Estimate() {
  const queryClient = useQueryClient();
  const { formatCurrency } = useFormatCurrency();
  const [estimate, setEstimate] = useState(null);
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const { data, isLoading } = usePostQuery({
    queryKey: [queryKeys.Estimates],
    url: "/estimate/all",
  });

  //console.log(data);
  const { mutate } = useMutate([queryKeys.DeleteEstimate]);
  const handleDelete = async (estimate) => {
    const isConfirmed = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to delete "${estimate.title}"`,
    });

    if (isConfirmed) {
      const toastId = toast.loading("Deleting estimate...");
      mutate(
        {
          url: "/estimate/delete",
          method: "DELETE",
          data: {
            estimate_id: estimate._id,
          },
        },
        {
          async onSuccess() {
            await queryClient.invalidateQueries(
              [queryKeys.Estimates],
              (oldData) => ({
                message: (oldData?.message ?? []).filter(
                  (item) => item._id !== estimate._id,
                ),
              }),
            );
            toast.dismiss(toastId);
            toast.success("Estimate deleted successfully!");
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

  const estimates = data?.message ?? [];
  const columns = [
    {
      id: "SN",
      accessorKey: "",
      header: "SN",
      cell: (info) => <span>{info.row.index + 1}</span>,
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      header: "Client",
      id: "Client",
      accessorFn: (row) => `${row.client?.first_name} ${row.client?.last_name}`,
    },
    {
      header: "Date",
      accessorKey: "date",
    },
    {
      header: "Total",
      accessorKey: "total",
      cell: (cell) => formatCurrency(cell.getValue()),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (props) => (
        <div className="bg-blue-100 p-1 text-xs w-16 rounded-md flex justify-center items-center text-blue-800 mr-2">
          {props.row.original.status}
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (props) => (
        <span className="flex items-center gap-5">
          <button
            onClick={() => {
              setEstimate(props.row.original);
            }}
            className="text-xs border border-primary text-primary py-1 px-3 rounded-md"
          >
            Detail
          </button>
          <Link to={`/payment/estimate/${props.row.original._id}/edit`}>
            <Icon icon="iconamoon:edit-light" className="h-5 w-5" />
          </Link>
          <button onClick={() => handleDelete(props.row.original)}>
            <Icon
              icon="fluent:delete-28-regular"
              className="h-5 w-5 text-red-500"
            />
          </button>
        </span>
      ),
    },
  ];

  return (
    <div className="px-12 mx-auto mt-5 cursor-pointer">
      <div className="flex justify-between items-center">
        <div>
          <Heading label="Estimates" />
        </div>
      </div>

      <Table
        loading={isLoading}
        data={estimates}
        columns={columns}
        actionButton={() => (
          <Link
            to="/payment/estimate/add-estimate"
            className="bg-primary py-2 px-4 text-xs rounded-md text-white flex items-center gap-1"
          >
            <Icon
              icon="ant-design:plus-circle-outlined"
              className="font-bold"
            />
            <span>Add Estimate</span>
          </Link>
        )}
      />

      <DetailsModal
        openDetails={Boolean(estimate)}
        start
        heading="Estimate Details"
        closeDetails={() => setEstimate(null)}
      >
        <EstimateDetails setEstimate={setEstimate} estimate={estimate} />
      </DetailsModal>

      {ConfirmationDialog()}
    </div>
  );
}

export default Estimate;
