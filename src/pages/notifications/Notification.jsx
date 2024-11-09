import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Spinner from "../../components/Spinner";
import NotificationForm from "../../components/forms/NotificationForm";
import Heading from "../../components/layout/Heading";
import Modal from "../../components/shared/Modal";
import { queryKeys } from "../../constants";
import useConfirm from "../../hooks/useConfirm";
import useMutate from "../../hooks/useMutate";
import usePostQuery from "../../hooks/usePostQuery";

function Notification() {
  const queryClient = useQueryClient();
  const { confirm, ConfirmationDialog, setIsOpen } = useConfirm();
  const [OpenNotification, setOpenNotification] = useState(false);
  const {
    data: notifications,
    isLoading,
    refetch,
  } = usePostQuery({
    url: "/notifications",
    queryKey: [queryKeys.Notifications],
  });
  const [activeNotification, setActiveNotification] = useState({});

  const { mutate } = useMutate([queryKeys.DeleteNotification]);
  const handleDelete = async () => {
    const yes = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to delete "${activeNotification?.title}"?`,
    });

    if (yes) {
      const toastId = toast.loading("Deleting notification...");

      mutate(
        {
          url: "/notifications/delete",
          method: "DELETE",
          data: {
            notification_id: activeNotification?._id,
          },
        },
        {
          onSuccess: async (data) => {
            await queryClient.invalidateQueries(
              [queryKeys.Notifications],
              (oldData) => ({
                message: (oldData?.message ?? []).filter(
                  (item) => item._id !== activeNotification?._id
                ),
              })
            );
            toast.dismiss(toastId);
            toast.success("Notification deleted successfully");
            setIsOpen(false);
          },
          onError(error) {
            toast.dismiss(toastId);
            toast.error(error.response.data.message);
          },
        }
      );
    }
  };

  useEffect(() => {
    if (notifications) {
      setActiveNotification(notifications.message[0]);
    }
  }, [notifications]);

  return (
    <div className="h-[calc(100vh_-_100px)]">
      <div className="flex justify-between items-center px-8">
        <Heading label="Notifications" />
        <button
          className="py-2 px-5 bg-primary text-white rounded-md font-semibold mt-1 flex items-center"
          onClick={() => setOpenNotification(true)}
        >
          <Icon icon="fa:send" className="mr-2" />
          Send Notification
        </button>
      </div>

      {isLoading && <Spinner isSubmitting={isLoading} />}

      <div className="grid grid-cols-3 px-9 mt-5 gap-8">
        <div className="h-[calc(100vh_-_170px)] overflow-y-auto bg-white w-full col-span-1 rounded-xl p-6">
          <div className="">
            <div className="flex justify-between mb-3">
              <div className="text-primary text-sm font-medium leading-[25.02px] ">
                Notifications
              </div>
              <div className="text-primary text-sm font-normal leading-[25.02px] flex items-center">
                Mark all as read
                <Icon icon="carbon:checkmark-outline" className="ml-1" />
              </div>
            </div>

            <div className="space-y-2">
              {isLoading && (
                <Spinner isSubmitting={isLoading} /> // Display the spinner
              )}
              {notifications?.message
                .sort((a, b) => Date(b.date_and_time) - Date(a.date_and_time))
                .map((notification, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveNotification(notification)}
                    className="border-b rounded-md p-3 bg-gray-50 shadow-lg cursor-pointer"
                  >
                    <div className="line-clamp-1 text-blue-900 text-md font-semibold leading-[25.02px]">
                      {notification.title}
                    </div>

                    <div className=" border-l-4 pl-2 rounded-md border-l-primary text-slate-400 text-sm font-medium leading-[20.02px] line-clamp-2 mt-2 text-ellipsis">
                      {notification.body}
                    </div>

                    <div className="flex justify-end items-center font-open mt-2 text-slate-400 text-xs font-medium leading-[20.02px]">
                      {notification.date_and_time}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="h-[calc(100vh_-_170px)] bg-white w-full col-span-2 rounded-xl p-7">
          <div className="mb-3 flex justify-between">
            <div className="flex">
              <Icon icon="solar:danger-broken" className="h-5 w-5 mr-3" />

              <Icon
                icon="fluent:delete-48-regular"
                onClick={handleDelete}
                className="h-5 w-5 text-red-500 cursor-pointer"
              />
            </div>

            <div className="text-slate-400 text-[15px] font-normal leading-[25.02px]">
              {activeNotification?.date_and_time}
            </div>
          </div>
          <div className="bg-gray-50 rounded-md">
            <div className="p-5 space-y-5">
              <div className="bg-blue-50 p-2 border-b border-b-blue-400">
                <div className="text-blue-900 text-lg font-bold leading-[25.02px]">
                  {activeNotification?.title}
                </div>
              </div>

              <div>
                <div className="text-blue-900 text-base font-normal leading-normal pl-2 rounded-md">
                  {activeNotification?.body}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal openModal={OpenNotification} closeModal={setOpenNotification}>
        <NotificationForm
          refetch={refetch}
          closeModal={() => setOpenNotification(false)}
        />
      </Modal>

      {ConfirmationDialog()}
    </div>
  );
}

export default Notification;
