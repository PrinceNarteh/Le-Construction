import React from "react";
import { useParams } from "react-router";
import Spinner from "../../components/Spinner";
import SubContractorForm from "../../components/forms/SubContractorForm";
import { queryKeys } from "../../constants";
import { useGetQuery } from "../../hooks/useGetQuery";

const EditSubContractor = () => {
  const { subContractorId } = useParams();
  const { data: subContractor, isLoading } = useGetQuery({
    queryKey: [queryKeys.SubContractors, subContractorId],
    url: `/subContractor/${subContractorId}`,
  });

  if (isLoading) return <Spinner isSubmitting={isLoading} />;

  return <SubContractorForm subContractor={subContractor.message} />;
};

export default EditSubContractor;
