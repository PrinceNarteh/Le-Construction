import React from "react";
import Sidebar from "../sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import LoadingBar from "react-top-loading-bar";
import { useLoadingBarSelector } from "../../hooks/useLoadingBar";
import { resetValue } from "../../app/feature/loadingBar/loadingBarSlice";

const Layout = () => {
  const loadingBar = useLoadingBarSelector();

  return (
    <div>
      <Sidebar />
      <Header />
      <main className="ml-60 font-ray overflow-y-auto min-h-screen relative pt-16 pb-10 bg-no-repeat bg-cover bg-[#f4f3f5]">
        <LoadingBar
          height={5}
          color="#f11946"
          progress={loadingBar.percentage}
          onLoaderFinished={() => resetValue()}
        />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
