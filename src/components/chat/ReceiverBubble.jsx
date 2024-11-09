import React from "react";
import { formatDistanceToNowStrict } from "date-fns";

const ReceiverBubble = ({ chat, image }) => {
  return (
    <div className="flex">
      <div>
        {chat.hasImage ? (
          <img
            src={image}
            alt=""
            className="h-10 w-10 object-cover rounded-full ml-3"
          />
        ) : (
          <img
            src="/images/user-placeholder.png"
            alt=""
            className="h-10 w-10 object-cover rounded-full ml-3"
          />
        )}
      </div>
      <div>
        <div className=" p-4 w-72 bg-white shadow-lg rounded-lg">
          <div className=" text-blue-900 font-normal tracking-wider leading-5">
            {chat.message}
          </div>
        </div>
        <div className="w-[253.84px] text-slate-400 text-[10px] font-normal mt-1">
          {formatDistanceToNowStrict(new Date(chat.sentDate))}
        </div>
      </div>
    </div>
  );
};

export default ReceiverBubble;
