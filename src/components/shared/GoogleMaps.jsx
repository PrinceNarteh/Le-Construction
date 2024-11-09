import GoogleMapReact from "google-map-react";
import React, { useEffect, useRef, useState } from "react";
import { MdLocationPin } from "react-icons/md";

const GoogleMaps = ({ onLocationChange, lat = null, lng = null }) => {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0 });
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [maps, setMaps] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const searchResultSelected = useRef(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // const lat = position.coords.latitude;
          // const lng = position.coords.longitude;
          //setCenter({ lat, lng });
          //setSelectedLocation({ lat, lng });
          //onLocationChange({ lat, lng });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported in this browser.");
    }
  }, [onLocationChange]);

  useEffect(() => {
    if (mapsLoaded && !searchBox && window.google && window.google.maps) {
      const input = document.getElementById("search-box");
      const searchBox = new window.google.maps.places.SearchBox(input);
      setSearchBox(searchBox);
      setAutocompleteService(
        new window.google.maps.places.AutocompleteService()
      );

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) {
          return;
        }

        searchResultSelected.current = true;
        const location = places[0].geometry.location;
        const location_data = places[0];
        //get route, locality, administrative_area_level_1 and Ghana from address_components in location_data
        const address_components = location_data.address_components;
        const street = address_components[1]?.long_name;
        const city = address_components[2]?.long_name;
        const state = address_components[4]?.long_name;
        const region = address_components[3]?.long_name;
        const country = address_components[5]?.long_name;
        const zip = address_components[6]?.long_name;

        const lat = location.lat();
        const lng = location.lng();
        setCenter({ lat, lng });
        setSelectedLocation({ lat, lng });
        onLocationChange({
          lat,
          lng,
          street,
          city,
          state,
          region,
          country,
          zip,
        });
      });
    }
  }, [mapsLoaded, searchBox, lat, lng, onLocationChange]);

  const handleApiLoaded = (map, maps) => {
    setMapsLoaded(true);
    setMaps(maps);
  };

  const handleMarkerChange = (e) => {
    const { lat, lng } = e;
    if (!searchResultSelected.current) {
      setCenter({ lat, lng });
    }
    setSelectedLocation({ lat, lng });
    onLocationChange({ lat, lng });
  };

  const handleMarkerDragEnd = (e) => {
    const { lat, lng } = e;
    setCenter({ lat, lng });
    setSelectedLocation({ lat, lng });
    onLocationChange({ lat, lng });
  };

  const handleSearchInputChange = (event) => {
    const inputValue = event.target.value;
    if (autocompleteService) {
      autocompleteService.getPlacePredictions(
        { input: inputValue },
        (predictions) => {
          if (predictions) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        }
      );
    }
  };

  const handleSearchResultSelect = (placeId) => {
    const service = new window.google.maps.places.PlacesService(maps);
    service.getDetails(
      {
        placeId,
        fields: ["geometry.location"],
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          searchResultSelected.current = true;
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setCenter({ lat, lng });
          setSelectedLocation({ lat, lng });
          onLocationChange({ lat, lng });
        }
      }
    );
  };

  useEffect(() => {
    if (lat && lng) {
      setCenter({ lat: Number(lat), lng: Number(lng) });
      setSelectedLocation({ lat: Number(lat), lng: Number(lng) });
    }
  }, [lat, lng]);

  return (
    <div
      style={{ height: "300px", width: "100%", position: "relative" }}
      className="mt-5"
    >
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          width: "100%",
          padding: "10px",
        }}
      >
        <input
          id="search-box"
          type="text"
          placeholder="Type & select address here to auto fill form below"
          style={{ width: "100%", padding: "10px" }}
          className="rounded-md"
          onChange={handleSearchInputChange}
        />
        <ul style={{ listStyle: "none", padding: 0 }}>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSearchResultSelect(suggestion.place_id)}
            >
              {/* {suggestion.description} */}
            </li>
          ))}
        </ul>
      </div>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyDhxiV3IiFr2KzXokhStpsfmD-E3Kw-7Zk" }}
        center={center}
        zoom={13}
        onClick={handleMarkerChange}
        onDrag={handleMarkerDragEnd}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        {mapsLoaded && (
          <div
            lat={selectedLocation.lat}
            lng={selectedLocation.lng}
            draggable
            onDragEnd={handleMarkerDragEnd}
          >
            <MdLocationPin color="red" size={30} />
          </div>
        )}
      </GoogleMapReact>
    </div>
  );
};

export default GoogleMaps;

//AIzaSyDhxiV3IiFr2KzXokhStpsfmD-E3Kw-7Zk
