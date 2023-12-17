import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Header from './components/js/Header.js';
import Footer from './components/js/Footer.js';
import ConferenceInfo from './components/js/ConferenceInfo.js';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header />
    <ConferenceInfo />
    <App />
    <Footer />
  </React.StrictMode>
);

reportWebVitals();
