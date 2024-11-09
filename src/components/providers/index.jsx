import React from "react";
import ReactQueryProvider from "./reactQueryProvider";
import ReduxProvider from "./reduxProvider";

const Providers = ({ children }) => {
  return (
    <ReactQueryProvider>
      <ReduxProvider>{children}</ReduxProvider>
    </ReactQueryProvider>
  );
};

export default Providers;
