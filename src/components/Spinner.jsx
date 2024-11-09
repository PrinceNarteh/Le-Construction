import React from "react";
import "../components/spinner.css";

function Spinner({ isSubmitting }) {
  if (isSubmitting) {
    return (
      <div className="fixed top-0 right-0 bottom-0 left-60 bg-neutral-700/30 z-50 flex justify-center items-center">
        <div className="loader">
          <div className="box1"></div>
          <div className="box2"></div>
          <div className="box3"></div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export function FullPageSpinner({ isSubmitting }) {
  if (isSubmitting) {
    return (
      <div className="fixed inset-0 bg-neutral-700/30 z-50 flex justify-center items-center">
        <div className="loader">
          <div className="box1"></div>
          <div className="box2"></div>
          <div className="box3"></div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default Spinner;
