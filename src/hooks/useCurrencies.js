import { useEffect } from "react";
import { queryKeys } from "../constants";
import { useGetQuery } from "./useGetQuery";

const useCurrencies = ({
  setValue,
  clearErrors,
  fieldValue,
  fieldName,
  idField = "_id",
}) => {
  const { data, isLoading } = useGetQuery({
    queryKey: [queryKeys.Currencies],
    url: "/currencies",
  });

  const currencies = data?.map((currency) => ({
    id: currency[idField],
    label: currency.name,
  }));

  useEffect(() => {
    if (fieldValue) {
      setValue(fieldName, fieldValue);
      clearErrors(fieldName);
    }
  }, [fieldName, fieldValue, setValue, clearErrors]);

  return {
    currencies,
    isLoading,
  };
};

export default useCurrencies;
