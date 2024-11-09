import React from 'react';

function TimeAgo({ timestamp }) {
  const timeAgo = (timestamp) => {
    const currentDate = new Date();
    const messageDate = new Date(timestamp);
    const timeDifference = currentDate - messageDate;

    const seconds = Math.floor(timeDifference / 1000);
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }

    const minutes = Math.floor(timeDifference / 1000 / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }

    const hours = Math.floor(timeDifference / 1000 / 60 / 60);
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }

    const days = Math.floor(timeDifference / 1000 / 60 / 60 / 24);
    if (days < 7) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }

    return messageDate.toLocaleString(); // fallback to full date format
  };

  return <div className="w-[253.84px] text-slate-400 text-[10px] font-normal mt-1">{timeAgo(timestamp)}</div>;
}

export default TimeAgo;
