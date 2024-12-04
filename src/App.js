// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import CarPage from "./CarPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/aygo" element={<CarPage carType="Aygo" />} />
        <Route path="/almera" element={<CarPage carType="Almera" />} />
        <Route path="/asx" element={<CarPage carType="ASX" />} />
      </Routes>
    </Router>
  );
};

export default App;
