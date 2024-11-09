import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import TeamForm from "../../components/forms/website/TeamForm";
import Modal from "../../components/shared/Modal";
import TeamCard from "../../components/shared/TeamCard";
import { useCompanySelector } from "../../hooks/useCompanySelector";
import useConfirm from "../../hooks/useConfirm";
import useMutate from "../../hooks/useMutate";
import { useSetCompany } from "../../hooks/useSetCompany";
import { useWebsiteSelector } from "../../hooks/useWebsiteSelector";
import { setWebsite } from "../../app/feature/company/websiteSlice";

function Team() {
  const { company } = useCompanySelector();
  const { website } = useWebsiteSelector();
  const [openModal, setOpenModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState(website?.about_us_team || []);

  useEffect(() => {
    setTeamMembers(website?.about_us_team || []);
  }, [website]);

  const { ConfirmationDialog, confirm, setIsOpen } = useConfirm();
  const { mutate } = useMutate(["delete-team-member"]);
  const handleDelete = async (member) => {
    const isConfirmed = await confirm({
      title: "Are You Sure?",
      message: `Are you sure you want to delete "${member?.name}"?`,
    });

    if (isConfirmed) {
      const toastId = toast.loading(`Deleting ${member?.name}...`);
      const data = {
        company_id: company?.website_id,
        name: member?.name,
      };

      mutate(
        {
          url: "/website/about/delete/team_member",
          method: "PATCH",
          data,
        },
        {
          onSuccess(data) {
            setWebsite(data.message);
            setTeamMembers((prevMembers) => prevMembers.filter(m => m.name !== member.name));
            toast.dismiss(toastId);
            toast.success(`${member?.name} deleted successfully`);
            setIsOpen(false);
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
    <div className="px-7">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-semibold text-blue-900 text-3xl">Team Section</h3>
        <button
          onClick={() => setOpenModal(true)}
          className="w-44 py-3 px-5 bg-primary text-white text-sm rounded-md font-semibold"
        >
          + Add Team Member
        </button>
      </div>

      <div className="flex gap-5 flex-wrap justify-center">
        {teamMembers?.map((member, key) => (
          <TeamCard key={key} member={member} handleDelete={handleDelete} />
        ))}
      </div>
      <Modal
        openModal={openModal}
        closeModal={setOpenModal}
        className="place-content-start"
      >
        <TeamForm closeModal={setOpenModal} />
      </Modal>

      <ConfirmationDialog />
    </div>
  );
}

export default Team;
