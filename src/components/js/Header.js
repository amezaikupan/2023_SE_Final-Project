import React from 'react';
import '../css/Header.scss'; // Đảm bảo bạn đã tạo một file SCSS với tên này
import CSTrackerlogo from '../images/CSTrackerlogo.png'; 
import CSTrackerdotcom from '../images/CSTrackerdotcom.png';


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