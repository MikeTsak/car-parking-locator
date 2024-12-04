// NotFoundPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css'; // Import the new CSS file

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="car-animation">
        <div className="road"></div>
        <div className="car">
          <div className="car-body">
            <div className="light"></div>
          </div>
          <div className="wheel wheel-front"></div>
          <div className="wheel wheel-back"></div>
        </div>
      </div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <button onClick={() => navigate('/')} className="home-button">
        Go to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
