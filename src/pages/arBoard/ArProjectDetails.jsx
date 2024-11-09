import "@google/model-viewer/dist/model-viewer";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { queryKeys } from "../../constants/queryKeys";
import { useGetQuery } from "../../hooks/useGetQuery";
import TaskDetails from "../tasks/TaskDetails";
import Modal from "../../components/shared/Modal";
import { Icon } from "@iconify/react";
import textureImage from '../../assets/wallTexture.jpg';

const UsdzFileLoader = () => {
  const [fullView, setFullView] = useState(false);
  const { arProjectId } = useParams();
  const [task, setTask] = useState(null);
  const [view2D, setView2D] = useState(false);
  const [openTask, setOpenTask] = useState(false);

  const modelViewerRef = useRef(null);

  const { data, isLoading } = useGetQuery({
    queryKey: [queryKeys.Projects, arProjectId],
    url: `/project/${arProjectId}`,
  });

  const project = data?.message ?? {};

  useEffect(() => {
    const modelViewer = modelViewerRef.current;

    const handleModelLoad = async () => {
      try {
        if (modelViewer && modelViewer.model) {
          const material = modelViewer.model.materials[0];

          // Define the texture URL
          const textureUrl = textureImage;

          // Create and apply the texture
          const texture = await modelViewer.createTexture(textureUrl);
          if (!texture) {
            throw new Error("Failed to create texture");
          }

          // Set the texture name
          texture.name = "damaged_helmet";

          // Apply the new texture to the normalTexture channel
          material.normalTexture.setTexture(texture);

          // Log the material and texture to verify
          console.log("Material: ", material);
          console.log("Texture: ", texture);

        } else {
          console.error("Model or model materials not found.");
        }
      } catch (error) {
        console.error("Error loading or applying the texture:", error);
      }
    };

    if (modelViewer) {
      modelViewer.addEventListener("load", handleModelLoad);

      modelViewer.addEventListener("error", (event) => {
        console.error("Model viewer error event:", event);
      });

      // Cleanup event listener on component unmount
      return () => {
        modelViewer.removeEventListener("load", handleModelLoad);
      };
    }
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh_-_100px)] bg-black/50">
      {isLoading && <Spinner isSubmitting={isLoading} />}

      <button
        onClick={() => setView2D(true)}
        className="absolute rounded z-10 flex items-center top-2 right-2 bg-primary p-2"
      >
        <Icon
          icon="material-symbols:eye-tracking-outline"
          className="text-white"
        />
        <span className="font-bold ml-2 text-white text-sm tracking-wider">
          View 2D
        </span>
      </button>

      <model-viewer
        ref={modelViewerRef}
        src={
          project?.project_images?.length > 0 ? project?.project_images[0] : ""
        }
        // ios-src="/images/scanned.usdz"
        alt={project?.project_name}
        shadow-intensity="1"
        camera-controls
        auto-rotate
        ar
        style={{ width: "100%", height: "100%" }}
        camera-orbit="0deg 90deg 0deg 8.37364m"
        ar-modes="webxr scene-viewer quick-look"
        autoplay
        interaction-prompt-threshold="0"
        exposure="0.2"
        seamless-poster
        environment-image="neutral"
        id="first"
      ></model-viewer>

      <div
        className={`${
          fullView
            ? "h-[calc(100vh_-_110px)] w-[23rem] bg-white"
            : "h-60 w-60 bg-white/50"
        } absolute right-5 bottom-1 z-30 rounded-md shadow-md border border-primary p-5 duration-500`}
      > 
        <div
          className={`overflow-hidden ${
            fullView ? "h-1/3" : "h-20"
          } duration-500`}
        >
          <h4 className="font-semibold text-blue-800 border-b pb-1 mb-3">
            {project?.project_name}
          </h4>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {project?.project_description}
          </p>
        </div>
        <div
          className={`overflow-hidden ${
            fullView ? "h-[calc(66.666667%_-_20px)]" : "h-[101px]"
          } duration-500`}
        >
          <h4 className="font-semibold text-blue-800 border-b pb-1 mb-3">
            Tasks
          </h4>
          <div className="space-y-2">
            {data?.message.task_objects.map((task, idx) => (
              <div
                onClick={() => {
                  setTask(task);
                  setOpenTask(true);
                }}
                key={idx}
                className="flex gap-3 cursor-pointer hover:bg-gray-200 p-1 rounded"
              >
                <img src={task.icon_thumbnail} alt="" className="w-10 h-10" />
                <div>
                  <h5 className="text-sm line-clamp-1">{task.task_name}</h5>
                  <p className="text-xs line-clamp-1">
                    {task.task_description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setFullView(!fullView)}
          className=" bottom-2 w-full py-1  border border-primary rounded-full text-sm"
        >
          {fullView ? "Hide" : "View"} Details
        </button>
      </div>

      {/* Task Details */}
      <TaskDetails
        task={task}
        projectId={project?._id}
        setTask={setTask}
        setOpenTask={setOpenTask}
      />
      {/* View in 2D and 3D */}
      <Modal openModal={view2D} closeModal={setView2D} width="max-w-5xl" start>
        <Link
          to={project?.original_pdf_file}
          download
          target="_self"
          className="flex items-center gap-2 bg-primary py-1 px-2 w-fit text-white rounded mb-2 float-right"
        >
          <Icon icon="material-symbols:cloud-download-outline" />
          <span className="text-sm">Download</span>
        </Link>
        <img src={project?.original_image_file} alt="" />
      </Modal>
    </div>
  );
};

export default UsdzFileLoader;
