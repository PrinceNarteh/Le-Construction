import { Icon } from "@iconify/react";
import React, { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AddIncomeForm from "../../components/forms/payments/AddIncomeForm";
import Modal from "../../components/shared/Modal";
import Table from "../../components/shared/Table";
import { queryKeys } from "../../constants";
import useConfirm from "../../hooks/useConfirm";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";
import DetailsModal from "../../components/shared/DetailsModal";
import TransactionDetails from "./TransactionDetails";
import useFormatCurrency from "../../hooks/useFormatCurrency";

function Transactions() {
  const { formatCurrency } = useFormatCurrency();
  const [transaction, setTransaction] = useState(null);
  const [OpenIncome, setOpenIncome] = useState(false);
  const { data, isLoading } = usePostQuery({
    queryKey: [queryKeys.Transactions],
    url: "/transactions",
    data: {
      status: "succeeded",
    },
  });

  const queryClient = useQueryClient();
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const { mutate } = useMutate([queryKeys.DeleteInvoice]);
  const handleDelete = async (transaction) => {
    const isConfirmed = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to delete payment from "${transaction.payment.name}"`,
    });

    if (isConfirmed) {
      const toastId = toast.loading("Deleting invoice...");
      mutate(
        {
          url: "/transaction/delete",
          method: "DELETE",
          data: {
            transaction_id: transaction._id,
          },
        },
        {
          async onSuccess(data) {
            await queryClient.invalidateQueries(
              [queryKeys.Transactions],
              (oldData) => ({
                message: (oldData?.message ?? []).map(
                  (item) => item._id !== transaction._id,
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
            setIsOpen(false);
          },
        },
      );
    }
  };

  const columns = [
    {
      id: "SN",
      accessorKey: "",
      header: "SN",
      cell: (info) => <span>{info.row.index + 1}</span>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: (info) => `${info.row.original.payment.payment_date}`,
    },
    {
      header: "To",
      accessorKey: "payment.name",
    },
    {
      header: "Amount",
      accessorKey: "payment.amount",
      cell: (cell) => formatCurrency(cell.getValue()),
    },
    {
      header: "Status",
      accessorKey: "payment.status",
    },
    {
      header: "Details",
      cell: (info) => (
        <button
          onClick={() => setTransaction(info.row.original)}
          className="text-xs border border-primary py-1 px-2 text-primary rounded-md"
        >
          Details
        </button>
      ),
    },
    {
      header: "Actions",
      cell: (path) => (
        <div className="flex justify-center gap-5">
          {/* <Link to={`/payment/invoice/${path.row.original._id}/edit`}>
            <Icon icon="iconamoon:edit-light" className={`h-5 w-5 hi `} />
          </Link> */}
          <button onClick={() => handleDelete(path.row.original)}>
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
      {/* <div className="flex justify-between items-center mt-5">
        <div>
          <Heading label="Transactions" />
        </div>

        <div className="flex items-center">
          <div
            onClick={() => setOpenIncome(true)}
            className="w-40 font-semibold text-white bg-primary p-2 rounded-md flex justify-center items-center mr-3"
          >
            <div>Add Income</div>
          </div>
          <div
            onClick={() => setOpenIncome(true)}
            className="w-40 font-semibold text-primary p-2 rounded-md border border-primary flex justify-center items-center"
          >
            <div>Add expense</div>
          </div>
        </div>
      </div> */}

      <div className="mt-5 rounded-lg">
        <Table loading={isLoading} data={data?.message} columns={columns} />
      </div>

      <Modal
        openModal={OpenIncome}
        closeModal={setOpenIncome}
        className="place-content-start"
      >
        <AddIncomeForm />
      </Modal>

      <DetailsModal
        openDetails={Boolean(transaction)}
        start
        heading="Transaction Details"
        closeDetails={() => setTransaction(null)}
      >
        <TransactionDetails transaction={transaction} />
      </DetailsModal>

      {ConfirmationDialog()}
    </div>
  );
}

export default Transactions;
