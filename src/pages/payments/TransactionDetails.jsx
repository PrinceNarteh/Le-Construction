import { format } from "libphonenumber-js";
import React from "react";
import useFormatCurrency from "../../hooks/useFormatCurrency";

function TransactionDetails({ transaction }) {
  const { formatCurrency } = useFormatCurrency();
  //console.log({ transaction });

  return (
    <div className="bg-white p-10 rounded-xl">
      <div className="w-full bg-white rounded-lg">
        <div className="flex justify-between items-center">
          <div className="w-[193px] text-blue-900 text-xl font-bold leading-[33.60px]">
            Payment {transaction?.invoice ? "From" : "To"}:
          </div>
          <div className="w-[262px] text-right text-blue-900 text-xl font-bold leading-[33.60px]">
            {transaction?.payment.name}
          </div>
        </div>
        <div className="flex justify-between mt-4 border p-5 rounded-md">
          <div className="w-[346px] text-slate-600 text-md font-normal leading-[30px]">
            <p>
              <span className="font-bold text-blue-700">Email: </span>{" "}
              {transaction?.contractor?.email}
            </p>
            <p>
              <span className="font-bold text-blue-700">Phone Number: </span>{" "}
              {transaction?.contractor
                ? format(transaction?.contractor?.phone ?? "", "INTERNATIONAL")
                : ""}
            </p>
          </div>
          <div className="w-[346px] text-right text-slate-600 text-md font-normal">
            {transaction?.payment.payment_date} |{" "}
            {transaction?.payment.payment_time}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-5">
        <div className="w-[193px] text-blue-900 text-xl font-bold leading-[33.60px]">
          Payment {transaction?.invoice ? "To" : "From"}:
        </div>
        <div className="w-[262px] text-right text-blue-900 text-xl font-bold leading-[33.60px]">
          {transaction?.company.company_name}
        </div>
      </div>

      <div className="w-full bg-white rounded-lg mt-4 space-y-5 p-5 border">
        {transaction?.invoice ? (
          <>
            <div className="flex justify-between items-center">
              <div className="w-[193px] text-blue-900 text-xl font-bold leading-[33.60px]">
                Description
              </div>
              <div className="w-[262px] text-right text-blue-900 text-xl font-bold leading-[33.60px]">
                Amount
              </div>
            </div>
            {transaction?.invoice?.products.map((product, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="w-[346px] text-slate-600 text-md font-normal leading-[30px]">
                  {product.name}
                </div>
                <div className="w-[346px] text-right text-slate-600 text-md font-normal">
                  {formatCurrency(product.price)}
                </div>
              </div>
            ))}
            <div className="border-b "></div>
          </>
        ) : null}
        {/* <div className="flex justify-between items-center">
          <div className="w-[346px] text-slate-600 text-md font-normal leading-[30px]">
            Marketing Costs
          </div>
          <div className="w-[346px] text-right text-slate-600 text-md font-normal">
            $980.50
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="w-[346px] text-slate-600 text-md font-normal leading-[30px]">
            Based Charge (monthly)
          </div>
          <div className="w-[346px] text-right text-slate-600 text-md font-normal">
            $530.20
          </div>
        </div> */}
        {/* <div className="flex justify-between items-center">
          <div className="w-[193px] text-blue-900 text-xl font-bold leading-[33.60px]">
            SubTotal
          </div>
          <div className="w-[262px] text-right text-blue-900 text-xl font-bold leading-[33.60px]">
            $3,310.70
          </div>
        </div> */}
        {/* <div className="flex justify-between items-center">
          <div className="w-[346px] text-slate-600 text-md font-normal leading-[30px]">
            Vat
          </div>
          <div className="w-[346px] text-right text-slate-600 text-md font-normal">
            +$30.50
          </div>
        </div> */}
        <div className="border-b "></div>
        <div className="flex justify-between items-center">
          <div className="w-[193px] text-blue-900 text-xl font-bold leading-[33.60px]">
            Total
          </div>
          <div className="w-[262px] text-right text-blue-900 text-xl font-bold leading-[33.60px]">
            {formatCurrency(transaction?.payment.amount)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetails;
