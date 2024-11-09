import React from "react";
import { Skeleton } from "./Skeleton";

const DashboardSkeleton = () => {
  return (
    <div>
      <div className="grid grid-auto-fit-sm gap-2 px-5 mt-4">
        {Array(4)
          .fill(null)
          .map((_, idx) => (
            <Skeleton key={idx} className="h-24" />
          ))}
      </div>

      <div className="grid grid-cols-2 gap-5 px-5 my-5">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>

      <div className="grid grid-cols-2 gap-5 px-5 my-5">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>

      <div className="grid grid-auto-fit-sm gap-2 px-5 mt-4">
        {Array(3)
          .fill(null)
          .map((_, idx) => (
            <Skeleton key={idx} className="h-24" />
          ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
