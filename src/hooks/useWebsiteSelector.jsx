import { useSelector } from "react-redux";

export const useWebsiteSelector = () => useSelector((state) => state.website);
