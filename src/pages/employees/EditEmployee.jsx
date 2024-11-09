import React from "react";
import { useParams } from "react-router";
import Spinner from "../../components/Spinner";
import EmployeeForm from "../../components/forms/EmployeeForm";
import { queryKeys } from "../../constants";
import { useGetQuery } from "../../hooks/useGetQuery";

const EditEmployee = () => {
  const { employeeId } = useParams();
  const { data: employee, isLoading } = useGetQuery({
    queryKey: [queryKeys.Employees, employeeId],
    url: `/${employeeId}/employee`,
  });

  if (isLoading) return <Spinner isSubmitting={isLoading} />;

  return <EmployeeForm employee={employee} />;
};

export default EditEmployee;
