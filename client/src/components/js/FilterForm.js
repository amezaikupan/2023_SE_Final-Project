import React, { useState } from 'react';
import '../css/FilterForm.scss';

// Get all countries for filter
const countryList = require('country-list');
const allCountryNames = ['All Countries'].concat(countryList.getNames());

  
const FilterForm = ({ onFiltersChange }) => {
  const topics = ['All Topic', 'Software Engineering', 'Computer Science', 'Computer Vision', 'Data Science', 'Information Technology', 'Artificial Intelligence', 'Information Systems']
  const times = ['All Time', 'Next 1 week', 'Next 1 month', 'Next 1 year'];
  
  
  const [filters, setFilters] = useState({
    topic: '',
    location: '', 
    time: '',
    paperSubmissionOpen: false
  });
  // Hàm handleInputChange sẽ được gọi mỗi khi input thay đổi
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  // Hàm handleSubmit sẽ được gọi khi người dùng submit form
  const handleSubmit = (event) => {
    event.preventDefault();
    onFiltersChange(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="filter-form">
      <div className="dropdown">
        <label htmlFor="topic">Topic Selected</label>
        <select id="topic" name="topic" onChange={handleInputChange}>
          {topics.map((topic, index) => (
            <option key={index} value={topic}>{topic.replace(/-/g, ' ')}</option>
          ))}
        </select>
      </div>
      
      <div className="dropdown">
        <label htmlFor="location">Location</label>
        <select id="location" name="location" onChange={handleInputChange}>
          {allCountryNames.map((location, index) => (
            <option key={index} value={location}>{location.replace(/-/g, ' ')}</option>
          ))}
        </select>
      </div>
      
      <div className="dropdown">
        <label htmlFor="time">Time</label>
        <select id="time" name="time" onChange={handleInputChange}>
          {times.map((time, index) => (
            <option key={index} value={time}>{time.replace(/-/g, ' ')}</option>
          ))}
        </select>
      </div>


      <div className="checkbox">
        <label className ="custom-checkbox">
          <input 
            type="checkbox" 
            name="paperSubmissionOpen" 
            checked={filters.paperSubmissionOpen} 
            onChange={handleInputChange} 
          />
          <span class="checkmark"></span>
          Paper submission open
        </label>
      </div>

      <button type="submit" className="submit-button">
        Apply Filters
      </button>
    </form>
  );
};

export default FilterForm;
