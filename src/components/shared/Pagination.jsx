import React, { useEffect } from "react";
import { useState } from "react";

const Pagination = ({ data, setDisplayProjects }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordPerPage, setRecordPerPage] = useState(12);
  const lastIndex = currentPage * recordPerPage;
  const firstIndex = lastIndex - recordPerPage;
  const records = data.slice(firstIndex, lastIndex);
  const numOfPages = Math.ceil(data.length / recordPerPage);

  const handlePrev = () => {
    if (currentPage !== firstIndex) {
      setCurrentPage(currentPage - 1);
      setDisplayProjects(records);
    }
  };

  const handleNext = () => {
    if (currentPage !== lastIndex) {
      setCurrentPage(currentPage + 1);
      setDisplayProjects(records);
    }
  };

  useEffect(() => {
    if (data) {
      setDisplayProjects(records);
    }
  }, [data]);

  useEffect(() => {
    const lastIndex = currentPage * recordPerPage;
    const firstIndex = lastIndex - recordPerPage;
    const records = data.slice(firstIndex, lastIndex);
    setDisplayProjects(records);
  }, [recordPerPage]);

  useEffect(() => {
    const lastIndex = currentPage * recordPerPage;
    const firstIndex = lastIndex - recordPerPage;
    const records = data.slice(firstIndex, lastIndex);
    setDisplayProjects(records);
  }, [currentPage]);

  return (
    <div className="flex items-center justify-end mt-2 gap-2">
      <button
        onClick={() => handlePrev()}
        disabled={currentPage <= 1}
        className="p-1 border border-gray-500 px-2 disabled:opacity-30"
      >
        {"<"}
      </button>
      <button
        onClick={() => handleNext()}
        disabled={currentPage >= numOfPages}
        className="p-1 border border-gray-500 px-2 disabled:opacity-30"
      >
        {">"}
      </button>

      <span className="flex items-center gap-1">
        <div>Page</div>
        <strong>
          {currentPage} of {numOfPages}
        </strong>
      </span>
      <span className="flex items-center gap-1">
        | Go to page:
        <input
          type="number"
          defaultValue={currentPage}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) : 1;
            setCurrentPage(page);
          }}
          className="border p-1 pl-3 border-gray-500 rounded w-16 bg-transparent"
        />
      </span>
      <select
        value={recordPerPage}
        onChange={(e) => setRecordPerPage(e.target.value)}
        className="p-2 bg-transparent mt-3"
      >
        {[10, 20, 30, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Pagination;
