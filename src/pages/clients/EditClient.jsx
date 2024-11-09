import React from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import ClientForm from "../../components/forms/ClientForm";
import { queryKeys } from "../../constants";
import { useGetQuery } from "../../hooks/useGetQuery";

const EditClient = () => {
  const { clientId } = useParams();
  const { data, isLoading } = useGetQuery({
    queryKey: [queryKeys.Clients, clientId],
    url: `/company/client/${clientId}`,
  });


  if (isLoading) return <Spinner isSubmitting={isLoading} />;

  return <ClientForm client={data?.message} />;
};

export default EditClient;
