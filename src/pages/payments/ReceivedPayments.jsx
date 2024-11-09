import React, { useState } from "react";
import Spinner from "../../components/Spinner";
import RecordPaymentForm from "../../components/forms/payments/RecordPaymentForm";
import Heading from "../../components/layout/Heading";
import Modal from "../../components/shared/Modal";
import usePostQuery from "../../hooks/usePostQuery";
import transformData from "../../utils/transformData";
import { queryKeys } from "../../constants";

function ReceivedPayments() {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const { data, isLoading } = usePostQuery({
    url: "/transactions/received",
    queryKey: [queryKeys.ReceivePayment],
    data: {
      status: "succeeded",
    },
  });

  const transactions = transformData({ data, category: "invoice" });

  return (
    <div className="px-20 cursor-pointer">
      <div className="flex justify-between items-center mt-5">
        <div>
          <Heading label="Received Payments" />
        </div>

        <div className="flex items-center">
          <div
            onClick={() => setOpenPaymentModal(true)}
            className="w-40 font-semibold text-white bg-primary p-2 rounded-md flex justify-center items-center mr-3"
          >
            <div>Record a Payment</div>
          </div>
        </div>
      </div>

      <div className=" mt-8 ">
        <div className="flex text-slate-400 text-[16px] font-bold leading-tight p-3 ">
          <div className="w-[15%]">Amount</div>
          <div className="w-[15%]">Date</div>
          <div className="w-[20%] mr-6">From</div>
          <div className="w-[20%]">Account</div>
          <div className="w-[15%] mr-8">Receipt</div>

          <div className="w-[%]">Action</div>
        </div>

        <div className="border-b border-black mt-4"></div>

        {isLoading && <Spinner isSubmitting={isLoading} />}

        {transactions.map((trans, index) => {
          return (
            <div
              key={index}
              className={`flex text-neutral-800 text-sm font-bold leading-tight py-5 pl-3 border-b border-slate-300 ${
                index % 2 === 1 ? "bg-gray-200 rounded-md" : ""
              }`}
            >
              <div className="w-[15%] text-green-500">{trans.amount}</div>
              <div className="w-[15%]">{trans.date}</div>
              <div className="w-[20%] truncate mr-6">{trans.description}</div>
              <div className="w-[20%]">{trans.account}</div>
              <div className="w-[15%] truncate mr-8">{trans.category}</div>

              <div className="w-[%]">
                <div className=" rounded-md text-primary">Sent</div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal openModal={openPaymentModal} closeModal={setOpenPaymentModal}>
        <RecordPaymentForm />
      </Modal>
    </div>
  );
}

export default ReceivedPayments;
