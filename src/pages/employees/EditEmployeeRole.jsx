import React from "react";
import { useParams } from "react-router";
import Spinner from "../../components/Spinner";
import RoleForm from "../../components/forms/RoleForm";
import { queryKeys } from "../../constants";
import { useGetQuery } from "../../hooks/useGetQuery";

const EditEmployeeRole = () => {
  const { roleId } = useParams();
  const { data: role, isLoading } = useGetQuery({
    queryKey: [queryKeys.EmployeesRoles, roleId],
    url: `/role/${roleId}`,
  });

  if (isLoading) return <Spinner isSubmitting={isLoading} />;

  return <RoleForm role={role} />;
};

export default EditEmployeeRole;
