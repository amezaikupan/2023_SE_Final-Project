import React, { useState } from 'react';
import '../css/ConferenceInfo.scss';

const ConferenceInfo = () => {

  const [activeTab, setActiveTab] = useState('description');

  const conferenceDetails = {
    shortName: 'ICHCSSES',
    name: 'International Conference on Human-Centered Software Engineering and Systems',
    url: 'http://iccda.org/', // Thay thế với URL thực tế
    location: 'Cairo, Egypt',
    topic: 'software-engineering',
    dates: '2024-10-25 to 2024-10-27',
    timezone: 'GMT +3',
    registrationDeadline: null,
    submissionDeadline: '30 December 2023',

    description: `Computer Systems Engineering and Technology
    Computer Science, Electrical and Electronics Engineering
    Computer Science and Systems Technology
    Computer Science and Electronics Engineering
    Computer Networks and Communications Engineering
    Adaptive and Non-Adaptive Filtering and Implementations
    Applications
    Biomedical Signal and Image Processing
    Cognitive, Cellular, and Heterogeneous Wireless Networks
    Communications Receivers
    Computer Networks and Security
    Control Applications
    Control design methods
    Control System Modeling and Identification
    Digital Communications
    Discrete and Hybrid systems
    DSP For Communications
    Electrical Machines and Drives
    Grid and Cloud Computing
    Image Processing
    Mobile and Wireless Communications
    Mobile Computing and Communication Networks
    Multimedia, Real-Time Networking, and Network Modeling
    Network Algorithms and Performance Evaluation
    Network Architectures and Clean-Slate Designs
    Networks and QOS
    Nonlinear Control and Applications
    OFDM and CDMA
    Power Systems
    Scalable, Reliable, and Energy-Efficient Networks
    Security, Privacy, and Trust
    Sensor Networks, Embedded Systems, and Pervasive Computing
    Signal Processing and Applications
    Space-Time Coding
    Speech and Audio Processing
    Streaming and Content Distribution Networking
    Video and Multimedia Signal Processing
    Wireless LAN, Ad Hoc, and Mesh Networks`,

    speakers: 'Speakers content goes here...',
    papers: 'Papers content goes here...',


  };

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
                {conferenceDetails.dates}
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
