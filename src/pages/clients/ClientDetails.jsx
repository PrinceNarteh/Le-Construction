import React from "react";
import { useParams } from "react-router-dom";

const ClientDetails = () => {
  const { clientId } = useParams();
  return (
    <div>
      <p>Client ID: {clientId}</p>
    </div>
  );
};

export default ClientDetails;
