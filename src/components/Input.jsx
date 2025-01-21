import React, { useState } from "react";
import styles from './Input.module.css';

const Input = ({ player, handleGuess }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [playerList, setPlayerList] = useState(player);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      const filteredSuggestions = playerList
  .filter(name => typeof name === "string" && name.toLowerCase().includes(value.toLowerCase()))
  .sort((a, b) => a.localeCompare(b));
      
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(''); /* actually put suggestion here and add a button to guess and reset */
    setSuggestions([]);
    setPlayerList(setRemainingPlayers(suggestion));
    handleGuess(suggestion);
  };

  const handleKeyDown = (e, suggestion) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSuggestionClick(suggestion);
    }
  };

  // remove wrong answers from the suggestion list
  const setRemainingPlayers = (suggestion) => {
    const updatedPlayers = [];
    for (let i = 0; i < playerList.length; i++) {
      if (playerList[i] !== suggestion) {
        updatedPlayers.push(playerList[i]);
      }
    }
    return updatedPlayers;
  }

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