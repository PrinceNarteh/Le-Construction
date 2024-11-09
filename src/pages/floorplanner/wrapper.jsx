import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

import Immutable, { Map } from "immutable";
import immutableDevtools from "immutable-devtools";
import { createStore } from "redux";
import { Provider } from "react-redux";

import MyCatalog from "./catalog/mycatalog";

import ScreenshotToolbarButton from "./ui/screenshot-toolbar-button";

// import "react-planner/styles/react-planner.css"

import {
  Models as PlannerModels,
  reducer as PlannerReducer,
  Plugins as PlannerPlugins,
  ReactPlanner,
} from "cc-floor-plan";
import { Link } from "react-router-dom";

let isProduction = true;

// Define state
let AppState = Map({
  "react-planner": new PlannerModels.State(),
});

// Define reducer
let reducer = (state, action) => {
  state = state || AppState;
  state = state.update("react-planner", (plannerState) =>
    PlannerReducer(plannerState, action)
  );
  return state;
};

let blackList =
  isProduction === true
    ? []
    : ["UPDATE_MOUSE_COORDS", "UPDATE_ZOOM_SCALE", "UPDATE_2D_CAMERA"];

if (!isProduction) {
  console.info(
    "Environment is in development and these actions will be blacklisted",
    blackList
  );
  console.info("Enable Chrome custom formatter for Immutable pretty print");
  immutableDevtools(Immutable);
}

// Init store
let store = createStore(
  reducer,
  null,
  !isProduction && window.devToolsExtension
    ? window.devToolsExtension({
        features: {
          pause: true,
          lock: true,
          persist: true,
          export: true,
          import: "custom",
          jump: true,
          skip: true,
          reorder: true,
          dispatch: true,
          test: true,
        },
        actionsBlacklist: blackList,
        maxAge: 999999,
      })
    : (f) => f
);

let plugins = [
  PlannerPlugins.Keyboard(),
  PlannerPlugins.Autosave("react-planner_v0"),
  PlannerPlugins.ConsoleDebugger(),
];

let toolbarButtons = [ScreenshotToolbarButton];

const Wrapper = () => {
  const parentRef = useRef();
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();

  useEffect(() => {
    setWidth(parentRef.current.offsetWidth);
    setHeight(parentRef.current.offsetHeight);
  }, []);

  return (
    <div>
      <Link
        to="/arboard/floor-plan"
        className="bg-white h-10 flex justify-center items-center font-ray font-semibold ml-3"
      >
        <Icon icon="clarity:home-solid" className="mr-1 h-5 w-5  " />
        <div className="mt-1"> Return to Home </div>
      </Link>
      <Provider store={store}>
        <div style={{ width: 2000, height: 1000 }} ref={parentRef}>
          {width && height && (
            <ReactPlanner
              store={store}
              catalog={MyCatalog}
              width={width}
              height={height}
              plugins={plugins}
              toolbarButtons={toolbarButtons}
              stateExtractor={(state) => state.get("react-planner")}
            />
          )}
        </div>
      </Provider>
    </div>
  );
};

export default Wrapper;
