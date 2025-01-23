import React, { useState, useEffect } from "react";
import styles from './Input.module.css';

const Input = ({ player, handleGuess }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [playerList, setPlayerList] = useState(player);
  const [isBtnActive, setIsBtnActive] = useState(false);

  useEffect(() => {
    inputValue != "" ? setIsBtnActive(true) : setIsBtnActive(false);
  }, [inputValue]);

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
    setInputValue(suggestion);
    setSuggestions([]);
  };

  const handleKeyDown = (e, suggestion) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSuggestionClick(suggestion);
    }
  };

  const guessInput = (e) => {
    if (inputValue === "") {
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      guess();
    }
  }

  const guess = () => {
    if (inputValue === "") {
      return;
    }
    // Check if the inputValue exists in the playerList
  const playerExists = playerList.some(player => player.toLowerCase() === inputValue.toLowerCase());

    setSuggestions([]);
    if (!playerExists) {
      console.error('Error: The entered name does not match any player in the list.');
      return; // todo add error message in ui
    }
    setInputValue('');
    setPlayerList(setRemainingPlayers(inputValue));
    handleGuess(inputValue);
    console.log(playerList);
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
    <div className={styles.guessSection}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={guessInput}
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
      <button className={isBtnActive ? styles.active : ''} onClick={(e) => guess()}>Guess</button>
    </div>
  );
};

export default Input; 