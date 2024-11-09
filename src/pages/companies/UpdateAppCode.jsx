import { Icon } from "@iconify/react";
import { format } from "libphonenumber-js";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";
import Spinner from "../../components/Spinner";
import Heading from "../../components/layout/Heading";
import Modal from "../../components/shared/Modal";
import Table from "../../components/shared/Table";
import { queryKeys } from "../../constants";
import { useGetQuery } from "../../hooks/useGetQuery";
import useMutate from "../../hooks/useMutate";

function UpdateAppCode() {
  const queryClient = useQueryClient();
  const [company, setCompany] = useState(null);
  const [code, setCode] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const { data, isLoading, isRefetching } = useGetQuery({
    queryKey: [queryKeys.Companies],
    url: "/companies/all",
  });

  const contractors = data ? data.message : [];
  const columns = [
    {
      id: "SN",
      header: "SN",
      accessorKey: "",
      cell: (props) => <span className="px-1">{props.row.index + 1}</span>,
    },
    {
      header: "Company",
      id: "Company",
      accessorFn: (row) => `${row.company_name} ${row.email}`,
      cell: (props) => (
        <div className="flex items-center">
          <div>
            <img
              src={props.row.original?.company_logo}
              alt=""
              className="h-12 w-12 object-cover rounded-full"
            />
          </div>
          <div className="ml-2">
            <div className=" text-blue-900 text-[15px] font-bold leading-snug">
              {props.row.original.company_name}
            </div>
            <div className=" text-slate-400 text-sm font-normal leading-tight">
              {props.row.original.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Phone Number",
      accessorKey: "phone_number",
      cell: (props) => <span>{format(props.getValue(), "INTERNATIONAL")}</span>,
    },
    {
      header: "App Code",
      accessorFn: (row) => `${row.app_code}`,
      cell: (props) => (
        <span>{props.getValue() === "null" ? "N/A" : props.getValue()}</span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "",
      cell: (props) => (
        <span className="w-20 flex gap-5">
          <Icon
            onClick={() => {
              setCompany(props.row.original);
              setCode(props.row.original.app_code);
              setOpenModal(true);
            }}
            icon="iconamoon:edit-light"
            className="text-xl cursor-pointer"
          />
        </span>
      ),
    },
  ];

  const { mutate } = useMutate([queryKeys.UpdateAppCode]);
  const submit = (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating App Code...");

    const data = {
      company_id: company._id,
      app_code: code,
    };

    mutate(
      {
        url: "/company/update/app_code",
        method: "PATCH",
        data,
      },
      {
        onSuccess: async (data) => {
          await queryClient.setQueryData([queryKeys.Companies], (oldData) => {
            return {
              message: (oldData?.message ?? []).map((item) => {
                if (item._id === data.message._id) {
                  return data.message;
                }
                return item;
              }),
            };
          });
          toast.dismiss(toastId);
          toast.success("App Code Updated Successfully");
          setOpenModal(false);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      }
    );
  };

  useEffect(() => {
    if (!openModal) {
      setCompany(null);
      setCode(null);
    }
  }, [openModal]);

  return (
    <div className="">
      <Spinner isSubmitting={isLoading} />
      <div className="flex justify-between items-center mt-5">
        <div className="ml-12">
          <Heading label="Update App Code" />
        </div>
      </div>
      <div className="px-12">
        <div className="bg-white mt-7 rounded-lg px-5">
          <Table
            data={contractors}
            columns={columns}
            actionButton={() => (
              <Link
                to="/companies/add-company"
                className="bg-primary py-2 px-4 text-xs rounded-md text-white flex items-center gap-1"
              >
                <Icon
                  icon="ant-design:plus-circle-outlined"
                  className="font-bold"
                />
                <span>Add Contractor</span>
              </Link>
            )}
          />
        </div>
      </div>
      <Modal openModal={openModal} closeModal={setOpenModal}>
        <form onSubmit={submit} className="p-5 space-y-5">
          <h3 className="text-blue-900 font-semibold text-2xl border-b-2">
            {company?.company_name}
          </h3>
          <div className="font-bold flex items-center gap-5">
            <label htmlFor="" className="block text-lg text-blue-900 shrink-0">
              App Code
            </label>
            <input
              className="border w-full text-xl border-primary py-2 px-3 outline-none rounded"
              onChange={(e) => {
                setCode(e.target.value);
              }}
              value={code}
            />
          </div>
          <div className="flex justify-end">
            <button className="bg-primary py-2 px-5 rounded-md text-white">
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default UpdateAppCode;
