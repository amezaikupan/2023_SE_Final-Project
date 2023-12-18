import React, { useState } from 'react';
import '../css/FilterForm.scss';

const FilterForm = ({ onFiltersChange }) => {
  const topics = ['software-engineering', 'computer-science', 'computer-vision', 'data-science', 'information-technology', 'artificial-intelligence', 'information-systems']
  const sorts = ['date', 'alphabetical', 'relevance'];
  const times = ['Next 1 week', 'Next 1 month', 'Next 1 year'];


  const [filters, setFilters] = useState({
    topic: '',
    location: '', 
    time: '',
    sortBy: '',
    paperSubmissionOpen: false
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onFiltersChange(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="filter-form">
      <div className="dropdown">
        <label htmlFor="topic">Topic Selected</label>
        <select id="topic" name="topic" onChange={handleInputChange}>
          <option value="">All Topic</option>
          {topics.map((topic, index) => (
            <option key={index} value={topic}>{topic.replace(/-/g, ' ')}</option>
          ))}
        </select>
      </div>
      
      <div className="dropdown">
        <label htmlFor="location">Location</label>
        <select id="location" name="location" onChange={handleInputChange}>
          <option value="">All Locations</option>
          <option value="Cairo, Egypt">Cairo, Egypt</option>
          <option value="Istanbul, Turkey">Istanbul, Turkey</option>
          <option value="Ho Chi Minh city, Vietnam">Ho Chi Minh city, Vietnam</option>
        </select>
      </div>
      
      <div className="dropdown">
        <label htmlFor="time">Time</label>
        <select id="time" name="time" onChange={handleInputChange}>
          <option value="">All Upcoming Time</option>
          <option value="Next 1 week">Next 1 week</option>
          <option value="Next 1 month">Next 1 month</option>
          <option value="Next 1 year">Next 1 year</option>

        </select>
      </div>

      <div className="dropdown">
        <label htmlFor="sortBy">Sort By</label>
        <select id="sortBy" name="sortBy" onChange={handleInputChange}>
          <option value="date">Sort by date</option>
          <option value="relevance">Sort by relevance</option>
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
