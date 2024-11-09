import { useEffect, useState } from "react";
import { queryKeys } from "../constants";
import { useGetQuery } from "./useGetQuery";

const useCountries = ({
  fieldValue,
  fieldName,
  setValue,
  clearErrors,
  idField = "_id",
}) => {
  const [countries, setCountries] = useState([]);
  const { data, isLoading } = useGetQuery({
    queryKey: [queryKeys.Countries],
    url: "/countries",
  });

  useEffect(() => {
    if (data) {
      const countries = data.map((country) => ({
        id: country[idField],
        label: country.name,
      }));
      setCountries(countries);
    }
  }, [data]);

  useEffect(() => {
    if (fieldValue) {
      setValue(fieldName, fieldValue);
      clearErrors(fieldName);
    }
  }, [fieldName, fieldValue, setValue, clearErrors]);

  return {
    countries,
    isLoading,
  };
};

export default useCountries;
