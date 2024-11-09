import { Icon } from "@iconify/react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../skeleton/Skeleton";

const Table = ({
  loading,
  columns = [],
  data = [],
  actionButton = null,
  linkPath = null,
}) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const memorizedData = useMemo(() => data, [data]);
  const {
    getHeaderGroups,
    getRowModel,
    previousPage,
    getCanPreviousPage,
    nextPage,
    getCanNextPage,
    getState,
    getPageCount,
    setPageIndex,
    setPageSize,
  } = useReactTable({
    data: memorizedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting: sorting,
      globalFilter,
    },
    defaultColumn: {
      minSize: 0,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
  });
  const navigate = useNavigate();

  const handleClick = (id) => navigate(`${linkPath}/${id}`);

  // function getExcel() {
  //   const config = {
  //     filename: "general-ledger-Q1",
  //     sheet: {
  //       data: [],
  //     },
  //   };

  //   const dataSet = config.sheet.data;

  //   // review with one level nested config
  //   // HEADERS
  //   let headerRow = [];
  //   let cellsData = [];
  //   getHeaderGroups().forEach((headerGroup) => {
  //     if (headerGroup.headers) {
  //       headerGroup.headers.forEach((column) => {
  //         headerRow.push(column.id);
  //       });
  //     }

  //   });

  //   getRowModel().rows.map((row) => {
  //     row.getVisibleCells();
  //   });

  //   const data = cellsData.map((cell) => ({}));

  //   // FILTERED ROWS
  //   // if (getRowModel().rows.length > 0) {
  //   //   getRowModel().rows.forEach((row) => {
  //   //     const dataRow = [];

  //   //     Object.values(row.getValue()).forEach((value) =>
  //   //       dataRow.push({
  //   //         value,
  //   //         type: typeof value === "number" ? "number" : "string",
  //   //       })
  //   //     );

  //   //     dataSet.push(dataRow);
  //   //   });
  //   // } else {
  //   //   dataSet.push([
  //   //     {
  //   //       value: "No data",
  //   //       type: "string",
  //   //     },
  //   //   ]);
  //   // }

  //   return generateExcel(config);
  // }

  if (loading) {
    return (
      <div className="bg-white p-5 pt-10 min-w-5xl mx-auto overflow-x-auto">
        <Skeleton className="w-72 h-9 mb-10" />
        {
          <div className="space-y-4">
            {Array(6)
              .fill(null)
              .map(() => (
                <div className="flex items-center gap-5">
                  <Skeleton className="w-5" />
                  <div className="flex gap-2 flex-[2]">
                    <Skeleton className="shrink-0 h-12 w-12 rounded-full" />
                    <div className="w-full">
                      <Skeleton className="h-5 w-11/12 mb-2" />
                      <Skeleton className="h-2 w-4/12" />
                    </div>
                  </div>
                  <Skeleton className="flex-1" />
                  <Skeleton className="flex-1" />
                  <Skeleton className="flex-1" />
                </div>
              ))}
          </div>
        }
        <div className="flex justify-end mt-8">
          <Skeleton className="w-72 h-5" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 min-w-5xl mx-auto overflow-x-auto">
      <div className="h-20 text-blue-900 text-xl font-bold flex justify-between items-center">
        <div className="h-9 w-72 bg-[#F4F6FB] flex rounded-lg p-2">
          <Icon icon="circum:search" className="h-5 w-5 ml-3" />

          <input
            type="text"
            name="name"
            value={globalFilter ?? ""}
            placeholder="Search"
            onChange={(e) => setGlobalFilter(String(e.target.value))}
            className="bg-[#F4F6FB] w-full outline-none p-2 placeholder:text-gray-700 text-sm placeholder:font-normal placeholder:mb-3"
          />
        </div>

        <div>
          {/* <button onClick={() => getExcel()}>Export</button> */}
          {actionButton ? actionButton() : null}
        </div>
      </div>

      <table className="w-full">
        <thead>
          {getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="px-3 text-slate-400 text-[14px] font-bold leading-tight text-left"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className={`${
                    header.column.getCanSort() ? "cursor-pointer" : ""
                  }`}
                  style={{
                    width:
                      header.getSize() === Number.MAX_SAFE_INTEGER
                        ? "auto"
                        : header.getSize(),
                  }}
                >
                  <span className="flex items-center">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {
                      {
                        asc: (
                          <Icon
                            icon="ic:baseline-arrow-drop-up"
                            fontSize={25}
                          />
                        ),
                        desc: (
                          <Icon
                            icon="ic:baseline-arrow-drop-down"
                            fontSize={25}
                          />
                        ),
                      }[header.column.getIsSorted() ?? null]
                    }
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-slate-100"
              {...(linkPath && {
                onClick: () => handleClick(row.original._id),
              })}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="py-2"
                  style={{
                    width:
                      cell.column.getSize() === Number.MAX_SAFE_INTEGER
                        ? "auto"
                        : cell.column.getSize(),
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* pagination */}
      <div className="flex items-center justify-end mt-2 gap-2">
        <button
          onClick={() => {
            previousPage();
          }}
          disabled={!getCanPreviousPage()}
          className="p-1 border border-gray-300 px-2 disabled:opacity-30"
        >
          {"<"}
        </button>
        <button
          onClick={() => {
            nextPage();
          }}
          disabled={!getCanNextPage()}
          className="p-1 border border-gray-300 px-2 disabled:opacity-30"
        >
          {">"}
        </button>

        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {getState().pagination.pageIndex + 1} of {getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              setPageIndex(page);
            }}
            className="border p-1 rounded w-16 bg-transparent"
          />
        </span>
        <select
          value={getState().pagination.pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          className="p-2 bg-transparent mt-3"
        >
          {[10, 20, 30, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Table;
