import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ConferenceInfo.scss';

const ConferenceInfo = ({ conferenceDetailList }) => {
  const { conferenceId } = useParams();
  const [activeTab, setActiveTab] = useState('description'); // Gọi useState ở đây

  // Tìm conferenceDetails dựa trên conferenceId
  const conferenceDetails = conferenceDetailList.find(
    detail => detail.id === conferenceId
  );

  // Kiểm tra sau khi đã gọi useState
  if (!conferenceDetails) {
    return <div>Loading...</div>;
  }

  console.log(conferenceDetails);

  return (
    
    <div className="conference-container">
      <div className="conference-info">
        <div className="conference-header">
          <span className="conference-short-name">{conferenceDetails.shortName}</span>
          <h1 className="conference-name">{conferenceDetails.name}</h1>
        </div>
        <div className="conference-body">
          <div className="conference-details">
            <a href={conferenceDetails.url} target="_blank" rel="noopener noreferrer">Website URL</a>
            <p><strong>Location:</strong> {conferenceDetails.location}</p>
            <p><strong>Topic:</strong> {conferenceDetails.topic}</p>
          </div>

          <div className="conference-timeline">
            <h2>Conference Timeline</h2>
            <div><strong>When:</strong> 
                {conferenceDetails.startDate} ~ {conferenceDetails.endDate}
            </div>
            <div><strong>Timezone:</strong> {conferenceDetails.timezone}</div>
            <div><strong>Registration Deadline:</strong> {conferenceDetails.registrationDeadline || 'N/A'}</div>
            <div><strong>Submission Deadline:</strong> {conferenceDetails.submissionDeadline}</div>
          </div>
        </div>
      </div>

      <div className="conference-description">
        <div className="tab-buttons">
          <button 
            onClick={() => setActiveTab('description')}
            className={activeTab === 'description' ? 'active' : ''}>
            Description
          </button>
          <button 
            onClick={() => setActiveTab('speakers')}
            className={activeTab === 'speakers' ? 'active' : ''}>
            Speakers
          </button>
          <button 
            onClick={() => setActiveTab('papers')}
            className={activeTab === 'papers' ? 'active' : ''}>
            Papers
          </button>
        </div>

        <div className="tab-content" style={{ whiteSpace: 'pre-wrap' }}>
          {conferenceDetails[activeTab]}
        </div>
      </div> 
    </div>
  );
};

export default ConferenceInfo;
