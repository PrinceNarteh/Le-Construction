import toast from "react-hot-toast";
import DetailsCard from "../../components/shared/DetailsCard";
import ImageGallery from "../../components/shared/ImageGallery";
import useConfirm from "../../hooks/useConfirm";
import { useGetQuery } from "../../hooks/useGetQuery";
import useMutate from "../../hooks/useMutate";
import { queryKeys } from "../../constants/queryKeys";
import { useUserSelector } from "../../hooks/useUserSelector";

function BidDetails({ bid, closeDetails, refetch }) {
  const { user } = useUserSelector();
  const { confirm, ConfirmationDialog, setIsOpen } = useConfirm();
  const { data: bider, isLoading } = useGetQuery({
    queryKey: [queryKeys.Builders, bid?.builder_id],
    url: `/builder/${bid?.builder_id}`,
    enable: Boolean(bid),
  });

  const { mutate } = useMutate([queryKeys.AssignTaskToBuilder]);
  const assignBuilder = async () => {
    const data = {
      task_id: bid?.task_id,
      builder_id: bid.builder_id,
      project_id: bid.project_id,
    };

    const isConfirmed = await confirm({
      title: "Are you sure?",
      message: `Are you sure you want to assign "${bid?.task_title}" to ${bider?.message.f_name} ${bider?.message.l_name}?`,
      confirmButtonLabel: "Yes, Assign",
      fullWidth: true,
    });

    if (isConfirmed) {
      const toastId = toast.loading(`Assigning task to builder...`);

      mutate(
        {
          url: "/task/assign/builder",
          data,
        },
        {
          async onSuccess(data) {
            await refetch();
            toast.dismiss(toastId);
            toast.success("Task assigned builder successfully");
            setIsOpen(false);
            closeDetails(null);
          },
          onError(error) {
            toast.dismiss(toastId);
            toast.error(error.response.data.message);
            setIsOpen(false);
          },
        }
      );
    }
  };

  return (
    <DetailsCard
      heading={"Task Details"}
      image={bid?.task_thumbnail}
      title={`${bid?.task_title}`}
      description={bid?.task_description}
      openDetails={!!bid}
      closeDetails={closeDetails}
      actionButtons={() => (
        <>
          <button
            onClick={() => assignBuilder()}
            className="font-bold tracking-widest border border-primary rounded-md text-primary text-xs py-1 px-3 hover:text-white hover:bg-primary duration-300"
          >
            Assign
          </button>
        </>
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row mt-5">
        <div className="flex-1 bg-white rounded-lg p-8">
          {bid?.bid_files.length > 0 ? (
            <ImageGallery images={bid?.bid_files} />
          ) : (
            <img
              src={bid?.task_thumbnail}
              alt=""
              className="h-80 w-full object-cover rounded-md"
            />
          )}
        </div>

        <div className="flex-1 bg-white p-8 rounded-md space-y-5">
          <div className="whitespace-nowrap text-blue-900 text-[20px] font-bold flex items-center justify-between">
            <p>Bid Amount:</p>
            <p>
              {user?.company_settings?.currency?.symbol}
              {bid?.bid_amount}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="whitespace-nowrap text-blue-900 text-[20px] font-bold">
              Bidder
            </p>
            <>
              {isLoading ? (
                <p>Loading</p>
              ) : (
                <div className="flex gap-3">
                  <div className="flex text-right items-center gap-2 border rounded-md p-1">
                    <div>
                      <p className="text-blue-900 font-semibold">
                        {bider?.message.f_name} {bider?.message.l_name}
                      </p>
                      <p className="text-sm">{bider?.message.email}</p>
                    </div>
                    <img
                      src={bider?.message.profile_image}
                      alt=""
                      className="h-12 w-12 object-cover rounded-md"
                    />
                  </div>
                </div>
              )}
            </>
          </div>
        </div>
      </div>

      {/* Assign Task */}
      {/* <Modal openModal={assignModal} closeModal={setAssignModal} fullWidth>
        <form onSubmit={assignedSubmit} className="space-y-3">
          <div>
            <div className=" text-blue-900 font-bold">Assign:</div>
            <p className="text-xl pl-5 pt-2">{task?.task_name}</p>
          </div>

          <CustomSelect
            data={builders}
            label="Builders"
            onChange={setBuilderId}
            placeholder="Select Builder"
            loading={isLoading}
          />

          <button className="float-right bg-primary py-2 px-5 text-white font-bold tracking-widest rounded-md">
            Assign
          </button>
        </form>
      </Modal> */}

      {/* Invite Builder or Group*/}
      {/* <Modal openModal={inviteModal} closeModal={setInviteModal} fullWidth>
        <form onSubmit={submitInvite} className="space-y-3">
          <div>
            <div className=" text-blue-900 font-bold text-2xl">Invite:</div>
            <p className="text-xl pl-5 pt-2">{task?.task_name}</p>
          </div>

          <div className="flex justify-between items-center pt-4 gap-10">
            <h3 className="mb-1 block text-blue-900 text-md font-semibold leading-loose whitespace-nowrap">
              Send Invite To:
            </h3>
            <div className="relative h-8 w-8/12 flex ring-1 rounded-full ring-offset-4">
              <div
                className={`absolute w-1/2 top-0 ${
                  sendTo === "builder" ? "translate-x-0" : "translate-x-full"
                } h-full px-5 py-2 bg-primary rounded-full shadow transform  duration-500`}
              ></div>
              <button
                type="button"
                className={`text-blue-900 bg-transparent flex-1 z-10 font-bold ${
                  sendTo === "builder" && "text-white"
                } duration-500`}
                onClick={() => setSendTo("builder")}
              >
                Builder
              </button>
              <button
                type="button"
                className={`text-blue-900 bg-transparent flex-1 z-10 font-bold ${
                  sendTo === "group" && "text-white"
                } duration-500`}
                onClick={() => setSendTo("group")}
              >
                Group
              </button>
            </div>
          </div>

          {sendTo === "builder" ? (
            <CustomSelect
              data={builders}
              label="Builders"
              placeholder="Select Builder"
              onChange={setInviteId}
            />
          ) : (
            <CustomSelect
              data={buildersGroups}
              label="Groups"
              placeholder="Select Group"
              onChange={setInviteId}
            />
          )}

          <button className="float-right bg-primary py-2 px-5 text-white font-bold tracking-widest rounded-md">
            Send Invite
          </button>
        </form>
      </Modal> */}

      {ConfirmationDialog()}
    </DetailsCard>
  );
}

export default BidDetails;
