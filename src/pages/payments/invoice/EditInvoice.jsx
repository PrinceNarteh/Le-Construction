import React from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import EstimateAndInvoiceForm from "../../../components/forms/payments/EstimateAndInvoiceForm";
import { queryKeys } from "../../../constants";
import { useGetQuery } from "../../../hooks/useGetQuery";

const EditInvoice = () => {
  const { invoiceId } = useParams();
  const { data, isLoading } = useGetQuery({
    queryKey: [queryKeys.Invoices, invoiceId],
    url: `/invoice/${invoiceId}`,
  });

  if (isLoading) return <Spinner isSubmitting={isLoading} />;


  return (
    <div>
      <EstimateAndInvoiceForm estimateOrInvoice={data?.message} />
    </div>
  );
};

export default EditInvoice;
