import React, { useState, useEffect } from "react";
import styles from './Input.module.css';
import { IoClose } from "react-icons/io5";

const Input = ({ isGameOver, handleNbTries, player, handleGuess }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [playerList, setPlayerList] = useState(player);
  const [isGuessBtnActive, setIsGuessBtnActive] = useState(false);
  const [isCloseBtnActive, setIsCloseBtnActive] = useState(false);

  useEffect(() => {
    inputValue != "" ? setIsGuessBtnActive(true) : setIsGuessBtnActive(false);
    inputValue != "" ? setIsCloseBtnActive(true) : setIsCloseBtnActive(false);
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
    handleNbTries();
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

  const resetInput = () => {
    setInputValue('');
    setSuggestions([]);
  }

  return (
    <div className={styles.guessSection}>
      <div className={styles.inputContainer + (isGameOver ? '' + styles.disabled : '')}>
        <input
          {...(isGameOver && {disabled: true})}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={guessInput}
          placeholder="Type a player name..."
        />
        <IoClose onClick={() => resetInput()} className={styles.closeIcon + (isCloseBtnActive ? ' ' + styles.active : '')}  />

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
      <button className={isGuessBtnActive ? styles.active : ''} onClick={(e) => guess()}>Guess</button>
    </div>
  );
};

export default Input; 