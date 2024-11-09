import React from "react";
import DesignSidebar from "./DesignSidebar";
import { Outlet } from "react-router";

function DesignLayout() {
  return (
    <div className="flex">
      <DesignSidebar />
      <main className="ml-36 w-full font-ray overflow-y-scroll bg-transparent h-[87vh]">
        <Outlet />
      </main>
    </div>
  );
}

export default DesignLayout;
