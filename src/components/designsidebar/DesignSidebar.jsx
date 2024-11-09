import React from "react";
import { Link } from "react-router-dom";

function DesignSidebar() {
  return (
    <div className="overflow-y-scroll h-screen fixed">
      <div className="w-36 pl-3 h-screen">
        <div className="ml-6 space-y-8 pt-20">
          <div className="">
            <Link
              to="/arboard/floor-plan"
              className="shadow-xl h-20 w-20 pb-2 pt-10"
            >
              <img
                src="/images/floor.webp"
                alt=""
                className="h-16 w-16 object-cover rounded-lg shadow-xl"
              />
              <div className="font-bold text-sm w-20 text-blue-900 flex justify-start mt-2">
                Floor Plan
              </div>
            </Link>
          </div>

          {/* <div>
            <Link
              to="/arboard/visualization"
              className="shadow-xl h-20 w-20 pb-2"
            >
              <img
                src="/images/house.jpg"
                alt=""
                className="h-16 w-16 object-cover rounded-lg shadow-xl"
              />
              <div className="font-bold text-sm w-20 text-blue-900 flex justify-center mt-2">
                Visualization
              </div>
            </Link>
          </div> */}

          <div>
            <Link to="/arboard/notes" className="shadow-xl h-20 w-20 pb-2">
              <img
                src="/images/note.webp"
                alt=""
                className="h-16 w-16 object-cover rounded-lg shadow-xl"
              />
              <div className="font-bold w-16 text-sm text-blue-900 flex justify-center mt-2">
                Notes
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignSidebar;
