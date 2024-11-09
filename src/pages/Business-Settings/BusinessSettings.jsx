import { Icon } from "@iconify/react";
import React from "react";
import BrandingSettingsForm from "../../components/forms/businesssettings/BrandingSettingsForm";
import CompanyAddressForm from "../../components/forms/businesssettings/CompanyAddressForm";
import CompanyInformationForm from "../../components/forms/businesssettings/CompanyInformationForm";
import Heading from "../../components/layout/Heading";

function BusinessSettings() {
  return (
    <div className="space-y-20 px-7">
      <div>
        <div className="ml-7 mb-5 flex items-center">
          <Icon icon="ooui:user-avatar" className="h-7 w-7" />
          <Heading label="Company Information" />
        </div>

        <CompanyInformationForm />
      </div>

      <div>
        <div className="ml-7 mt-5 mb-5 flex gap-2 items-center">
          <Icon icon="mdi:map-marker-radius" className="h-8 w-8" />
          <Heading label="Company Address" />
        </div>

        <CompanyAddressForm />
        {/* <GeneralSettingsForm /> */}
      </div>

      <div>
        <div className="ml-7 mt-5 flex items-center">
          <Icon icon="mdi:invert-colours" className="h-10 w-10" />
          <Heading label="Branding Settings" />
        </div>

        <BrandingSettingsForm />
      </div>
    </div>
  );
}

export default BusinessSettings;
