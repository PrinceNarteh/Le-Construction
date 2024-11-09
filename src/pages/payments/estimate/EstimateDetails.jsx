import { Icon } from "@iconify/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { format } from "date-fns";
import { format as formatPhoneNumber } from "libphonenumber-js";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { pdf } from "@react-pdf/renderer";

import { useQueryClient } from "@tanstack/react-query";
import Heading from "../../../components/layout/Heading";
import EstimateAndInvoiceCard from "../../../components/shared/EstimateAndInvoiceCard";
import PDFFile from "../../../components/shared/PDFFile";
import { queryKeys } from "../../../constants";
import useClickOutside from "../../../hooks/useClickOutside";
import { useCompanySettingsSelector } from "../../../hooks/useCompanySettings";
import useConfirm from "../../../hooks/useConfirm";
import useMutate from "../../../hooks/useMutate";
import { useUserSelector } from "../../../hooks/useUserSelector";

function EstimateDetails({ estimate, setEstimate }) {
  const { user } = useUserSelector();
  const { companySettings } = useCompanySettingsSelector();
  const [invoicePDF, setInvoicePDF] = useState(null);
  const queryClient = useQueryClient();
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const [openMore, setOpenMore] = useState(false);
  const ref = useClickOutside(() => {
    setOpenMore(false);
  });
  const componentRef = useRef();
  const navigate = useNavigate();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const { mutate } = useMutate([queryKeys.ConvertEstimateToInvoice]);
  const convert = async () => {
    const isConfirmed = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to convert "${estimate?.title}" to invoice?`,
      fullWidth: true,
    });

    if (isConfirmed) {
      const toastId = toast.loading("Converting estimate to invoice...");
      mutate(
        {
          url: "/estimate/to/invoice",
          method: "PATCH",
          data: {
            estimate_id: estimate?._id,
          },
        },
        {
          async onSuccess(data) {
            toast.dismiss(toastId);
            toast.success("Estimate converted in invoice successfully!");
            setIsOpen(false);
            setEstimate(null);
            navigate("/payment/invoice");
          },
          onError(error) {
            toast.dismiss(toastId);
            toast.error(error.response.data.message);
          },
        }
      );
    }
  };

  const { mutate: sendEstimateMutate } = useMutate(["send-estimate"]);
  const sendEstimate = async () => {
    const isConfirmed = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to send this estimate to ${estimate?.client.first_name} ${estimate?.client.last_name}?`,
      confirmButtonLabel: "Yes, Send!",
      fullWidth: true,
    });

    if (isConfirmed) {
      const toastId = toast.loading(
        `Sending estimate to ${estimate?.client.first_name} ${estimate?.client.last_name}`
      );

      const data = {
        estimate_id: estimate?._id,
        estimate_file: invoicePDF,
      };

      sendEstimateMutate(
        {
          url: "/estimate/send",
          multipart: true,
          data,
        },
        {
          async onSuccess(data) {
            await queryClient.setQueryData(
              [queryKeys.Invoices, estimate?._id],
              data
            );
            toast.dismiss(toastId);
            toast.success(
              `Estimate sent to ${estimate?.client.first_name} ${estimate?.client.last_name} successfully`
            );
          },
          onError(error) {
            toast.dismiss(toastId);
            toast.error(error.response.data.message);
          },
          onSettled() {
            setIsOpen(false);
          },
        }
      );
    }
  };

  const pdfData = {
    ...estimate,
    date: `${estimate?.date || estimate?.invoice_date}`,
    dueDate: `${
      estimate?.due_date && format(new Date(estimate?.due_date), "PPP")
    }`,
    phoneNumber: formatPhoneNumber(user?.phone_number || "", "INTERNATIONAL"),
    logo: companySettings?.branding.company_logo,
    primaryColor: companySettings?.branding?.primary_color,
  };

  //console.log({ pdfData });

  useEffect(() => {
    const createPDF = async () => {
      if (estimate) {
        const blob = await pdf(
          <PDFFile
            data={pdfData}
            user={user}
            companySettings={companySettings}
          />
        ).toBlob();
        const pdfFile = new File([blob], `${estimate?.title}.pdf`, {
          type: blob.type,
        });
        setInvoicePDF(pdfFile);
      }
    };
    createPDF();
    // eslint-disable-next-line
  }, [user, estimate, companySettings]);

  return (
    <div className="bg-white p-10 rounded-xl font-ray">
      <div className="flex justify-between items-center">
        <div>
          <Heading label={`Estimate #${estimate?._id}`} />
        </div>
        <div className="bg-neutral-200 w-56 h-10 rounded-md flex p-1 justify-center items-center mt-2">
          <div className="bg-neutral-600 p-1 h-6 text-sm w-16 rounded-full flex justify-center items-center text-white mr-2">
            {estimate?.status}
          </div>
          <div className="text-sm text-neutral-500 font-semibold">
            Send{" "}
            <button onClick={() => sendEstimate()} className=" text-primary">
              this estimate
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <div className="flex">
          <Link to={`/payment/estimate/${estimate?._id}/edit`}>
            <div className="cursor-pointer border border-primary p-2 flex justify-center items-center w-28 rounded-full font-semibold text-primary">
              Edit
            </div>
          </Link>

          {/* {estimate?} */}
          <div
            onClick={() => convert()}
            className="cursor-pointer border border-primary p-2 flex justify-center items-center w-48 rounded-full font-semibold text-primary ml-3"
          >
            Convert to Invoice
          </div>
        </div>
        <div className="relative">
          <button>
            <div
              onClick={() => setOpenMore(!openMore)}
              className="items-center border border-primary p-2 flex justify-center w-24 rounded-full font-semibold text-primary ml-3"
            >
              More
              <Icon
                icon="mdi:arrow-down-drop"
                className="h-5 w-5 text-black mt-1"
              />
            </div>
          </button>

          {openMore && (
            <div
              ref={ref}
              className="bg-white w-44 mt-2 absolute right-0 border border-gray-500 rounded-md p-2 z-30"
            >
              <ReactToPrint
                trigger={() => (
                  <button
                    onClick={handlePrint}
                    className="hover:bg-primary hover:text-white duration-300 w-full flex items-center gap-2 px-2 py-1"
                  >
                    <Icon icon="ph:printer-light" />
                    Print
                  </button>
                )}
                content={() => componentRef.current}
              />

              <PDFDownloadLink
                document={
                  <PDFFile
                    data={pdfData}
                    user={user}
                    companySettings={companySettings}
                  />
                }
                fileName={`${estimate?.title}.pdf`}
              >
                <div className="hover:bg-primary hover:text-white duration-300 w-full flex items-center gap-2 px-2 py-1">
                  <Icon icon="material-symbols:sim-card-download-outline-rounded" />
                  Download
                </div>
              </PDFDownloadLink>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 h-full w-full">
        <EstimateAndInvoiceCard ref={componentRef} estimate={estimate} />
      </div>

      {ConfirmationDialog()}
    </div>
  );
}

export default EstimateDetails;
