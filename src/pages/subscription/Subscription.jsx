/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { useState } from "react";
import { useGetQuery } from "../../hooks/useGetQuery";
import { queryKeys } from "../../constants";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useMutate from "../../hooks/useMutate";
import { useUserSelector } from "../../hooks/useUserSelector";

const SubscriptionPage = () => {
    //const [price, setPricing] = useState(null);
    const { user } = useUserSelector();
  const navigate = useNavigate();
  const { data: prices, isLoading } = useGetQuery({
    queryKey: [queryKeys.Prices],
    url: "/subscription/prices",
  });

    const subscribe = (subscriptionData) => {
    const data = {
      price_id: subscriptionData?.priceId,
      customer_id: user.company.stripe_customer.id,
      success_url: subscriptionData.successUrl,
      cancel_url: subscriptionData.cancelUrl,
    };

    handleMutation(data);
  };

  const { mutate } = useMutate([queryKeys.Subscribe]);
  const handleMutation = (data) => {
    const toastId = toast.loading(`preparing for subscription...`);

    mutate(
      {
        url: "/subscribe",
        data,
      },
      {
        async onSuccess(data) {
          console.log(data.message);
          toast.dismiss(toastId);
          window.location.href = data.message.url;
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      }
    );
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            The Best Pricing On The Market
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Powerful plans for every stage of your builder journey.
          </p>
        </div>

        <div className="ml-40 grid grid-cols-2 gap-x-0 m-8 gap-y-16 border-t border-gray-200 sm:pt-8 lg:grid-cols-2">
          {isLoading ? (
            <Spinner isSubmitting={isLoading} /> // Display the spinner
          ) : (
            <>
              {prices.message?.map((price, index) => {
                return (
                  <div
                    key={index}
                    className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0"
                  >
                    <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                      <div className="mx-auto max-w-xs px-8">
                        <p className="text-base font-semibold text-gray-600">
                          {price.recurring.interval}ly
                        </p>
                        <p className="mt-6 flex items-baseline justify-center gap-x-2">
                          <span className="text-5xl font-bold tracking-tight text-gray-900">
                            ${price.unit_amount / 100}
                          </span>
                          <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                            USD
                          </span>
                        </p>
                        <a
                          onClick={() => {
                            subscribe({
                              priceId: price.id,
                              successUrl: `${window.location.origin}/login`,
                              cancelUrl: `${window.location.origin}/subscribe`,
                            });
                          }}
                          className="bg-primary mt-10 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Get access
                        </a>
                        <p className="mt-6 text-xs leading-5 text-gray-600">
                          Invoices and receipts available for easy company
                          reimbursement
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-base font-normal tracking-tight text-white rounded-full bg-primary w-32 pl-4">
              Most Popular
            </h3>
            <p className="mt-6 text-base leading-7 text-gray-600">
              The must-have solution for maximizing profitability and growing
              your business, We provide you and your teams (small, medium and
              large) with the best features.
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-green-800">
                What’s included
              </h4>
              <div className="h-px flex-auto bg-gray-100"></div>
            </div>
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
            >
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Get a fully customizable admin dashboard
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Get a custom mobile app for your sub-contractors
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Get a custom mobile app for your clients
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                + Admin dashboard as app on the GO.
              </li>

              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Simplified 3D Scanning with client app.
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Generate Instant 2D floorplan.
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Receive projects from client in different formats (3D, 2D,
                images, video).
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Break project down into tasks
              </li>

              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Simplified way to add your sub-contractors.
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Create groups for your sub-contractors.
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Open tasks for bids.
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Invite sub-contractors to place their bid.
              </li>

              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Review received bids.
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Assign tasks to sub-contractors.
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Sub-Contractor Clock-In & Clock-Out on job site.
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Track sub-contractors check-in activities.
              </li>

              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Pay-Out Sub-Contractors.
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Easily generate & send advanced invoices to clients.
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Easily generate & send advanced estimates to clients.
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Receive payments from clients.
              </li>

              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Financial Managements.
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Chats with (clients and sub-contractors).
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Change Orders
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Interactive map to locate sub-contractors
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Advance signature signing (at your fingertip)
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Get notified
              </li>
              <li className="flex gap-x-3">
                <svg
                  className="h-6 w-5 flex-none text-green-800"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                +Many other features and updates.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
