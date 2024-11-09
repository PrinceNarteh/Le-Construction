import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import io from "socket.io-client";
import {
  Circle,
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
  InfoWindowF,
} from "@react-google-maps/api";
import Spinner from "../../components/Spinner";
import ActiveContractorsSidebar from "../../components/shared/ActiveContractorsSidebar";
import { queryKeys } from "../../constants";
import usePostQuery from "../../hooks/usePostQuery";
import { useUserSelector } from "../../hooks/useUserSelector";
import { useCompanySelector } from "../../hooks/useCompanySelector";

const containerStyle = {
  width: "100%",
  height: "820px",
};

function MapPage({ height }) {
  const { company } = useCompanySelector();
  const [mapRef, setMapRef] = useState();
  const [isOpenActive, setIsOpenActive] = useState(true);
  const [workerMarkers, setWorkerMarkers] = useState([]);
  const [taskMarkers, setTaskMarkers] = useState([]);
  const [geofenceCircles, setGeofenceCircles] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isToastShown, setIsToastShown] = useState(false);
  const [builderData, setBuilderData] = useState({
    company_id: "",
    builder_id: "",
    builder_lat: "",
    builder_long: "",
  });
  const [activities, setActivities] = useState([]);
  const [zoom, setZoom] = useState(15);
  const { user } = useUserSelector();
  const [mapCenter, setMapCenter] = useState({
    lat: parseFloat(company?.address.lat) || 0.0,
    lng: parseFloat(company?.address.long) || 0.0,
  });

  const [selectedMarker, setSelectedMarker] = useState(null);

  const { data: activeTasks, isLoading: activeTasksLoading } = usePostQuery({
    queryKey: [queryKeys.ActiveTask],
    url: "/task/active",
    data: {
      company_id: company._id,
    },
  });

  const { data: projects, isLoading: projectsLoading } = usePostQuery({
    queryKey: [queryKeys.ProjectsForCompany],
    url: "/projects/for/company",
  });

  const { data: worker_activities, activity_isLoading } = usePostQuery({
    queryKey: [queryKeys.Activities],
    url: "/activities",
    data: {
      status: 1,
      company_id: company._id,
    },
  });

  useEffect(() => {
    const socket = io("https://demo.api.nailed.biz", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("joinRoom", user._id, user._id);

      socket.on(
        "updateAddress",
        (company_id, builder_id, builder_lat, builder_long, activity) => {
          const markerData = {
            worker_id: builder_id,
            address: "Ghana, Greater Accra, Dome",
            lat: builder_lat,
            lng: builder_long,
          };

          setWorkerMarkers([markerData]);
          setBuilderData({
            company_id,
            builder_id,
            builder_lat,
            builder_long,
          });
        }
      );

      socket.emit("change", user._id);
      socket.on("change", (data) => {
        setActivities((prevActivities) => {
          const index = prevActivities.findIndex(
            (activity) => activity._id === data._id
          );
          if (index > -1) {
            prevActivities.splice(index, 1);
          }
          return [data, ...prevActivities];
        });
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user._id]);

  useEffect(() => {
    if (!projectsLoading && !activeTasksLoading) {
      const combinedData = [
        ...(projects?.message || []),
        ...(activeTasks?.message || []),
      ];
      const circles = combinedData.map((item) => {
        if ("project_address" in item) {
          return {
            lat: parseFloat(item.project_address.lat) || 0.0,
            lng: parseFloat(item.project_address.long) || 0.0,
            radius: 50,
          };
        } else {
          return {
            lat: parseFloat(item.address.lat) || 0.0,
            lng: parseFloat(item.address.long) || 0.0,
            radius: 50,
          };
        }
      });
      setGeofenceCircles(circles);
    }
  }, [projectsLoading, activeTasksLoading, projects?.message, activeTasks?.message]);

  const handleZoomChanged = () => {
    if (mapRef) {
      setZoom(mapRef.getZoom());
    }
  };

  const handleMapDrag = () => {
    if (mapRef) {
      const newCenter = mapRef.getCenter();
      setMapCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
    }
  };

  const handleViewDetailsClick = (lat, lng) => {
    if (mapRef) {
      setMapCenter({ lat, lng });
      setZoom(18); // Adjust zoom level as needed
    }
  };

  const handleMarkerClick = (marker, type) => {
    //console.log(marker)
    const position = type === "project" ? marker.project_address : marker.address;
    setSelectedMarker({
      position: {
        lat: parseFloat(position.lat) || 0,
        lng: parseFloat(position.long) || 0,
      },
      info: {
        name: marker.name || marker.task_name,
        description: marker.task_description || "No description available",
        workers: marker.number_of_builders,
        country: `${marker.address.country},`,
        city: `${marker.address.city},`,
        state: marker.address.state ? `${marker.address.state},` : "",
        street: marker.address.street ? `${marker.address.street},` : "",
        zip: marker.address.zip ? marker.address.zip : "",
      },
    });
  };

  return (
    <div className={`grid grid-cols-3`}>
      <div className={`${isOpenActive ? " col-span-2" : "col-span-3"}`}>
        <GoogleMap
          mapTypeId="satellite"
          mapContainerStyle={containerStyle}
          onLoad={(map) => setMapRef(map)}
          zoom={zoom}
          onZoomChanged={handleZoomChanged}
          draggable={true}
          onDragEnd={handleMapDrag}
          center={mapCenter}
        >
          {activeTasksLoading || projectsLoading || activity_isLoading ? (
            <Spinner />
          ) : (
            <>
              {/* Plotting project markers */}
              {projects &&
                projects.message.map((project, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: parseFloat(project.project_address.lat) || 0,
                      lng: parseFloat(project.project_address.long) || 0,
                    }}
                    icon={{
                      url: "/images/construction_cone.png",
                      scaledSize: new window.google.maps.Size(50, 50),
                    }}
                    onClick={() => handleMarkerClick(project, "project")}
                  />
                ))}

              {/* Plotting task markers */}
              {activeTasks &&
                activeTasks.message.map((task, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: parseFloat(task.address.lat) || 0.0,
                      lng: parseFloat(task.address.long) || 0.0,
                    }}
                    icon={{
                      url: "/images/construction_cone.png",
                      scaledSize: new window.google.maps.Size(50, 50),
                    }}
                    onClick={() => handleMarkerClick(task, "task")}
                  />
                ))}

              {workerMarkers.map((marker, index) => (
                <Marker
                  key={index}
                  position={{
                    lat: parseFloat(marker.lat) || 0,
                    lng: parseFloat(marker.lng) || 0,
                  }}
                  icon={{
                    url: "/images/worker.png",
                    scaledSize: new window.google.maps.Size(50, 50),
                  }}
                />
              ))}

              {/* Drawing geofence circles */}
              {geofenceCircles.map((circle, index) => (
                <Circle
                  key={index}
                  center={{ lat: circle.lat, lng: circle.lng }}
                  radius={circle.radius}
                  options={{
                    strokeColor: "#00FF00",
                    strokeOpacity: 0.2,
                    strokeWeight: 2,
                    fillColor: "#00FF00",
                    fillOpacity: 0.5,
                  }}
                />
              ))}

              {selectedMarker && (
                <InfoWindowF
                  position={selectedMarker.position}
                  onCloseClick={() => setSelectedMarker(null)}
                  className="bg-white shadow-lg rounded-lg p-4 max-w-xs w-full"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {selectedMarker.info.name}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {selectedMarker.info.description}
                    </p>
                    <p className="text-gray-600 mb-2">
                      Assigned Workers: {selectedMarker.info.workers}
                    </p>
                    <p className="text-gray-600 mb-2">
                      Location: {selectedMarker.info.city}{" "}
                      {selectedMarker.info.state} {selectedMarker.info.country}
                    </p>
                    <p className="text-gray-600 mb-2">
                      {selectedMarker.info.street} {selectedMarker.info.zip}
                    </p>
                  </div>
                </InfoWindowF>
              )}
            </>
          )}
        </GoogleMap>
      </div>
      <div>
        <ActiveContractorsSidebar
          isOpenActive={isOpenActive}
          setIsOpenActive={setIsOpenActive}
          activities={
            worker_activities ? worker_activities.message : activities
          }
          onViewDetailsClick={handleViewDetailsClick} // Pass the handler to the sidebar
        />
      </div>
    </div>
  );
}

export default MapPage;
