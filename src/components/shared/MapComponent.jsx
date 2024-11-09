import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import io from "socket.io-client";
import Spinner from "../../components/Spinner";
import ActiveContractorsSidebar from "../../components/shared/ActiveContractorsSidebar";
import { queryKeys } from "../../constants";
import usePostQuery from "../../hooks/usePostQuery";
import { useUserSelector } from "../../hooks/useUserSelector";
//use env variables

const containerStyle = {
  width: "100%",
  height: "330px",
};

const MAP_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const URL = process.env.REACT_APP_BASE_URL_ADMIN;

const mapLoaderOptions = {
  id: "google-map-script1",
  googleMapsApiKey: MAP_KEY,
  version: "weekly",
  libraries: ["places"],
};

function MapComponent({ height }) {
  const { isLoaded } = useJsApiLoader(mapLoaderOptions);
  const [mapRef, setMapRef] = useState();
  const [isOpenActive, setIsOpenActive] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [taskMarkers, setTaskMarkers] = useState([]);
  const [geofenceCircles, setGeofenceCircles] = useState([]);
  const [isGeofenceSet, setGeofence] = useState(false);

  const [isConnected, setIsConnected] = useState(false);
  const [builderData, setBuilderData] = useState({
    company_id: "",
    builder_id: "",
    builder_lat: "",
    builder_long: "",
  });

  const [activities, setActivities] = useState([]);
  const [zoom, setZoom] = useState(16);
  const { user } = useUserSelector();
  const { data: active_tasks, isLoading } = usePostQuery({
    queryKey: [queryKeys.ActiveTask],
    url: "/task/active",
    data: {
      company_id: user._id,
    },
  });

  //http://localhost:4242
  useEffect(() => {
    const socket = io(URL, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      setIsConnected(true);

      socket.emit("joinRoom", user._id, user._id).listeners((eventNames) => {
        console.log("eventNames", eventNames);
      });

      socket.on(
        "updateAddress",
        (company_id, builder_id, builder_lat, builder_long, activity) => {
          const marker_data = {
            address: "Ghana, Greater Accra, Dome",
            lat: builder_lat,
            lng: builder_long,
          };
          setMarkers([marker_data]);
          setBuilderData({
            company_id,
            builder_id,
            builder_lat,
            builder_long,
          });
        }
      );
    });

    socket.emit("change", user._id);
    //listen to changes
    socket.on("change", (data) => {
      console.log("database change", data);
      const index = activities.findIndex(
        (activity) => activity._id === data._id
      );
      if (index > -1) {
        activities.splice(index, 1);
      }
      setActivities([data, ...activities]);
    });

    return () => {
      socket.disconnect();
    };
  }, [activities, user._id]);

  useEffect(() => {
    if (!isLoading && active_tasks) {
      const taskMarkers = active_tasks.message.map(function (task) {
        return {
          address: task.address,
          lat: task.address.lat,
          lng: task.address.long,
        };
      });
      setTaskMarkers(taskMarkers);
    } else {
      setTaskMarkers([
        {
          address: "Ghana, Greater Accra, Dome",
          lat: 5.499393,
          lng: -0.442418,
        },
      ]);
    }
  }, [isLoading, active_tasks]);

  const onLoad = (map) => {
    setMapRef(map);
  };

  useEffect(() => {
    if (mapRef && (markers.length > 0 || taskMarkers.length > 0)) {
      const allMarkers = [...markers, ...taskMarkers];
      const bounds = new window.google.maps.LatLngBounds();

      allMarkers.forEach(({ lat, lng }) =>
        bounds.extend(new window.google.maps.LatLng(lat, lng))
      );

      mapRef.fitBounds(bounds);

      const centerLatLng = {
        lat:
          allMarkers.reduce((sum, marker) => sum + Number(marker.lat), 0) /
          allMarkers.length,
        lng:
          allMarkers.reduce((sum, marker) => sum + Number(marker.lng), 0) /
          allMarkers.length,
      };
      console.log(
        "centerLatLng",
        typeof centerLatLng.lat,
        typeof centerLatLng.lng
      );

      mapRef.setZoom(zoom);
      mapRef.setCenter(centerLatLng);
    } else {
    }
  }, [mapRef, markers, taskMarkers, zoom]);

  useEffect(() => {
    if (!isLoading && active_tasks && markers.length > 0) {
      const taskMarkers = active_tasks.message.map(function (task) {
        const taskLatLng = new window.google.maps.LatLng(
          Number(task.address.lat),
          Number(task.address.long)
        );

        console.log("markers", markers);
        // Calculate the distance between the taskMarker and the builderMarker
        const distance =
          window.google.maps.geometry.spherical.computeDistanceBetween(
            taskLatLng,
            new window.google.maps.LatLng(
              Number(markers[0].lat),
              Number(markers[0].lng)
            )
          );

        const geofenceRadius = (distance / 5) * zoom;
        console.log("geofenceRadius", geofenceRadius);
        const isWithinRadius = distance <= 100;
        console.log("isWithinRadius", isWithinRadius);

        if (!isGeofenceSet) {
          const geofenceCircle = new window.google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: isWithinRadius
              ? "rgba(255, 0, 0, 0.35)"
              : "rgba(0, 0, 0, 0.35)",
            fillOpacity: 0.35,
            map: mapRef,
            center: taskLatLng,
            radius: geofenceRadius,
          });

          task.isGeofenceSet = true; // Mark the task with a geofence set
          setGeofence(true);
          setGeofenceCircles([geofenceCircle]);
        }

        //check if task is within geofence show toast
        if (isWithinRadius) {
          toast.success("Work in progress");
        } else {
          toast.error("Jobs not started");
        }

        return {
          address: task.address,
          lat: task.address.lat,
          lng: task.address.long,
          geofenceRadius,
          isWithinRadius,
        };
      });
      setTaskMarkers(taskMarkers);
      setZoom(16);
    } else {
      // show info toast
      //toast.error("No active tasks");
    }
  }, [isLoading, active_tasks, markers, mapRef, isGeofenceSet, zoom]);

  const handleZoomChanged = () => {
    if (mapRef) {
      setZoom(mapRef.getZoom());
    }
  };

  // console.log(taskMarkers);

  return isLoaded ? (
    <div className={`grid grid-cols-3`}>
      <div className={`${isOpenActive ? " col-span-2" : "col-span-3"}`}>
        <GoogleMap
          mapTypeId="satellite"
          mapContainerStyle={containerStyle}
          onLoad={onLoad}
          zoom={zoom}
          onZoomChanged={handleZoomChanged}
        >
          <div
            className="text-4xl absolute mt-2 ml-[72rem] cursor-pointer"
            onClick={() => {
              setIsOpenActive(true);
            }}
          >
            <img
              src="/images/menu.png"
              alt=""
              className=" rounded-lg h-12 w-12 object-cover"
            />
          </div>
          {markers.map(({ address, lat, lng }, ind) => (
            <React.Fragment key={ind}>
              <Marker
                position={{ lat, lng }}
                onClick={() => {
                  //handleMarkerClick(ind, lat, lng, address);
                }}
                icon={{
                  url: "/images/worker.png",
                  scaledSize: new window.google.maps.Size(80, 80),
                }}
              />
            </React.Fragment>
          ))}
          {taskMarkers.map(
            ({ address, lat, lng, geofenceRadius, isWithinRadius }, ind) => {
              const geofenceCenter = { lat, lng };
              //const geofenceRadius = 100;

              return (
                <React.Fragment key={ind}>
                  <Marker
                    position={geofenceCenter}
                    onClick={() => {
                      //handleMarkerClick(ind, lat, lng, address);
                    }}
                    icon={{
                      url: "/public/images/builderhat.jpg",
                      scaledSize: new window.google.maps.Size(40, 40),
                    }}
                  />
                </React.Fragment>
              );
            }
          )}
        </GoogleMap>
      </div>
      <div>
        <ActiveContractorsSidebar
          isOpenActive={isOpenActive}
          setIsOpenActive={setIsOpenActive}
          activities={activities}
        />
      </div>
    </div>
  ) : (
    <Spinner />
  );
}

export default MapComponent;
