import React, { useState } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onGeolocation: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onGeolocation }) => {
  const [city, setCity] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(city);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Введите город"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button type="submit">Поиск</button>
      <button 
        type="button" 
        className="geolocation-btn"
        onClick={onGeolocation}
      >
        📍
      </button>
    </form>
  );
};

export default SearchBar;