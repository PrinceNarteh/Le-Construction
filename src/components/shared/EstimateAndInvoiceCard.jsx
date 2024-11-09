import { format } from "date-fns";
import { format as formatPhoneNumber } from "libphonenumber-js";
import React from "react";
import { useUserSelector } from "../../hooks/useUserSelector";
import useFormatCurrency from "../../hooks/useFormatCurrency";

const EstimateAndInvoiceCard = React.forwardRef(({ estimate }, ref) => {
  const { formatCurrency } = useFormatCurrency();
  const { user } = useUserSelector();

  return (
    <div className="w-full h-screen bg-white rounded-md relative" ref={ref}>
      <div className="rounded-md grid grid-cols-3 ">
        <div className="bg-primary col-span-2 rounded-l-md flex items-center p-6">
          <div className="">
            <h3 className="text-4xl font-semibold text-white font-open">
              {estimate?.title}
            </h3>
            {/* <h3 className="text-white font-open"></h3> */}
          </div>
        </div>

        <div className="bg-neutral-700 col-span-1 rounded-r-md flex justify-center items-center p-6">
          <div className="">
            <h3 className="font-open text-white flex justify-center">
              Grand Total
            </h3>
            <h3 className="font-open flex justify-center text-4xl text-white">
              {formatCurrency(estimate?.total)}
            </h3>
          </div>
        </div>
      </div>

      <div className="flex justify-between p-6">
        <div className="">
          <div className="font-semibold text-gray-300">BILL TO</div>
          <div className="text-black font-bold">
            {estimate?.client.first_name} {estimate?.client.last_name}
          </div>
        </div>

        <div className=" text-sm space-y-1">
          <div className="flex justify-between">
            <div className="text-black font-bold">Estimate Number : </div>
            <div className="ml-3">1</div>
          </div>
          <div className="flex justify-between">
            <div className="text-black font-bold">Estimate Date : </div>
            <div className="ml-3">
              {estimate?.date
                ? format(new Date(estimate.date), "PPP")
                : estimate?.invoice_date
                  ? format(
                    new Date(
                      estimate?.date ? estimate.date : estimate?.invoice_date
                    ),
                    "PPP"
                  )
                  : null}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-black font-bold">Expires On : </div>
            <div className="ml-3">
              {estimate?.due_date
                ? format(new Date(estimate?.due_date), "PPP")
                : null}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow pl-3 pr-3">
        <div className="flex w-full text-black text-sm font-bold leading-tight">
          <div className="w-10">
            <div className="ml-3">No.</div>
          </div>
          <div className="w-[30%]">
            <div className="ml-3">Items</div>
          </div>
          <div className="w-[30%] text-center">Quantity</div>
          <div className="w-[30%] text-center">Price</div>
          <div className="w-[15%]">Amount</div>
        </div>

        <div className="border-b-2 border-black mt-4"></div>
        {(estimate?.product || estimate?.products)?.map((product, idx) => (
          <div
            key={idx}
            className="flex text-black text-sm font-bold leading-tight bg-gray-100 p-3 border-b-2"
          >
            <div className="w-10 truncate">{idx + 1}</div>
            <div className="w-[30%] truncate">{product.name}</div>
            <div className="w-[30%] text-center">{product.quantity}</div>
            <div className="w-[30%] text-center">
              {formatCurrency(product.price)}
            </div>
            <div className="w-[15%] text-center">
              {formatCurrency(
                parseInt(product.quantity) * parseFloat(product.price)
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-4 pr-3">
        <div className="w-[50%] flex justify-end ">
          <div className="space-y-2">
            <div className="flex">
              <div className="w-full flex justify-end mr-10 text-black font-bold">
                Total :{" "}
              </div>
              <div>{formatCurrency(estimate?.sub_total)}</div>
            </div>
            <div className="border-b-2 border-black"></div>
            <div className="flex">
              <div className="w-full mr-10 text-black font-bold">
                Grand Total:
              </div>
              <div>{formatCurrency(estimate?.total)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className=" absolute w-full bottom-0 border-t bg-gray-50 rounded-md pt-3 pb-3 pl-20 pr-20 flex justify-between text-sm">
        <div>
          <img
            src={user?.brand?.company_logo}
            alt=""
            className="h-20 w-20 rounded-full object-cover"
          />
        </div>
        <div>
          <div className="font-bold">{user.company_name}</div>
          <p>{user?.company_settings?.address?.street}</p>
          <p>{user?.company_settings?.address?.state}</p>
          <p>
            {user?.company_settings?.address?.city},{" "}
            {user?.company_settings?.address?.zip}
          </p>
          <p>{user?.company_settings?.address?.country}</p>
        </div>
        <div>
          <div className="font-bold">Contact Information</div>
          <div>
            Phone: {formatPhoneNumber(user?.phone_number, "INTERNATIONAL")}
          </div>
          <div>Email: {user?.email}</div>
          <div>www.nailed.biz</div>
        </div>
      </div>
    </div>
  );
});

export default EstimateAndInvoiceCard;
