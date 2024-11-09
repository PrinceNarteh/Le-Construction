import { useSelector } from "react-redux";

export const useLoadingBarSelector = () =>
  useSelector((state) => state.loadingBar);
