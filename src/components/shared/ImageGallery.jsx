import React, { useState } from "react";
import "@google/model-viewer/dist/model-viewer";

const ImageGallery = ({ images = [] }) => {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="rounded-xl h-64 w-full overflow-hidden bg-black/50">
        {images[active]?.endsWith(".glb") ? (
          <div className="h-full">
            <model-viewer
              src={images[active]}
              alt=""
              shadow-intensity="1"
              camera-controls
              auto-rotate
              ar
              style={{ width: "100%", height: "100%" }}
              camera-orbit="0deg 90deg 0deg 8.37364m"
              ar-modes="webxr scene-viewer quick-look"
              autoplay
              interaction-prompt-threshold="0"
              exposure="1.0"
              seamless-poster
              environment-image="neutral"
              id="first"
            ></model-viewer>
          </div>
        ) : (
          <img
            src={images[active]}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="overflow-x-scroll">
        <div className="flex">
          {images.map((img, i) => {
            const extension = img.split(".").pop();

            return (
              <div
                key={i}
                className="shrink-0 ml-[6px] w-32 mr-1 flex justify-center rounded-xl mt-4 cursor-pointer"
              >
                {extension === "glb" ? (
                  <div className="h-20 w-full rounded-lg object-cover bg-black/50">
                    <model-viewer
                      src={img}
                      alt=""
                      shadow-intensity="1"
                      camera-controls
                      auto-rotate
                      ar
                      style={{ width: "100%", height: "100%" }}
                      camera-orbit="0deg 90deg 0deg 8.37364m"
                      ar-modes="webxr scene-viewer quick-look"
                      autoplay
                      interaction-prompt-threshold="0"
                      exposure="1.0"
                      seamless-poster
                      environment-image="neutral"
                      id={`model-viewer-${i}`}
                    ></model-viewer>
                  </div>
                ) : (
                  <img
                    className={`h-20 w-full rounded-lg object-cover`}
                    src={img}
                    alt=""
                    onClick={() => setActive(i)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
