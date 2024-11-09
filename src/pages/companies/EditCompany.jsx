import React from "react";
import { useParams } from "react-router-dom";

import Spinner from "../../components/Spinner";
import CompanyForm from "../../components/forms/CompanyForm";
import { queryKeys } from "../../constants";
import { useGetQuery } from "../../hooks/useGetQuery";

const EditCompany = () => {
  const { companyId } = useParams();
  const { data: company, isLoading } = useGetQuery({
    queryKey: [queryKeys.Companies, companyId],
    url: `/company/${companyId}`,
  });

  if (isLoading) return <Spinner isSubmitting={isLoading} />;

  return <CompanyForm company={company?.message} />;
};

export default EditCompany;
