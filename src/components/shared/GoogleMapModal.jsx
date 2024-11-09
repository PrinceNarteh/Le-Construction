import {
  Autocomplete,
  GoogleMap,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useMemo } from "react";
import Spinner from "../Spinner";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

const GoogleMapModal = ({ open, setOpen, setValue }) => {
  const [center, setCenter] = useState({ lat: 5.11373, lng: -1.26408 });
  const coordCenter = useMemo(() => center, [center]);
  const searchRef = useRef();
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDhxiV3IiFr2KzXokhStpsfmD-E3Kw-7Zk",
    libraries: ["places"],
  });

  useEffect(() => {
    setValue("lat", center.lat);
    setValue("long", center.lng);
  }, [center]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) =>
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    );
  }, []);

  if (!isLoaded) return <Spinner isSubmitting={isLoaded} />;

  if (open) {
    return (
      <div>
        <div className="fixed inset-0 mt-14 ml-60 h-[calc(100vh_-_56px)] w-[calc(100vw_-_240px)]  bg-neutral-700/30 pt-40 z-50">
          <div className="max-w-[1000px] w-full h-5/6 bg-white absolute right-1/2 bottom-1/2  transform translate-x-1/2 translate-y-1/2 border-4 border-gray-400 rounded">
            <div className="relative flex justify-center">
              <AiOutlineCloseCircle
                onClick={() => setOpen(false)}
                className="absolute -right-4 -top-4 z-10 cursor-pointer rounded-full bg-white text-4xl from-primary to-secondary"
              />
              <div className="z-10 w-80 mx-auto py-2 px-3 bg-white absolute top-2 flex items-center gap-3 rounded">
                <label className="block font-bold">Search</label>
                <Autocomplete on className="w-full">
                  <input
                    type="text"
                    className="border border-gray-400 text-sm p-1 pl-3 outline-none rounded-full w-full"
                    ref={searchRef}
                  />
                </Autocomplete>
              </div>
            </div>
            <GoogleMap
              center={coordCenter}
              zoom={15}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              onClick={(e) => {
                setCenter({ lat: e.latLng.lat(), lng: e.latLng.lng() });
              }}
              on
            >
              <MarkerF position={coordCenter} animation="" />
            </GoogleMap>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default GoogleMapModal;
