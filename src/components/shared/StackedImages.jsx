import React from "react";

const images = [
  "/images/build.jpg",
  "/images/build1.jpg",
  "/images/build2.jpg",
  "/images/builder.jpg",
  "/images/builder2.jpg",
  "/images/builder11.jpg",
  "/images/builder11.jpg",
  "/images/builder11.jpg",
  "/images/builder11.jpg",
];

const StackedImages = () => {
  return (
    <div className="relative w-40">
      {images.slice(0, 5).map((image, idx) => (
        <img
          key={idx}
          src={image}
          className="absolute w-8 h-8 rounded-full ring-1 ring-primary"
          style={{ left: `${idx * 15}px` }}
        />
      ))}
      {images.length > 5 && (
        <div
          className="absolute w-8 h-8 right-1 font-poppins text-xs rounded-full flex justify-center items-center bg-primary text-white"
          style={{ left: "75px" }}
        >
          +{images.length - 5}
        </div>
      )}
    </div>
  );
};

export default StackedImages;
