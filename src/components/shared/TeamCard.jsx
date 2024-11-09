import { Icon } from "@iconify/react";
import React from "react";

const TeamCard = ({ member, handleDelete }) => {
  return (
    <div className="relative group bg-white overflow-hidden w-64 px-8 py-8 flex flex-col items-center rounded-md">
      <button
        onClick={() => handleDelete(member)}
        className="translate-x-20 flex justify-center items-center group-hover:translate-x-0 h-10 w-12 border border-red-500 absolute top-2 -right-1 rounded-l-full duration-500"
      >
        <Icon
          icon="fluent:delete-28-regular"
          className="h-5 w-5 text-red-500"
        />
      </button>
      <div className="w-32 h-32 rounded-full bottom-2 border-primary overflow-hidden">
        <img
          src={
            member.profile_image
              ? member.profile_image
              : "/images/user-placeholder.png"
          }
          alt=""
          className="w-32 h-32 object-cover object-center"
        />
      </div>
      <div className="h-[60px] flex items-center mb-2">
        <p className="font-semibold text-blue-900 uppercase text-center line-clamp-2">
          {member.name}
        </p>
      </div>
      <p className="font-semibold text-blue-900 uppercase text-center line-clamp-2">
          {member.designation}
        </p>
      <div className="flex items-center justify-center gap-5 w-full">
        {member?.facebook_link && (
          <a href={member?.facebook_link} target="_blank" rel="noreferrer">
            <Icon
              icon="ph:facebook-logo"
              fontSize={22}
              className="cursor-pointer hover:text-primary duration-300"
            />
          </a>
        )}
        {member?.instagram_link && (
          <a href={member?.instagram_link} target="_blank" rel="noreferrer">
            <Icon
              icon="ph:instagram-logo"
              fontSize={22}
              className="cursor-pointer hover:text-primary duration-300"
            />
          </a>
        )}
        {member?.linkedin_link && (
          <a href={member?.linkedin_link} target="_blank" rel="noreferrer">
            <Icon
              icon="ph:linkedin-logo"
              fontSize={22}
              className="cursor-pointer hover:text-primary duration-300"
            />
          </a>
        )}
        {member?.twitter_link && (
          <a href={member?.twitter_link} target="_blank" rel="noreferrer">
            <Icon
              icon="ph:twitter-logo"
              fontSize={22}
              className="cursor-pointer"
            />
          </a>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
