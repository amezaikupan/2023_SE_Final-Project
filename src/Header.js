import React from 'react';
import './Header.css'; 
import CSTrackerlogo from './images/CSTrackerlogo.png'; 
import CSTrackerdotcom from './images/CSTrackerdotcom.png';


function Header() {
  let sologan = "Tracking Conferences - Leading the Future";
  return (


    <header className="header">
      <div className="header-web">

        <div className="header-logo">
          <img src={CSTrackerlogo} alt="CSTracker Logo" />
        </div>

        <div className="header-title">
          <img src={CSTrackerdotcom} alt="CSTracker.com" />
        </div>

      </div>

      <div className="header-slogan">
        <p>{sologan}</p>
      </div>
    </header>
  );
}

export default Header;