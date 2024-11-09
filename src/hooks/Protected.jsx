import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import usePermissions from "./usePermissions";
import { useUserSelector } from "./useUserSelector";

function Protected({ children }) {
  const { user } = useUserSelector();
  const { paths } = usePermissions();
  const { pathname } = useLocation();

  //console.log("user:::", user?.company.has_branding);
  const allowedPath =
    pathname.length > 1
      ? paths.some((path) =>
          pathname.includes(path.length > 1 ? path.substring(1) : false, 1)
        )
      : true;

  if (!user?.auth_token) {
    return <Navigate to="/login" replace />;
  } else if (!user?.company.has_address) {
    return <Navigate to="/profile" replace />;
  } else if (!user?.company.has_branding) {
    return <Navigate to="/branding" replace />;
  } else if (!user?.company.has_active_subscription) {
    return <Navigate to="/subscribe" replace />
  }

  else if (!allowedPath) {
    return <Navigate to="/" replace />;
  }

  return children;

  /*
  else if (user?.user_type === "employee") {
    if (!allowedPath) {
      return <Navigate to="/" replace />;
    }
    return children;
  }
  */
}

export default Protected;
