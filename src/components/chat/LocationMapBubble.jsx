import React, { useRef, useEffect, useState } from "react";

function LocationMap({ coordinates }) {
  const mapRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (coordinates) {
      const [lat, lng] = coordinates.split(",");
      setLatitude(parseFloat(lat));
      setLongitude(parseFloat(lng));
    }
  }, [coordinates]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDhxiV3IiFr2KzXokhStpsfmD-E3Kw-7Zk&callback=initMap`;
    script.async = true;
    script.defer = true;
  
    script.onload = () => {
      setMapLoaded(true);
    };
  
    script.onerror = () => {
      console.error("Error loading Google Maps API script.");
    };
  
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  

  useEffect(() => {
    if (isOpen && mapLoaded) {
      initializeMap();
    }
  }, [isOpen, mapLoaded]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const initializeMap = () => {
    if (window.google && latitude !== null && longitude !== null && mapRef.current) {
      const mapOptions = {
        center: { lat: latitude, lng: longitude },
        zoom: 12,
      };

      const map = new window.google.maps.Map(mapRef.current, mapOptions);

      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
      });
    }
  };

  return (
    <>
      <div onClick={openModal} style={{ cursor: "pointer" }}>
        {/* Thumbnail for the map */}
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=200x200&markers=color:red%7Clabel:A%7C${latitude},${longitude}&key=AIzaSyDhxiV3IiFr2KzXokhStpsfmD-E3Kw-7Zk`}
          alt="Map Thumbnail"
          style={{ width: "200px", height: "200px", borderRadius: "5px" }}
        />
      </div>
      {/* Modal */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "5px",
              maxWidth: "80%",
              maxHeight: "80%",
              overflow: "auto",
            }}
          >
            {/* Actual map */}
            <div ref={mapRef} style={{ width: "1000px", height: "500px" }} />
            {/* Close button */}
            <button onClick={closeModal} style={{ marginTop: "10px" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default LocationMap;
