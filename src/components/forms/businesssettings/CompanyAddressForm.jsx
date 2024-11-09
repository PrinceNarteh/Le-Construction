import React from "react";
import { useUserSelector } from "../../../hooks/useUserSelector";
import { useForm } from "react-hook-form";
import { useState } from "react";
import GoogleMaps from "../../shared/GoogleMaps";
import InputField from "../../shared/InputField";
import CustomSelect from "../../shared/CustomSelect";
import useCountries from "../../../hooks/useCountries";

function CompanyAddressForm() {
  const { user } = useUserSelector();
  const [country, setCountry] = useState(
    user.company?.address.country ?? ""
  );
  const [selectedLocation, setSelectedLocation] = useState({
    street: user ? user.company.address?.street : "",
    city: user ? user.company.address?.city : "",
    state: user ? user.company.address?.state : "",
    zip: user ? user.company.address?.zip : "",
    country: user ? user.company.address?.country : "",
    lat: user ? user.company.address?.lat : 0,
    lng: user ? user.company.address?.long : 0,
  });

  const {
    setValue,
    register,
    formState: { errors },
    clearErrors,
    handleSubmit,
  } = useForm({
    defaultValues: {},
  });

  // Get Countries
  const { countries } = useCountries({
    setValue,
    clearErrors,
    fieldName: "country",
    fieldValue: country,
  });

  return (
    <form>
      <div className="bg-white w-full rounded-xl px-10 py-5">
        <div className="space-y-2">
          <div className="form-row">
            <InputField
              name="street"
              label="Street"
              register={register}
              errors={errors}
              value={selectedLocation.street}
              required
            />
            <InputField
              name="city"
              label="City"
              register={register}
              errors={errors}
              value={selectedLocation.city}
              required
            />
            <InputField
              name="state"
              label="State"
              register={register}
              errors={errors}
              value={selectedLocation.state}
              required
            />
          </div>
          <div className="form-row">
            <InputField
              name="zip"
              label="Zip"
              register={register}
              errors={errors}
              value={selectedLocation.zip}
              required
            />
            <div className="flex-1">
              <CustomSelect
                data={countries}
                label="Country"
                placeholder="Select country..."
                onChange={setCountry}
                initialValue={country}
              />
              {errors["country"] && (
                <span className="text-red-500 text-[12px]">
                  {errors["country"].message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <GoogleMaps
            lat={user.company.address.lat}
            lng={user.company.address.long}
            onLocationChange={(location) => {
              setSelectedLocation(location);
            }}
          />
        </div>

        <div className="flex gap-5 justify-end">
          <div className="w-48 mt-5 h-12 py-5 bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex">
            <button className="text-white text-md font-bold leading-loose">
              Save
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CompanyAddressForm;
