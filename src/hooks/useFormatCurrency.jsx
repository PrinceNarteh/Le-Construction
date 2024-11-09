import { formatValue } from "react-currency-input-field";
import { useUserSelector } from "./useUserSelector";
import { default as CurrencyInputField } from "react-currency-input-field";
import { useState } from "react";
//import { useCompanySettingsSelector } from "./useCompanySettings";

const useFormatCurrency = () => {
  const { user } = useUserSelector();
  //const { companySettings } = useCompanySettingsSelector();

  //console.log(user, companySettings);
  const formatCurrency = (value) =>
    formatValue({
      value: `${value}`,
      prefix: `${user.company.company_settings?.currency?.symbol}`,
    });

  const CurrencyInput = ({
    label,
    errors,
    name,
    required = true,
    setValue,
  }) => {
    const [amt, setAmt] = useState(0);

    return (
      <div className="flex-1">
        {label && (
          <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
            {label}{" "}
            {!required && (
              <span className="text-slate-300 text-md">(Optional)</span>
            )}
          </label>
        )}
        <CurrencyInputField
          name={name}
          value={amt}
          prefix={user.company.company_settings?.currency?.symbol}
          onValueChange={(value) => {
            if (value === undefined) {
              setValue(name, "");
              setAmt("");
            } else {
              setValue(name, value);
              setAmt(value);
            }
          }}
          className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-400 shadow-md rounded-md py-3 pl-9 pr-3 sm:text-sm"
        />
        {errors[name] && (
          <span className="text-red-500 text-[12px]">
            {errors[name].message}
          </span>
        )}
      </div>
    );
  };

  return { formatCurrency, CurrencyInput };
};

export default useFormatCurrency;
