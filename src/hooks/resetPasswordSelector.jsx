import { useSelector } from "react-redux";

export const useResetPasswordSelector = () =>
  useSelector((state) => state.resetPassword);
