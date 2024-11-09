import { useSelector } from "react-redux";

export const useCompanySelector = () => useSelector((state) => state.company);
