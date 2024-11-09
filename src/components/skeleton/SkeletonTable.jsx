import React from "react";

const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div
      role="status"
      className="w-full opacity-10 p-4 space-y-4 border border-gray-200 divide-y divide-green-500 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
    >
      <div className="w-full h-14 bg-gray-100 dark:bg-gray-700"></div>
      {Array(rows)
        .fill(0)
        .map(() => (
          <div className="flex items-center gap-5 pt-4">
            <div className="w-full rounded-full h-5 bg-gray-100 dark:bg-gray-700"></div>
            <div className="w-full rounded-full h-5 bg-gray-100 dark:bg-gray-700"></div>
            <div className="w-full rounded-full h-5 bg-gray-100 dark:bg-gray-700"></div>
            <div className="w-full rounded-full h-5 bg-gray-100 dark:bg-gray-700"></div>
          </div>
        ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SkeletonTable;
