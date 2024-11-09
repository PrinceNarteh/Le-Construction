import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

import Heading from "../../../components/layout/Heading";
import Table from "../../../components/shared/Table";
import { queryKeys } from "../../../constants";
import useConfirm from "../../../hooks/useConfirm";
import useMutate from "../../../hooks/useMutate";
import usePostQuery from "../../../hooks/usePostQuery";
import { useUserSelector } from "../../../hooks/useUserSelector";
import DetailsModal from "../../../components/shared/DetailsModal";
import InvoiceDetails from "./InvoiceDetails";
import Spinner from "../../../components/Spinner";
import useFormatCurrency from "../../../hooks/useFormatCurrency";
import { Skeleton } from "../../../components/skeleton/Skeleton";
import SkeletonTable from "../../../components/skeleton/SkeletonTable";

function Invoices() {
  const { formatCurrency } = useFormatCurrency();
  const [invoice, setInvoice] = useState(null);
  const { user } = useUserSelector();
  const { data, isLoading } = usePostQuery({
    queryKey: [queryKeys.Invoices],
    url: "/invoice/all",
  });

  const queryClient = useQueryClient();
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const { mutate } = useMutate([queryKeys.DeleteInvoice]);
  const handleDelete = async (invoice) => {
    const isConfirmed = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to delete "${invoice.title}"`,
    });

    if (isConfirmed) {
      const toastId = toast.loading("Deleting invoice...");
      mutate(
        {
          url: "/invoice/delete",
          method: "DELETE",
          data: {
            invoice_id: invoice._id,
          },
        },
        {
          async onSuccess() {
            await queryClient.invalidateQueries(
              [queryKeys.Invoices],
              (oldData) => ({
                message: (oldData?.message ?? []).map(
                  (item) => item._id !== invoice._id,
                ),
              }),
            );
            toast.dismiss(toastId);
            toast.success("Invoice deleted successfully!");
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

  const invoices = data?.message.invoices ?? [];
  const summary = data?.message.summary ?? {
    averageTimeTogetpaid: "N/A",
    invoicesDueWithin30Days: 0,
    totalDraftInvoices: 0,
    totalInvoices: 0,
    totalOverdue: 0,
    totalUnpaidInvoices: 0,
  };

  const dueDate = (invoice) => {
    const date = formatDistanceToNowStrict(new Date(invoice?.due_date), {
      addSuffix: true,
    });
    return date[0].toUpperCase() + date.substring(1);
  };

  const isDue = (invoice) => {
    const now = new Date();
    const dueDate = new Date(invoice.due_date);
    return now.getTime() >= dueDate.getTime();
  };

  const columns = [
    {
      header: "Status",
      accessorKey: "status",
      cell: (cell) => (
        <span
          className={`font-ray ${
            isDue(cell.row.original)
              ? "bg-red-100 text-red-600"
              : "bg-blue-100 text-blue-600"
          } font-bold px-3 py-1 text-xs rounded-md `}
        >
          {isDue(cell.row.original) ? "Overdue" : cell.getValue()}
        </span>
      ),
    },
    {
      header: "Due",
      cell: (cell) => (
        <div
          className={`font-semibold font-ray text-sm
            ${isDue(cell.row.original) ? "text-red-700" : "text-blue-700"} 
            `}
        >
          {dueDate(cell.row.original)}
        </div>
      ),
    },
    {
      header: "Date",
      accessorKey: "invoice_date",
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Customer",
      accessorFn: (row) => `${row.client.first_name} ${row.client.last_name}`,
    },
    {
      header: "Amount Due",
      accessorKey: "total",
      cell: (cell) => formatCurrency(cell.getValue()),
    },
    {
      id: "Actions",
      header: () => <span className="block text-center w-full">Actions</span>,
      cell: (cell) => (
        <div className="w-[20%] flex gap-5">
          <button
            onClick={() => setInvoice(cell.row.original)}
            className="text-xs border border-primary py-1 px-2 text-primary rounded-md"
          >
            Details
          </button>
          <Link to={`/payment/invoice/${cell.row.original._id}/edit`}>
            <Icon
              icon="iconamoon:edit-light"
              className={`h-5 w-5 hi ${
                cell.row.original.status === "Paid" && "hidden"
              }`}
            />
          </Link>
          <button onClick={() => handleDelete(cell.row.original)}>
            <Icon
              icon="fluent:delete-28-regular"
              className="h-5 w-5 text-red-500"
            />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="px-20 cursor-pointer">
      <div className="flex justify-between items-center mt-5">
        <Heading label="Invoices" />
        <Link
          to="/payment/invoice/add-invoice"
          className="rounded-lg py-3 px-5 bg-primary"
        >
          <div className="text-white font-semibold text-md">
            Create an invoice
          </div>
        </Link>
      </div>

      <>
        {isLoading ? (
          <div>
            <div className="w-full bg-white/60 mt-5 rounded-lg p-7">
              <div className="flex">
                {Array(3)
                  .fill(null)
                  .map(() => (
                    <div className="flex-1 space-y-3">
                      <Skeleton className="w-48" />
                      <Skeleton className="w-24" />
                    </div>
                  ))}
              </div>
              <Skeleton className="w-60 mt-5" />
            </div>

            <div className="flex gap-5 w-5/12 bg-white/60 mt-5 rounded-lg p-5 mb-5">
              <Skeleton className="flex-1" />
              <Skeleton className="flex-1" />
              <Skeleton className="flex-1" />
            </div>
            <SkeletonTable rows={4} />
          </div>
        ) : (
          <>
            <div className="w-full border border-primary bg-white mt-5 rounded-lg p-7">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2 font-ray">
                  <div className="font-semibold text-md text-slate-500">
                    Overdue
                  </div>
                  <div className="flex">
                    <div className="font-semibold text-2xl">
                      {formatCurrency(summary.totalOverdue)}
                    </div>
                    <div className="text-slate-400 text-sm mt-3 ml-2 ">
                      {user?.company_settings?.currency?.name}
                    </div>
                  </div>

                  <div className="text-slate-400 text-md mt-8 flex items-center">
                    <h3>Last Updated just a min ago</h3>
                    <Icon
                      icon="pepicons-pencil:arrow-spin-circle"
                      className="text-primary ml-2 h-6 w-6"
                    />
                  </div>
                </div>

                <div className="space-y-2 font-ray">
                  <div className="font-semibold text-md text-slate-500">
                    Due within next 31 days
                  </div>
                  <div className="flex">
                    <div className="font-semibold text-2xl">
                      {formatCurrency(summary.invoicesDueWithin30Days)}
                    </div>
                    <div className="text-slate-400 text-sm mt-3 ml-2 ">
                      {user?.company_settings?.currency?.name}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 font-ray">
                  <div className="font-semibold text-md text-slate-500">
                    Average time to get paid
                  </div>
                  <div className="font-semibold text-2xl">
                    {summary.averageTimeTogetpaid}
                  </div>
                  {/* <div className="flex">
              <div className="font-semibold text-2xl">75</div>
              <div className="text-slate-400 text-sm mt-3 ml-2 ">days</div>
            </div> */}
                </div>
              </div>
            </div>

            <div className="flex w-full mb-5">
              <div className="bg-neutral-200 rounded-xl w-[40%] p-2 flex gap-1 mt-5 ">
                <div className="rounded-lg w-36 p-1 flex justify-center items-center bg-white">
                  <div className="text-primary font-semibold text-sm flex items-center">
                    All Invoices
                    <div className="ml-2 bg-primary text-white p-1 px-2 rounded-full">
                      {summary.totalInvoices}
                    </div>
                  </div>
                </div>
                <div className="rounded-lg w-36 p-1 flex justify-center items-center bg-white">
                  <div className="text-primary font-semibold text-sm flex items-center">
                    Unpaid
                    <div className="ml-2 bg-primary text-white p-1 px-2 rounded-full">
                      {summary.totalUnpaidInvoices}
                    </div>
                  </div>
                </div>
                <div className="rounded-lg w-36 p-1 flex justify-center items-center bg-white">
                  <div className="text-primary font-semibold text-sm flex items-center">
                    Drafts
                    <div className="ml-2 bg-primary text-white p-1 px-2 rounded-full">
                      {summary.totalDraftInvoices}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t w-full h-0 mt-12"></div>
            </div>

            <Table columns={columns} data={invoices} />

            <DetailsModal
              openDetails={Boolean(invoice)}
              start
              heading="Invoice Details"
              closeDetails={() => setInvoice(null)}
            >
              <InvoiceDetails invoice={invoice} />
            </DetailsModal>

            {ConfirmationDialog()}
          </>
        )}
      </>
    </div>
  );
}

export default Invoices;
