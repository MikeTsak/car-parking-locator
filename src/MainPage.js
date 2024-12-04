// MainPage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "font-awesome/css/font-awesome.min.css"; // Add this line
import "./App.css";

const RecenterMap = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.setView(location, map.getZoom());
    }
  }, [location, map]);
  return null;
};

const MainPage = () => {
  const [carLocations, setCarLocations] = useState({});
  const [myLocation, setMyLocation] = useState(null);
  const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${process.env.REACT_APP_JSONBIN_BIN_ID}`;

  const carColors = {
    Aygo: "#eb4034",
    Almera: "#0e17c9",
    ASX: "#3ebce6",
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(JSONBIN_URL, {
        headers: {
          "X-Master-Key": "$2b$10$UZ0nh9zAcCgQh0i" + process.env.REACT_APP_JSONBIN_API_KEY,
        },
      });
      setCarLocations(response.data.record);
      console.log("Fetched car locations:", response.data.record);
    } catch (error) {
      console.error("Error fetching car locations:", error);
    }
  };

  useEffect(() => {
    fetchLocations();

    // Watch user's live location
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = [position.coords.latitude, position.coords.longitude];
        setMyLocation(location);
      },
      (error) => {
        console.error("Error watching user location:", error);
      },
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId); // Clear watcher on unmount
    };
  }, []);

  const getIcon = (color) => {
    return L.divIcon({
      className: "custom-icon",
      html: `<i class="fa fa-car" style="color:${color}; font-size: 2rem;"></i>`,
      iconSize: [20, 20],
      iconAnchor: [10, 20],
    });
  };

  const userIcon = L.divIcon({
    className: "custom-icon",
    html: `<i class="fa fa-map-marker" style="color: #ffcc00; font-size: 2rem;"></i>`,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
  });

  return (
    <div className="app">
      <div className="header">
        <h1>Car Park Locator</h1>
        <Link to="/almera">
          <button id="btn-Almera">
            <img
              src="https://www.logo.wine/a/logo/Nissan_Motor_India_Private_Limited/Nissan_Motor_India_Private_Limited-Logo.wine.svg"
              alt="Nissan Logo"
            />
            Almera
          </button>
        </Link>
        <Link to="/asx">
          <button id="btn-ASX">
            <img
              src="https://www.logo.wine/a/logo/Mitsubishi/Mitsubishi-Logo.wine.svg"
              alt="Mitsubishi Logo"
            />
            ASX
          </button>
        </Link>
        <Link to="/aygo">
          <button id="btn-Aygo">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Toyota_EU.svg"
              alt="Toyota Logo"
            />
            Aygo
          </button>
        </Link>
      </div>
      <div className="map-container">
        <MapContainer
          center={[37.987, 23.671]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {myLocation && (
            <>
              <Marker position={myLocation} icon={userIcon}>
                <Popup>You are here</Popup>
              </Marker>
              <RecenterMap location={myLocation} />
            </>
          )}
          {Object.entries(carLocations).map(([car, location]) => (
            <Marker
              key={car}
              position={[Number(location.lat), Number(location.lng)]} // Ensure lat and lng are numbers
              icon={getIcon(carColors[car])}
            >
              <Popup>
                <div className="popup-content">
                  <strong>{car}</strong>
                  <br />
                  <a
                    href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="popup-link"
                  >
                    Navigate
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MainPage;
