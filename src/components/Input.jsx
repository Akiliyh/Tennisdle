import React, { useState } from "react";
import styles from './Input.module.css';

const Input = ({ player, handleGuess }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      const filteredSuggestions = player.filter(name =>
        removeDiacritics(name).toLowerCase().includes(removeDiacritics(value).toLowerCase())
      ).sort((a, b) => a.localeCompare(b)); // Sort alphabetically
      
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
    handleGuess(suggestion);
  };

  const handleKeyDown = (e, suggestion) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSuggestionClick(suggestion);
    }
  };

  return (
    <div className={styles.inputContainer}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type a player name..."
      />
      {suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((suggestion, index) => (
            <li tabIndex={0} key={index} onKeyDown={(e) => handleKeyDown(e, suggestion)} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Input; 