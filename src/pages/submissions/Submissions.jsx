import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Spinner from "../../components/Spinner";
import Heading from "../../components/layout/Heading";
import Table from "../../components/shared/Table";
import { queryKeys } from "../../constants";
import useConfirm from "../../hooks/useConfirm";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";
import { capitalize } from "../../utils/capitalize";
import SubmissionDetails from "./SubmissionDetails";
import useFormatCurrency from "../../hooks/useFormatCurrency";

const Submissions = () => {
  const { formatCurrency } = useFormatCurrency();
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const [submission, setSubmission] = useState(null);
  const { data, isLoading, refetch } = usePostQuery({
    queryKey: [queryKeys.Submissions],
    url: "/submissions/all",
  });

  const { mutate } = useMutate([queryKeys.DeleteSubmission]);
  const handleDelete = async (submission) => {
    const isConfirmed = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to delete "${capitalize(
        submission.project_name
      )}"`,
    });

    if (isConfirmed) {
      const toastId = toast.loading("Deleting submission...");
      mutate(
        {
          url: "/submission/delete",
          method: "DELETE",
          data: {
            submission_id: submission._id,
          },
        },
        {
          async onSuccess() {
            await refetch();
            toast.dismiss(toastId);
            toast.success("Submission deleted successfully!");
            setIsOpen(false);
            setSubmission(null);
          },
          onError(error) {
            toast.dismiss(toastId);
            toast.error(error.response.data.message);
          },
        }
      );
    }
  };

  const submissions = data?.message ?? [];
  const columns = [
    {
      id: "SN",
      accessorKey: "",
      header: "SN",
      cell: (info) => <span>{info.row.index + 1}</span>,
    },
    {
      accessorKey: "project_name",
      header: "Project Name",
    },
    {
      header: "Client",
      accessorFn: (row) => `${row.client.first_name} ${row.client.last_name}`,
    },
    {
      accessorKey: "budget",
      header: "Budget",
      cell: (cell) => formatCurrency(cell.getValue()),
    },
    {
      accessorKey: "approved",
      header: "Status",
      cell: (props) => (
        <span>{props.row.original.approved ? "Approved" : "Not Approved"}</span>
      ),
    },
    {
      header: "Action",
      cell: (cell) => (
        <div className="flex gap-5 items-center cursor-pointer">
          <button
            onClick={() => setSubmission(cell.row.original)}
            className="text-xs border border-primary text-primary px-2 py-1 rounded hover:text-white hover:bg-primary duration-300"
          >
            Details
          </button>
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
    <div className="px-12">
      <div className="flex justify-between items-center mb-5">
        <Heading label="Submissions" />
      </div>

      {isLoading && <Spinner isSubmitting={isLoading} />}

      <Table columns={columns} data={submissions} />

      {/* Submission Details */}
      <SubmissionDetails
        submission={submission}
        closeDetails={() => setSubmission(null)}
        deleteSubmission={handleDelete}
      />

      {/* Delete Submission */}
      {ConfirmationDialog()}
    </div>
  );
};

export default Submissions;
