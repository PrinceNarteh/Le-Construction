import { useSelector } from "react-redux";

export const useCompanySettingsSelector = () =>
  useSelector((state) => state.companySettings);
