import React from "react";
import SettingsPage from "../../components/settingspage/SettingsPage";
import Heading from "../../components/layout/Heading";

function Settings() {
  return (
    <div>
      <div className="pl-7 pr-7">
      <div className="mt-5 mb-5">
         <Heading label="Settings" />
      </div>
        <SettingsPage />
      </div>
    </div>
  );
}

export default Settings;
