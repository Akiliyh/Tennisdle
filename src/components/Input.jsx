import React, { useState } from "react";
import styles from './Input.module.css';

const Input = ({ player }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      const filteredSuggestions = player.filter(name =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };

  const handleKeyDown = (e, suggestion) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSuggestionClick(suggestion);
      setInputValue(suggestion);
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