import { useSelector } from "react-redux";

export const useModalSelector = () => useSelector((state) => state.modal);
