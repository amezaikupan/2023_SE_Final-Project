import React, { useState } from 'react';
import '../css/FilterForm.scss';

const FilterForm = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    topic: '',
    location: '', // Thêm trường lọc location
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
          <option value="Computer Science">Computer Science</option>
          <option value="Computer Networking">Computer Networking</option>
          {/* other topics */}
        </select>
      </div>
      
      <div className="dropdown">
        <label htmlFor="location">Location</label>
        <select id="location" name="location" onChange={handleInputChange}>
          <option value="">All Locations</option>
          <option value="Cairo, Egypt">Cairo, Egypt</option>
          <option value="Istanbul, Turkey">Istanbul, Turkey</option>
          <option value="Ho Chi Minh city, Vietnam">Ho Chi Minh city, Vietnam</option>
          {/* Bổ sung thêm các location nếu cần */}
        </select>
      </div>
      
      <div className="dropdown">
        <label htmlFor="time">Time</label>
        <select id="time" name="time" onChange={handleInputChange}>
          <option value="">All Upcoming Time</option>
          <option value="Next 1 week">Next 1 week</option>
          <option value="Next 1 month">Next 1 month</option>
          <option value="Next 1 year">Next 1 year</option>
          {/* other time options */}
        </select>
      </div>

      <div className="dropdown">
        <label htmlFor="sortBy">Sort By</label>
        <select id="sortBy" name="sortBy" onChange={handleInputChange}>
          <option value="date">Sort by date</option>
          <option value="relevance">Sort by relevance</option>
          {/* other sort options */}
        </select>
      </div>


      <div className="checkbox">
        <label>
          <input 
            type="checkbox" 
            name="paperSubmissionOpen" 
            checked={filters.paperSubmissionOpen} 
            onChange={handleInputChange} 
          />
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
