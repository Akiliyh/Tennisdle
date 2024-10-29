import React, { useState, useEffect } from "react";
import styles from './Guess.module.css';
import Flag from 'react-world-flags';
import { IoCaretDown, IoCaretUp, IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

const Guess = ({ guesses, data, correctAnswer }) => {
  const [guessedPlayersInfo, setGuessedPlayersInfo] = useState([]);

  useEffect(() => {
    const guessedInfo = guesses.map(guess => {
      const playerInfo = data.find(player => player.player === guess);

      if (!playerInfo || !correctAnswer) return null;

      const isCorrect = guess === correctAnswer.player;

      const compareAge = playerInfo.age > correctAnswer.age
        ? <IoCaretDown color="red" />
        : playerInfo.age < correctAnswer.age
        ? <IoCaretUp color="green" />
        : <FaCheck color="green" />;

      const compareRank = playerInfo.rank > correctAnswer.rank
        ? <IoCaretUp color="green" />
        : playerInfo.rank < correctAnswer.rank
        ? <IoCaretDown color="red" />
        : <FaCheck color="green" />;

      const isSameNationality = playerInfo.country === correctAnswer.country;

      return {
        ...playerInfo,
        isCorrect, compareAge, compareRank, isSameNationality,
      };
    }).filter(Boolean);

    setGuessedPlayersInfo(guessedInfo);
  }, [guesses, data, correctAnswer]);


  return (
    <div>
      {guessedPlayersInfo.map((playerInfo, index) => (
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
    </div>
  );
};

export default Guess;
