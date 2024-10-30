import React, { useState, useEffect } from "react";
import styles from './Guess.module.css';
import Flag from 'react-world-flags';
import { IoCaretDown, IoCaretUp, IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

const Guess = ({ guesses, data, correctAnswer }) => {
  const [guessedPlayersInfo, setGuessedPlayersInfo] = useState([]);
  const [lastGuess, setLastGuess] = useState(null);

  useEffect(() => {
    const latestGuess = guesses[guesses.length - 1];
    
    if (latestGuess && latestGuess !== lastGuess) {
      setLastGuess(latestGuess);

      const playerInfo = data.find(player => player.player === latestGuess);
      
      if (!playerInfo || !correctAnswer) return;

      const isCorrect = latestGuess === correctAnswer.player;

      const compareAge = playerInfo.age > correctAnswer.age
        ? <IoCaretDown color="red" />
        : playerInfo.age < correctAnswer.age
        ? <IoCaretUp color="green" />
        : <FaCheck color="green" />;

      const compareRank = parseInt(playerInfo.rank) > parseInt(correctAnswer.rank)
        ? <IoCaretUp color="green" />
        : parseInt(playerInfo.rank) < parseInt(correctAnswer.rank)
        ? <IoCaretDown color="red" />
        : <FaCheck color="green" />;

      const isSameNationality = playerInfo.country === correctAnswer.country;

      const newGuessInfo = {
        ...playerInfo,
        isCorrect,
        compareAge,
        compareRank,
        isSameNationality,
      };

      setGuessedPlayersInfo(prevGuesses => [...prevGuesses, newGuessInfo]);
    }
  }, [guesses, data, correctAnswer, lastGuess]);

  return (
    <div>
      {guessedPlayersInfo.slice().reverse().map((playerInfo, index) => (
        playerInfo && (
          <div key={index} className={styles.container}>
            <p><strong>Player:</strong> {playerInfo.player} {playerInfo.isCorrect ? <FaCheck color="green" /> : <IoClose color="red" />}</p>
            <p><strong>Rank:</strong> {playerInfo.rank} {playerInfo.compareRank}</p>
            <p><strong>Age:</strong> {playerInfo.age} {playerInfo.compareAge}</p>
            <p><strong>Country:</strong> <Flag code={playerInfo.country} /> {playerInfo.isSameNationality ? <FaCheck color="green" /> : <IoClose color="red" />}</p>
            <p><strong>Points:</strong> {playerInfo.points}</p>
          </div>
        )
      ))}
    <div>
      {/* Numer of tries */}
      {guessedPlayersInfo && guessedPlayersInfo.length}
    </div>
    </div>
  );
};

export default Guess;