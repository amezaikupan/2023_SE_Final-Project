import './App.css';

import Header from './components/js/Header.js';
import Footer from './components/js/Footer.js';
import ConferenceInfo from './components/js/ConferenceInfo.js';
import ConferenceShortInfo from './components/js/ConferenceShortInfo.js';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const  App = () => {
  const conferenceDetails1 = {
    id : '1',
    shortName: 'ICHCSSES',
    name: 'International Conference on Human-Centered Software Engineering and Systems',
    url: 'http://iccda.org/', // Thay thế với URL thực tế
    location: 'Cairo, Egypt',
    topic: 'software-engineering',
    startDate: '2024-10-25',
    endDate: '2024-10-27',
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
  const conferenceDetails2 = {
    id : '2',
    shortName: 'ICAICSE',
    name: 'International Conference on Artificial Intelligence for Control Systems Engineering',
    url: 'https://waset.org/artificial-intelligence-for-control-systems-engineering-conference-in-december-2023-in-istanbul', // Thay thế với URL thực tế
    location: 'Istanbul, Turkey',
    topic: 'artificial intelligence',
    startDate: 'December 18-19, 2023',
    endDate: 'December 18-19, 2023',
    timezone: 'GMT +3',
    registrationDeadline: null,
    submissionDeadline: '30 December 2023',
  
    description:`Artificial intelligence for control engineering
      Application of artificial intelligence in process control
      Knowledge representation by logic
      Object orientation and object-oriented programming
      Formalisms in programming logic controllers
      Fuzzy logic and fuzzy sets
      Neural networks
      Computer control systems
      Integration of AI in control
      Real-time and communication issues
      Real-time expert systems
      Artificial intelligence in computer aided control engineering
      Intelligent control and fuzzy controllers
      Adaptive fuzzy control
      Neural networks for control
      Monitoring and fault diagnosis in control engineering
      Inner control loops
      Automatic control
      Feedback controllers
      Adaptive control
      Outer control loops
      Artificial intelligence tools`,
      speakers: `Artificial intelligence for control engineering
      Application of artificial intelligence in process control
      Knowledge representation by logic
      Object orientation and object-oriented programming
      Formalisms in programming logic controllers
      Fuzzy logic and fuzzy sets
      Neural networks
      Computer control systems
      Integration of AI in control
      Real-time and communication issues
      Real-time expert systems
      Artificial intelligence in computer aided control engineering
      Intelligent control and fuzzy controllers
      Adaptive fuzzy control
      Neural networks for control
      Monitoring and fault diagnosis in control engineering
      Inner control loops
      Automatic control
      Feedback controllers
      Adaptive control
      Outer control loops
      Artificial intelligence tools`,
    papers: 'Papers content goes here...',
  }


  
  const conferenceDetails3 = {
    id : '3',
    shortName: 'HCMUS',
    name: 'University of Science, Vietnam National University Ho Chi Minh City',
    url: 'https://waset.org/artificial-intelligence-for-control-systems-engineering-conference-in-december-2023-in-istanbul', // Thay thế với URL thực tế
    location: 'Ho Chi Minh city, Vietnam',
    topic: 'artificial intelligence',
    startDate: 'December 18-19, 2023',
    endDate: 'December 18-19, 2023',
    timezone: 'GMT +3',
    registrationDeadline: null,
    submissionDeadline: '30 December 2023',
  
    description:`Artificial intelligence for control engineering
      Application of artificial intelligence in process control
      Knowledge representation by logic
      Object orientation and object-oriented programming
      Formalisms in programming logic controllers
      Fuzzy logic and fuzzy sets
      Neural networks
      Computer control systems
      Integration of AI in control
      Real-time and communication issues
      Real-time expert systems
      Artificial intelligence in computer aided control engineering
      Intelligent control and fuzzy controllers
      Adaptive fuzzy control
      Neural networks for control
      Monitoring and fault diagnosis in control engineering
      Inner control loops
      Automatic control
      Feedback controllers
      Adaptive control
      Outer control loops
      Artificial intelligence tools`,
      speakers: `Artificial intelligence for control engineering
      Application of artificial intelligence in process control
      Knowledge representation by logic
      Object orientation and object-oriented programming
      Formalisms in programming logic controllers
      Fuzzy logic and fuzzy sets
      Neural networks
      Computer control systems
      Integration of AI in control
      Real-time and communication issues
      Real-time expert systems
      Artificial intelligence in computer aided control engineering
      Intelligent control and fuzzy controllers
      Adaptive fuzzy control
      Neural networks for control
      Monitoring and fault diagnosis in control engineering
      Inner control loops
      Automatic control
      Feedback controllers
      Adaptive control
      Outer control loops
      Artificial intelligence tools`,
    papers: 'Papers content goes here...',
  }
  
  let conferenceDetailList = [conferenceDetails1, conferenceDetails2, conferenceDetails3];
  
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route 
            path="/" 
            element={conferenceDetailList.map((details, index) => (
              <ConferenceShortInfo key={index} conferenceDetails={details} />
            ))} 
          />
          <Route 
            path="/ConferenceInfo/:conferenceId" 
            element={<ConferenceInfo conferenceDetailList={conferenceDetailList} />} 
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
