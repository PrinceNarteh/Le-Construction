import { useDispatch } from "react-redux";
import { setCompany } from "../app/feature/company/companySlice";

export const useSetCompany = () => {
  const dispatch = useDispatch();

  return (data) => {
    dispatch(setCompany(data));
  };
};
