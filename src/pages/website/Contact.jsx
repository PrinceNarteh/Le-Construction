import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { format } from "libphonenumber-js";
import ContactForm from "../../components/forms/website/ContactForm";
import Modal from "../../components/shared/Modal";
import { useCompanySelector } from "../../hooks/useCompanySelector";
import { useWebsiteSelector } from "../../hooks/useWebsiteSelector";

function Contact() {
  const { company } = useCompanySelector();
  const [openModal, setOpenModal] = useState(false);
  const { website } = useWebsiteSelector();

  return (
    <div>
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-semibold text-blue-900 text-3xl">Contact</h3>
          <button
            onClick={() => setOpenModal(true)}
            className="bg-primary flex justify-center items-center text-white w-44 py-3 px-5 rounded-md text-xs font-bold"
          >
            <Icon icon="iconamoon:edit-light" className="mr-2" />
            Edit
          </button>
        </div>
        <div className="bg-white rounded-lg p-10">
          <div>
            <div className="flex py-3">
              <div className="flex-[2] text-blue-900 text-[15px] font-bold leading-snug capitalize">
                Email (Primary)
              </div>
              <div className="flex-[3]">{website?.contact_email_1}</div>
            </div>
            <div className="flex py-3">
              <div className="flex-[2] text-blue-900 text-[15px] font-bold leading-snug capitalize">
                Email (Secondary)
              </div>
              <div className="flex-[3]">{website?.contact_email_2}</div>
            </div>
            <div className="flex py-3">
              <div className="flex-[2] text-blue-900 text-[15px] font-bold leading-snug capitalize">
                Phone Number (Primary)
              </div>
              <div className="flex-[3]">
                {website?.contact_phone_1 &&
                  format(website?.contact_phone_1, "INTERNATIONAL")}
              </div>
            </div>
            <div className="flex py-3">
              <div className="flex-[2] text-blue-900 text-[15px] font-bold leading-snug capitalize">
                Phone Number (Secondary)
              </div>
              <div className="flex-[3]">{website?.contact_phone_2}</div>
            </div>
            <div className="flex py-3">
              <div className="flex-[2] text-blue-900 text-[15px] font-bold leading-snug capitalize">
                Address
              </div>
              <div className="flex-[3]">{website?.company_address}</div>
            </div>
          </div>
        </div>
      </div>

      <Modal openModal={openModal} closeModal={setOpenModal}>
        <ContactForm setOpenModal={setOpenModal} />
      </Modal>
    </div>
  );
}

export default Contact;
