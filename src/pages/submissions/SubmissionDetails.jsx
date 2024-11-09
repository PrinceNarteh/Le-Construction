import { Icon } from "@iconify/react";
import { format } from "libphonenumber-js";
import React from "react";
import DetailsCard from "../../components/shared/DetailsCard";
import ImageGallery from "../../components/shared/ImageGallery";

const SubmissionDetails = ({ submission, closeDetails, deleteSubmission }) => {
  return (
    <DetailsCard
      start
      openDetails={!!submission}
      heading="Submission Details"
      title={submission?.project_name}
      description={submission?.project_description}
      image={submission?.project_images[0]}
      closeDetails={closeDetails}
      actionButtons={() => (
        <button onClick={() => deleteSubmission(submission)}>
          <Icon
            icon="fluent:delete-28-regular"
            className="text-2xl cursor-pointer text-red-500"
          />
        </button>
      )}
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mt-5">
        <div className="flex-1 bg-white rounded-lg p-8">
          <ImageGallery images={submission?.project_images} />
        </div>

        <div className="flex-1 bg-white p-8 rounded-md space-y-5">
          <div>
            <h3 className="whitespace-nowrap text-primary text-[20px] font-bold">
              Task Details:
            </h3>

            <div className="flex-1 pl-4 space-y-2">
              <div className="flex">
                <h6 className="text-blue-900 font-bold w-40">Task Name:</h6>
                <p>{submission?.project_name}</p>
              </div>

              <div className="flex">
                <h6 className="text-blue-900 font-bold w-40">
                  Task Description:
                </h6>
                <p>{submission?.project_description}</p>
              </div>

              <div className="flex">
                <h6 className="text-blue-900 font-bold w-40">Task Budget:</h6>
                <p>{submission?.budget}</p>
              </div>

              <div className="flex">
                <h6 className="text-blue-900 font-bold w-40">Task Status:</h6>
                <p>{submission?.approved ? "Approved" : "Not Approved"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="whitespace-nowrap text-primary text-[20px] font-bold">
              Client Details:
            </h3>
            <div className="flex-1 pl-4 space-y-2">
              <div className="flex">
                <h6 className="text-blue-900 font-bold w-40">Name:</h6>
                <p>
                  {submission?.client.first_name} {submission?.client.last_name}
                </p>
              </div>

              <div className="flex">
                <h6 className="text-blue-900 font-bold w-40">Email:</h6>
                <p>{submission?.client.email}</p>
              </div>

              <div className="flex">
                <h6 className="text-blue-900 font-bold w-40">Contact:</h6>
                <p>
                  {submission
                    ? format(submission?.client.phone, "INTERNATIONAL")
                    : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DetailsCard>
  );
};

export default SubmissionDetails;
