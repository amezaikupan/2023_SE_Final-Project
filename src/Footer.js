import React from 'react';
import fbicon from './images/fbicon.png';
import igicon from './images/igicon.png';
import yticon from './images/yticon.png';
import './Footer.css'; // Đảm bảo bạn đã tạo một file CSS với tên này

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <section className="contact-us">
          <h2>Contact us:</h2>

          <div className="social-links">
            <a href="https://facebook.com" className="social-link">
              <img src={fbicon} alt="Facebook" />
            </a>
            <a href="https://instagram.com" className="social-link">
              <img src={igicon} alt="Instagram" />
            </a>
            <a href="https://youtube.com" className="social-link">
              <img src={yticon} alt="YouTube" />
            </a>
          </div>

        </section>
        <section className="references">
          <h2>Reference:</h2>
          <div className="reference-links">
            <a href="/conference-index" className="reference-link">Conference Index</a>
            <a href="/conference-index" className="reference-link">Research.comx</a>
            <a href="/call-for-papers" className="reference-link">Call for Papers</a>
          </div>
        </section>
      </div>
    </footer>
  );
}

export default Footer;