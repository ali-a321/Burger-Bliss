import React, { useState } from 'react';

function SearchBar({ menuData, setFilteredMenuData }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    const filteredData = query
    ? menuData.filter((item) =>
        item.food_name.toLowerCase().includes(query.toLowerCase())
      )
    : [];
    setFilteredMenuData(filteredData);
    setSearchQuery(query);
  };

  return (
    <div className='searchBar'>
      <input
        type="text"
        placeholder="Search by food name"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;