import React from "react";
import ReactPlayer from "react-player";
import Modal from "./Modal";

const VideoPlayer = ({ url, openModal, closeModal }) => {
  return (
    <Modal openModal={openModal} closeModal={closeModal} width="max-w-4xl">
      <div>
        <ReactPlayer url={url} controls width="100%" height="100%" />
      </div>
    </Modal>
  );
};

export default VideoPlayer;
