// components/SearchFilter.jsx
import React, { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce'; // ✅ fixed import (no curly braces)
import './style/SearchFilter.css';

const SearchFilter = ({ filters, onFilterChange, eventsCount }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Debounce only the search input value
  const debouncedSearch = useDebounce(localFilters.search, 300);

  // Whenever debounced search changes, trigger parent filter update
  useEffect(() => {
    onFilterChange({ ...localFilters, search: debouncedSearch });
  }, [debouncedSearch]);

  const categories = ['All', 'Music', 'Conference', 'Food', 'Comedy', 'Art', 'Sports'];
  const priceMarks = {
    0: '$0',
    100: '$100',
    200: '$200',
    300: '$300',
    400: '$400',
    500: '$500+'
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalFilters(prev => ({ ...prev, search: value }));
  };

  const handleCategoryChange = (category) => {
    const newFilters = { 
      ...localFilters, 
      category: category === 'All' ? '' : category 
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    const newFilters = { ...localFilters, priceRange: [0, value] };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (e) => {
    const newFilters = { ...localFilters, date: e.target.value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      search: '',
      category: '',
      priceRange: [0, 500],
      date: ''
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="search-filter">
      <div className="filter-header">
        <div className="search-box">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="Search events..."
            value={localFilters.search}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="results-count">
          {eventsCount} {eventsCount === 1 ? 'event' : 'events'} found
        </div>
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label>Category</label>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`category-btn ${
                  (category === 'All' && !localFilters.category) || 
                  localFilters.category === category ? 'active' : ''
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Price Range: Up to ${localFilters.priceRange[1]}</label>
          <input
            type="range"
            min="0"
            max="500"
            step="50"
            value={localFilters.priceRange[1]}
            onChange={handlePriceChange}
            className="price-slider"
          />
          <div className="price-labels">
            {Object.entries(priceMarks).map(([value, label]) => (
              <span key={value}>{label}</span>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Date</label>
          <input
            type="date"
            value={localFilters.date}
            onChange={handleDateChange}
            className="date-input"
          />
        </div>

        <button onClick={clearFilters} className="clear-filters">
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
