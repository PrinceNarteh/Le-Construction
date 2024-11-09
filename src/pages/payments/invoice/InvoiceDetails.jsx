import { Icon } from "@iconify/react";
import { pdf } from "@react-pdf/renderer";
import { format, formatDistanceToNowStrict } from "date-fns";
import { format as formatPhoneNumber } from "libphonenumber-js";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";
import RecordPaymentForm from "../../../components/forms/payments/RecordPaymentForm";
import Heading from "../../../components/layout/Heading";
import EstimateAndInvoiceCard from "../../../components/shared/EstimateAndInvoiceCard";
import Modal from "../../../components/shared/Modal";
import PDFFile from "../../../components/shared/PDFFile";
import { queryKeys } from "../../../constants";
import useConfirm from "../../../hooks/useConfirm";
import useMutate from "../../../hooks/useMutate";
import { useUserSelector } from "../../../hooks/useUserSelector";
import useFormatCurrency from "../../../hooks/useFormatCurrency";
import { useCompanySettingsSelector } from "../../../hooks/useCompanySettings";

function InvoiceDetails({ invoice }) {
  const { user } = useUserSelector();
  const { companySettings } = useCompanySettingsSelector();
  const { formatCurrency } = useFormatCurrency();
  const queryClient = useQueryClient();
  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [invoicePDF, setInvoicePDF] = useState(null);

  const { mutate } = useMutate(["send-invoice"]);
  const sendInvoice = async () => {
    const isConfirmed = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to send this invoice to ${invoice?.client.first_name} ${invoice?.client.last_name}?`,
      confirmButtonLabel: "Yes, Send!",
      confirmButtonColor: "bg-green-400",
      fullWidth: true,
    });

    if (isConfirmed) {
      const toastId = toast.loading(
        `Sending invoice to ${invoice?.client.first_name} ${invoice?.client.last_name}`,
      );

      const data = {
        invoice_id: invoice?._id,
        invoice_file: invoicePDF,
      };

      mutate(
        {
          url: "/invoice/send",
          multipart: true,
          data,
        },
        {
          async onSuccess(data) {
            await queryClient.setQueryData(
              [queryKeys.Invoices, invoice?._id],
              data,
            );
            toast.dismiss(toastId);
            toast.success(
              `Invoice sent to ${invoice?.client.first_name} ${invoice?.client.last_name} successfully`,
            );
          },
          onError(error) {
            toast.dismiss(toastId);
            toast.error(error.response.data.message);
          },
          onSettled() {
            setIsOpen(false);
          },
        },
      );
    }
  };

  useEffect(() => {
    const createPDF = async () => {
      if (invoice) {
        const pdfData = {
          ...invoice,
          date: format(new Date(invoice?.invoice_date || Date.now()), "PPP"),
          dueDate: format(new Date(invoice?.due_date || Date.now()), "PPP"),
          phoneNumber: formatPhoneNumber(
            user?.phone_number || "",
            "INTERNATIONAL",
          ),
          logo: companySettings?.branding.company_logo,
          currency: companySettings?.currency?.symbol,
          primaryColor: companySettings?.branding?.primary_color,
        };
        const blob = await pdf(
          <PDFFile
            data={pdfData}
            user={user}
            companySettings={companySettings}
          />,
        ).toBlob();
        const pdfFile = new File([blob], `${invoice?.title}.pdf`, {
          type: blob.type,
        });
        setInvoicePDF(pdfFile);
      }
    };
    createPDF();
  }, [user, invoice]);

  return (
    <div className="p-10 rounded-lg font-ray cursor-pointer bg-white">
      <div className="flex justify-between items-center">
        <Heading label={`Invoice #${invoice?._id}`} />
        <Link to="/payment/invoice/add-invoice">
          <div className=" border border-primary p-2 flex justify-center items-center w-48 rounded-full font-semibold text-primary ml-3">
            Create another invoice
          </div>
        </Link>
      </div>

      <div className="border-b border-slate-300 mt-3"></div>

      <div className="flex justify-between items-center mt-5">
        <div className="flex ">
          <div className="mr-6">
            <div className="text-sm font-semibold text-neutral-600">Status</div>
            <div className="font-semibold text-neutral-600 p-1 h-8 text-sm w-20 rounded-md flex justify-center items-center bg-neutral-200 mr-2 mt-2">
              {invoice?.status}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-neutral-600">Client</div>
            <div className="font-bold font-ray text-primary p-1 text-lg rounded-md flex justify-center items-center mr-2 mt-2">
              {invoice?.client.first_name} {invoice?.client.last_name}
            </div>
          </div>
        </div>

        <div className="flex ">
          <div className="mr-6">
            <div className="text-sm font-semibold text-neutral-600">
              Amount due
            </div>
            <div className="font-bold text-neutral-800 p-1 font-ray  text-xl flex justify-center items-center mr-2 mt-2">
              {formatCurrency(invoice?.total)}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-neutral-600">Due</div>
            <div className="font-bold text-neutral-800 p-1 font-ray  text-xl flex justify-center items-center mr-2 mt-2">
              {invoice?.due_date &&
                formatDistanceToNowStrict(new Date(invoice?.due_date))}
            </div>
          </div>
        </div>
      </div>

      {/* <a href={instance.url} download="invoice.pdf">
        download
      </a> */}

      <div className="border border-slate-300 rounded-xl p-6  mt-5">
        <div className="flex justify-between items-center">
          <div className="flex ">
            <div className="mr-6">
              <div className="font-semibold p-2 h-10 text-sm w-10 rounded-full flex justify-center items-center border-2 border-primary mr-2">
                <Icon
                  icon="pepicons-pencil:file"
                  className="h-8 w-8 text-primary"
                />
              </div>
            </div>
            <div>
              <div className="text-xl font-semibold text-neutral-600 ml-1">
                Create
              </div>
              <div className="font-bold font-ray text-neutral-500 p-1 text-sm rounded-md flex justify-center items-center mr-2 mt-1">
                <span className="text-neutral-800 mr-1"> Created : </span> just
                a moment ago
              </div>
            </div>
          </div>

          <div className="flex ">
            {/* <div className="mr-4">
              <div className="bg-primary text-white p-2 flex justify-center items-center w-40 rounded-full font-semibold text-primary">
                Approve draft
              </div>
            </div> */}
            <button className=" border border-primary p-2 flex justify-center items-center w-40 rounded-full font-semibold text-primary">
              Edit draft
            </button>
          </div>
        </div>
      </div>

      <div className="border-l-4 border-slate-300 h-6 ml-14"></div>

      <div className="border border-slate-300 rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div className="flex ">
            <div className="mr-6">
              <div className="font-semibold p-2 h-10 text-sm w-10 rounded-full flex justify-center items-center border-2 border-primary mr-2">
                <Icon icon="quill:send" className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <div className="text-xl font-semibold text-neutral-600 ml-1">
                Send
              </div>
              <div className="font-bold font-ray text-neutral-500 p-1 text-sm rounded-md flex justify-center items-center mr-2 mt-1">
                <span className="text-neutral-800 mr-1"> Last Sent : </span>
                Never
              </div>
            </div>
          </div>

          <div className="flex ">
            <div className="mr-4">
              <button
                disabled={invoice?.status === "Paid"}
                onClick={() => sendInvoice()}
                className="bg-primary disabled:bg-neutral-700 disabled:cursor-not-allowed text-white p-2 flex justify-center items-center w-40 rounded-full font-semibold text-primary"
              >
                {invoice?.status === "Sent"
                  ? "Resend Invoice"
                  : invoice?.status === "Paid"
                    ? "Paid"
                    : "Send Invoice"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-l-4 border-slate-300 h-6 ml-14"></div>

      <div className="border border-slate-300 rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div className="flex ">
            <div className="mr-6">
              <div className="font-semibold p-2 h-10 text-sm w-10 rounded-full flex justify-center items-center border-2 border-primary mr-2">
                <Icon
                  icon="fluent:payment-20-regular"
                  className="h-8 w-8 text-primary"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-xl font-semibold text-neutral-600 ml-1">
                Get Paid
              </div>
              {invoice?.status !== "Paid" && (
                <div className="font-bold font-ray text-neutral-500 p-1 text-sm rounded-md flex justify-center items-center mr-2 mt-1">
                  <>
                    <span className="text-neutral-800 mr-1">
                      {" "}
                      Amount Due :{" "}
                    </span>
                    ${invoice?.total} -{" "}
                    <span
                      onClick={() => setOpenPaymentModal(true)}
                      className="text-primary mr-1 ml-1"
                    >
                      Record a payment manually
                    </span>
                  </>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mr-4 flex justify-end">
              <button
                onClick={() => setOpenPaymentModal(true)}
                disabled={invoice?.status === "Paid"}
                className="bg-primary disabled:bg-neutral-700 disabled:cursor-not-allowed text-white p-2 flex justify-center items-center w-44 rounded-full font-semibold text-primary"
              >
                {invoice?.status === "Paid" ? "Paid" : "Record Payment"}
              </button>
            </div>
            {invoice?.status !== "Paid" && (
              <div className="font-bold font-ray text-neutral-500 p-1 text-sm rounded-md flex justify-center items-center mr-2 mt-1">
                <span className="text-neutral-800 mr-1"> Status : </span>
                Your invoice is awaiting payment
              </div>
            )}
          </div>
        </div>

        <div className="border-b border-slate-300 mt-3 ml-[5rem]"></div>

        <div className="mt-3 ml-[5.5rem]">
          {invoice?.status === "Paid" && (
            <>
              {invoice.receipts.map((receipt) => (
                <>
                  <div className="text-neutral-800 mr-1 font-bold">
                    Payments received :
                  </div>
                  <div className="font-bold font-ray text-neutral-500 text-sm mt-1">
                    {receipt.date_paid} - A payment of
                    <span className="text-neutral-800 mr-1 ml-1">
                      ${receipt.total}
                    </span>{" "}
                    was made.
                  </div>
                </>
              ))}
            </>
          )}
          {/* <div className="flex font-bold font-ray text-primary text-sm mt-1">
            <div className="mr-3">Send a receipt</div>
            <div className="mr-3">Edit payment</div>
            <div>Remove payment</div>
          </div> */}
        </div>
      </div>

      <div className="mt-7">
        <EstimateAndInvoiceCard estimate={invoice} />
      </div>

      {/* Send Invoice */}
      {ConfirmationDialog()}

      {/* <Modal openModal={openSendModal} closeModal={setOpenSendModal}>
        <SendInvoice />
      </Modal> */}

      <Modal openModal={openPaymentModal} closeModal={setOpenPaymentModal}>
        <RecordPaymentForm
          invoice_id={invoice?._id}
          setOpenPaymentModal={setOpenPaymentModal}
        />
      </Modal>
    </div>
  );
}

export default InvoiceDetails;
