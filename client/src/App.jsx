import './App.css';

import Header from './components/js/Header.js';
import Footer from './components/js/Footer.js';
import ConferenceInfo from './components/js/ConferenceInfo.js';
import ConferenceShortInfo from './components/js/ConferenceShortInfo.js';
import FilterForm from './components/js/FilterForm.js';

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios'



const App = () => {
  // Đoạn code 
  const [conferenceDetailList, setConferenceDetailList] = useState([conferenceDetails1]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/conferences') 
      .then(response => {
        console.log(response.data);
        const processedData = processConferenceData(response.data);
        setConferenceDetailList(processedData);
      })
      .catch(error => {
        console.error('Có lỗi khi fetch dữ liệu:', error);
      });
  }, []);
  

  return (
    <Router>
      <div className="App">
        <Header />
        <ContentWithFilter conferenceDetailList={conferenceDetailList} />
        <Footer />
      </div>
    </Router>
  );
};

const ContentWithFilter = ({ conferenceDetailList }) => {
  const location = useLocation();
  const [showFilterForm, setShowFilterForm] = useState(location.pathname === '/');
  const [filteredConferenceDetailList, setFilteredConferenceDetailList] = useState(conferenceDetailList);

  useEffect(() => {
    setShowFilterForm(location.pathname === '/');
  }, [location]);

  useEffect(() => {
    setFilteredConferenceDetailList(conferenceDetailList);
  }, [conferenceDetailList]);

  const handleFiltersChange = (filters) => {
    // Gửi yêu cầu đến backend với các bộ lọc và cập nhật trạng thái với kết quả trả về
    console.log(filters);
    // setFilteredConferenceDetailList(conferenceDetailList.slice(0, 2));
      // Gửi yêu cầu đến backend với các bộ lọc
    axios.post('http://localhost:5000/api/conferences', filters)
      .then(response => {
        console.log(response.data);
        const processedData = processConferenceData(response.data);
        setFilteredConferenceDetailList(processedData);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    // Đoạn code xử lý filter
    <>
      {showFilterForm && <FilterForm onFiltersChange={handleFiltersChange} />}
      <Routes>
        <Route 
          path="/" 
          element={filteredConferenceDetailList.map((details, index) => (
            <ConferenceShortInfo key={details.id} conferenceDetails={details} />
          ))} 
        />
        <Route 
          path="/ConferenceInfo/:conferenceId" 
          element={<ConferenceInfo conferenceDetailList={filteredConferenceDetailList} />} 
        />
      </Routes>
    </>
  );
};


const formatDate = (dateTimeString) => {
  if (!dateTimeString) {
    // Trả về một chuỗi rỗng hoặc giá trị mặc định nếu dateTimeString là null hoặc undefined
    return ''; 
  }
  return dateTimeString.split('T')[0];
};

const processConferenceData = (data) => {
  return data.map(item => ({
    id: item._id,
    shortName: item.shortName,
    name: item.title,
    url: item.websiteURL,
    location: item.location,
    topic: item.topic,
    dates: item.timeline && item.timeline["Conference Dates"]
      ? item.timeline["Conference Dates"].map(date => formatDate(date)).join('~')
      : '',
    timezone: item.timeline ? item.timeline.timeZone : '',
    submissionDeadline: item.timeline 
      ? formatDate(item.timeline["Abstracts/Full-Text Paper Submission Deadline"])
      : '',
    notificationAcceptedPaper: item.timeline 
      ? formatDate(item.timeline["Notification of Acceptance/Rejection"])
      : '',
    finalSubmission: item.timeline 
      ? formatDate(item.timeline["Final Paper (Camera Ready) Submission & Early Bird Registration Deadline"])
      : '',
    description: item.description,
    speakers: item.speakers,
    papers: item.acceptedPapers && item.acceptedPapers.length
      ? item.acceptedPapers.map(paper => `${paper.title}-${paper.description}`).join('\n')
      : ''
  }));
};




const conferenceDetails1 = {
  id : '1',
  shortName: "TESt ",
  name: "Khi chưa load được database thì sẽ hiện ra cái này", 
  url: "https://www.waset.org/conference/2024/06/cairo/ICSTSE", 
  location: "Cairo, Egypt", 
  topic: "Tel Aviv, Israel", 
  dates: "2024-06-27~2024-06-28", 
  timezone: "UTC+02:00", 
  submissionDeadline: "2024-01-16", 
  notificationAcceptedPaper: "2024-01-31",
  finalSubmission: "2024-05-24", 
  
  description: "International Conference on Software Science, Technology and Engineeringaims to bring together leading academic scientists, researchers and research scholars to exchange and share their experiences and research results on all aspects of Software Science, Technology and Engineering. It also provides a premier interdisciplinary platform for researchers, practitioners and educators to present and discuss the most recent innovations, trends, and concerns as well as practical challenges encountered and solutions adopted in the fields of Software Science, Technology and Engineering.", 
  speakers: null, 
  papers: "Empirical Study from Final Exams of Computer Science Courses Demystifying the Notion of 'an Average Software Engineer-Alex Elentukh\nDevelopment of Software Complex for Digitalization of Enterprise Activities-G. T. Balakayeva, K. K. Nurlybayeva, M. B. Zhanuzakov"
   

};
export default App;
