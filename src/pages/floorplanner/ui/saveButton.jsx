import React, { useContext } from "react";
import PropTypes from "prop-types";
import { FaSave as IconSave } from "react-icons/fa";
import * as Three from "three";
import Dropdown from "rc-dropdown";
import Menu, { Item as MenuItem } from "rc-menu";
import {
  ReactPlannerContext,
  ReactPlannerConstants,
  ReactPlannerComponents,
} from "cc-floor-plan";
import { Project } from "cc-floor-plan/src/class/export";
import { browserDownload } from "cc-floor-plan/src/utils/browser";
import { parseData } from "cc-floor-plan/src/components/viewer3d/scene-creator";
import { OBJExporter } from "cc-floor-plan/src/components/toolbar/OBJExporter";

const { ToolbarButton } = ReactPlannerComponents.ToolbarComponents;
export default function SaveButton({ state }) {
  const context = useContext(ReactPlannerContext);
  const { translator, catalog } = context;

  const saveProjectToJSONFile = () => {
    state = Project.unselectAll(state).updatedState;
    browserDownload(JSON.stringify(state.get("scene").toJS()), "json");
  };

  const saveProjectToObjFile = () => {
    const objExporter = new OBJExporter();
    state = Project.unselectAll(state).updatedState;
    const actions = {
      areaActions: context.areaActions,
      holesActions: context.holesActions,
      itemsActions: context.itemsActions,
      linesActions: context.linesActions,
      projectActions: context.projectActions,
    };
    const scene = state.get("scene");
    let planData = parseData(scene, actions, catalog);
    setTimeout(() => {
      const plan = planData.plan;
      plan.position.set(plan.position.x, 0.1, plan.position.z);
      const scene3D = new Three.Scene();
      scene3D.add(planData.plan);
      browserDownload(objExporter.parse(scene3D), "obj");
    });
  };

  const menu = (
    <Menu style={{ width: 140 }}>
      <MenuItem key="1" onClick={saveProjectToJSONFile}>
        Save As JSON
      </MenuItem>
      <MenuItem key="2" onClick={saveProjectToObjFile}>
        Save As OBJ
      </MenuItem>
    </Menu>
  );

  return (
    <Dropdown
      trigger={["click"]}
      overlay={menu}
      animation="slide-up"
      placement="topLeft"
    >
      <ToolbarButton active={false} tooltip={translator.t("Save project")}>
        <IconSave onClick={saveProjectToObjFile} />
      </ToolbarButton>
    </Dropdown>
  );
}

SaveButton.propTypes = {
  state: PropTypes.object.isRequired,
};
