import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ConferenceShortInfo.scss';

const ConferenceShortInfo = ({ conferenceDetails }) => {
  let navigate = useNavigate();

  const handleViewDetailsClick = () => {
    navigate(`/ConferenceInfo/${conferenceDetails.id}`);
  };

  return (
    <div className="conference-short-container">
      <h2>{conferenceDetails.shortName}</h2>
      <h3>{conferenceDetails.name}</h3>
      <p>{conferenceDetails.dates} - {conferenceDetails.location}</p>
      <p>{conferenceDetails.topic}</p>



      <button onClick={handleViewDetailsClick}>View details</button>
    </div>
  );
};

export default ConferenceShortInfo;
