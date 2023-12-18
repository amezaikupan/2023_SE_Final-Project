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
      <div className='shortName'>{conferenceDetails.shortName}</div>

      
      <div className='info'> 
        <a className = 'name' href={conferenceDetails.url} target="_blank" rel="noopener noreferrer"> {conferenceDetails.name} </a>
        <p className='timeLocation'>{conferenceDetails.dates} - {conferenceDetails.location}</p>
        <p className='deadline'><strong>Submission Deadline:</strong>  {conferenceDetails.submissionDeadline}</p>
        <div className='topic'>{conferenceDetails.topic}</div>

      </div>
      
      <button onClick={handleViewDetailsClick}>View details</button>

    </div>
  );
};

export default ConferenceShortInfo;
