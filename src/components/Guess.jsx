import React, { useState, useEffect } from "react";
import styles from './Guess.module.css';
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import Box from './Box';

const Guess = ({ guessedPlayersData, guesses, data, correctAnswer, onGuessUpdate }) => {
  const [guessedPlayersInfo, setGuessedPlayersInfo] = useState(guessedPlayersData);
  console.log(guessedPlayersInfo);

  const [lastGuess, setLastGuess] = useState(null);

  const allCountryCodes = [
    "AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BQ", "BA", "BW", "BV", "BR", "IO", "BN", "BG", "BF", "BI", "CV", "KH", "CM", "CA", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CD", "CG",
    "CK", "CR", "HR", "CU", "CW", "CY", "CZ", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT", "HM", "VA", "HN", "HK", "HU", "IS", "IN", "ID",
    "IR", "IQ", "IE", "IM", "IL", "IT", "JM", "JP", "JE", "JO", "KZ", "KE", "KI", "KP", "KR", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL",
    "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "MK", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA", "RE", "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "SS",
    "ES", "LK", "SD", "SR", "SJ", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "UM", "UY", "UZ", "VU", "VE", "VN", "VG", "VI", "WF", "EH", "YE", "ZM", "ZW"
  ];

  const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' });

  useEffect(() => {
    let storedDate = localStorage.getItem('guessedCorrectly');
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date (YYYY-MM-DD)

    // defines if we need to parse the value or if it is a string
    try {
      storedDate = JSON.parse(storedDate); // Attempt to parse, but catch errors
    } catch (error) {
      // If parsing fails, storedDate remains a string
    }

    // If it's a new day, reset the data
    if (storedDate != false && storedDate != currentDate) {
      console.log(storedDate);
      console.log(currentDate);
      setGuessedPlayersInfo([]);
    }
  }, []);

  const countryLookup = {};
  allCountryCodes.forEach(code => {
    const countryName = regionNamesInEnglish.of(code);
    if (countryName) {
      countryLookup[countryName] = code;
    }
  });

  // Function to get the country code by name
  function getCountryCode(countryName) {
    if (countryName === "Great Britain") return "GB"; // special cases not working properly
    if (countryName === "Chinese Taipei") return "TW";
    if (countryName === "Hong Kong") return "HK";
    if (countryName === "Bosnia-Herzegovina") return "BA";
    if (!countryName) return "UN";
    return countryLookup[countryName] || 'Country not found';
  }

  // Function to extract the weight in kg from the string
  function getWeightInKg(weightString) {
    const match = weightString.match(/\((\d+)kg\)/);
    return match ? parseInt(match[1], 10) : null;
  }

  // Function to extract the height in cm from the string
  function getHeightInCm(heightString) {
    const match = heightString.match(/\((\d+)cm\)/);
    return match ? parseInt(match[1], 10) : null;
  }

  // Get first two chars of the age string ex: 25 (1999/10/05) => 25
  function getAge(ageString) {
    return parseInt(ageString.slice(0, 2), 10);
  }

  // Get handedness if the string stars with r then it means it's right 
  function getHandedness(handString) {
    return handString.slice(0, 1) === "R" ? "Right" : "Left";
  }

  useEffect(() => {
    const latestGuess = guesses[guesses.length - 1];

    if (latestGuess && latestGuess !== lastGuess) {
      setLastGuess(latestGuess);

      const playerInfo = data.find(player => player.player === latestGuess);

      if (!playerInfo || !correctAnswer) return;

      const isCorrect = latestGuess === correctAnswer.player;

      const playerWeightInKg = getWeightInKg(playerInfo.weight);
      const correctWeightInKg = getWeightInKg(correctAnswer.weight);

      const playerHeightInCm = getHeightInCm(playerInfo.height);
      const correctHeightInCm = getHeightInCm(correctAnswer.height);

      const playerAge = getAge(playerInfo.age);
      const correctAge = getAge(correctAnswer.age);

      const compareWeight = correctWeightInKg > playerWeightInKg ? "more" : "less";

      const compareHeight = correctHeightInCm > playerHeightInCm ? "more" : "less";

      const compareAge = correctAge > playerAge ? "more" : "less"; // keep in mind this is only useful when the result is false, meaning that correct can't be equal to the guess

      const compareHandedness = getHandedness(playerInfo.handedness) == getHandedness(correctAnswer.handedness) ? <FaCheck color="green" />
        : <IoClose color="red" />;

      const compareRank = parseInt(correctAnswer.rank) > parseInt(playerInfo.rank) ? "more" : "less";

      const isRankCorrect = playerInfo.rank === correctAnswer.rank;
      const isWeightCorrect = getWeightInKg(playerInfo.weight) === getWeightInKg(correctAnswer.weight);
      const isHeightCorrect = getHeightInCm(playerInfo.height) === getHeightInCm(correctAnswer.height);
      const isAgeCorrect = getAge(playerInfo.age) === getAge(correctAnswer.age);

      const isHandCorrect = getHandedness(playerInfo.handedness) === getHandedness(correctAnswer.handedness);
      const isSameNationality = playerInfo.country === correctAnswer.country;

      const newGuessInfo = {
        ...playerInfo, isCorrect, compareAge, compareRank, compareHeight, compareWeight, compareHandedness, isRankCorrect, isHandCorrect, isHeightCorrect, isWeightCorrect, isAgeCorrect, isSameNationality
      };

      setGuessedPlayersInfo(prevGuesses => {
        const updatedGuesses = [...prevGuesses, newGuessInfo];
        onGuessUpdate(updatedGuesses);
        return updatedGuesses;
      });

      }
  }, [guesses, data, correctAnswer, lastGuess, onGuessUpdate]);

  return (
    <div className={styles.container}>
      {guessedPlayersInfo.slice().map((playerInfo, index) => (
        playerInfo && (
          <div key={index} className={styles.line}>
            <Box title="Player" value={playerInfo.player} type="name" place="start"></Box>
            <Box title="Rank" value={playerInfo.rank} isCorrect={playerInfo.isRankCorrect} compare={playerInfo.compareRank} delay={.2}></Box>
            <Box title="Age" value={getAge(playerInfo.age)} isCorrect={playerInfo.isAgeCorrect} compare={playerInfo.compareAge} delay={.4}></Box>
            <Box title="Weight" value={getWeightInKg(playerInfo.weight)} isCorrect={playerInfo.isWeightCorrect} compare={playerInfo.compareWeight} type="weight" delay={.6}></Box>
            <Box title="Height" value={getHeightInCm(playerInfo.height)} isCorrect={playerInfo.isHeightCorrect} compare={playerInfo.compareHeight} type="height" delay={.8}></Box>
            <Box title="Plays" value={getHandedness(playerInfo.handedness)} isCorrect={playerInfo.isHandCorrect} type="hand" delay={1}></Box>
            <Box title="Country" value={getCountryCode(playerInfo.country)} isCorrect={playerInfo.isSameNationality} type="country" place="end" delay={1.2}></Box>
            <div className={styles.try}>
              <span className={styles.fill}></span>
              <p>{(index+1) + "."}</p> {/* Number of tries */}
            </div>
            
          </div>
        )
      ))}
    </div>
  );
};

export default Guess;