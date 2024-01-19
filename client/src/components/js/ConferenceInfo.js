import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ConferenceInfo.scss';

const ConferenceInfo = ({ conferenceDetailList }) => {
  // Định nghĩa hàm useParams để lấy conferenceId từ URL
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

            <div className='attribute-names'> <strong>Website URL: </strong>
              <a href={conferenceDetails.url} target="_blank" rel="noopener noreferrer" className="website-url">{conferenceDetails.url}</a>
            </div>

            <div className='attribute-names'> <strong>Location: </strong>
              <p className='location'> {conferenceDetails.location}</p>
            </div>
              
            <div className='attribute-names'> <strong>Topic:  </strong>
              <p className='topic'> {conferenceDetails.topic}</p>
            </div>
            
          </div>

          <div className="conference-timeline">
            <h2>Conference Timeline</h2>

            <div className='attribute-names'> <strong>When:  </strong>
              <p className='timeline'> {conferenceDetails.dates || 'N/A'} </p>
            </div>

            <div className='attribute-names'> <strong>Timezone:  </strong>
              <p className='timeline'> {conferenceDetails.timezone|| 'N/A'}</p>
            </div>

            <div className='attribute-names'> <strong>Submission Deadline:  </strong>
              <p className='timeline'> {conferenceDetails.submissionDeadline || 'N/A'} </p>
            </div>

            <div className='attribute-names'> <strong>Notification :  </strong>
              <p className='timeline'>{conferenceDetails.notificationAcceptedPaper || 'N/A'}</p>
            </div>

            <div className='attribute-names'> <strong>Final submisstion :  </strong>
              <p className='timeline'>{conferenceDetails.finalSubmission || 'N/A'}</p>
            </div>
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
