// CarPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "font-awesome/css/font-awesome.min.css"; // Import Font Awesome
import "./App.css";

const CarPage = ({ carType }) => {
  const [myLocation, setMyLocation] = useState(null);
  const navigate = useNavigate();

  const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${process.env.REACT_APP_JSONBIN_BIN_ID}`;

  const logCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        try {
          // Fetch current data
          const response = await axios.get(JSONBIN_URL, {
            headers: {
              "X-Master-Key": "$2b$10$UZ0nh9zAcCgQh0i" + process.env.REACT_APP_JSONBIN_API_KEY,
            },
          });
          const updatedLocations = {
            ...response.data.record,
            [carType]: newLocation,
          };

          // Update the data
          await axios.put(JSONBIN_URL, updatedLocations, {
            headers: {
              "Content-Type": "application/json",
              "X-Master-Key": "$2b$10$UZ0nh9zAcCgQh0i" + process.env.REACT_APP_JSONBIN_API_KEY,
            },
          });
          alert(`${carType} location updated.`);
        } catch (error) {
          console.error("Error updating car location:", error);
        }
      },
      (error) => {
        console.error("Error getting user location:", error);
        alert("Unable to retrieve your location.");
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMyLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Error getting user location:", error);
        alert("Unable to retrieve your location.");
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const userIcon = L.divIcon({
    className: "custom-icon",
    html: `<i class="fa fa-map-marker" style="color: #ffcc00; font-size: 2rem;"></i>`,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
  });

  return (
    <div className="car-page">
      <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button>
      <h2>{carType} Location</h2>
      <div className="map-container-small">
        {myLocation ? (
          <MapContainer
            center={myLocation}
            zoom={15}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            <Marker position={myLocation} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Loading your location...</p>
        )}
      </div>
      <button onClick={logCurrentLocation} className="log-button">
        Log car's {carType} current location
      </button>
    </div>
  );
};

export default CarPage;
