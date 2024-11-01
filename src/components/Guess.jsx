import React, { useState, useEffect } from "react";
import styles from './Guess.module.css';
import { IoCaretDown, IoCaretUp, IoClose, IoHandLeftSharp, IoHandRightSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import ReactCountryFlag from "react-country-flag"

const Guess = ({ guesses, data, correctAnswer }) => {
  const [guessedPlayersInfo, setGuessedPlayersInfo] = useState([]);
  const [lastGuess, setLastGuess] = useState(null);

  const allCountryCodes = [
    "AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BQ", "BA", "BW", "BV", "BR", "IO", "BN", "BG", "BF", "BI", "CV", "KH", "CM", "CA", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CD", "CG",
    "CK", "CR", "HR", "CU", "CW", "CY", "CZ", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT", "HM", "VA", "HN", "HK", "HU", "IS", "IN", "ID",
    "IR", "IQ", "IE", "IM", "IL", "IT", "JM", "JP", "JE", "JO", "KZ", "KE", "KI", "KP", "KR", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL",
    "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "MK", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA", "RE", "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "SS",
    "ES", "LK", "SD", "SR", "SJ", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "UM", "UY", "UZ", "VU", "VE", "VN", "VG", "VI", "WF", "EH", "YE", "ZM", "ZW"
  ];

  const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' });

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
    if (countryName === "Chinese Taipei") return "HK";
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

  // Get first two chars of the age string ex: 25 (1999/10/05)
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

      const compareWeight = playerWeightInKg > correctWeightInKg
        ? <IoCaretDown color="red" />
        : playerWeightInKg < correctWeightInKg
          ? <IoCaretUp color="green" />
          : <FaCheck color="green" />;

      const compareHeight = playerHeightInCm > correctHeightInCm
        ? <IoCaretDown color="red" />
        : playerHeightInCm < correctHeightInCm
          ? <IoCaretUp color="green" />
          : <FaCheck color="green" />;

      const compareAge = playerAge > correctAge
        ? <IoCaretDown color="red" />
        : playerAge < correctAge
          ? <IoCaretUp color="green" />
          : <FaCheck color="green" />;

      const compareHandedness = getHandedness(playerInfo.handedness) !== getHandedness(correctAnswer.handedness)
        ? <IoClose color="red" />
        : <FaCheck color="green" />;

      const compareRank = parseInt(playerInfo.rank) > parseInt(correctAnswer.rank)
        ? <IoCaretUp color="green" />
        : parseInt(playerInfo.rank) < parseInt(correctAnswer.rank)
          ? <IoCaretDown color="red" />
          : <FaCheck color="green" />;

      const isSameNationality = playerInfo.country === correctAnswer.country;

      const newGuessInfo = {
        ...playerInfo, isCorrect, compareAge, compareRank, compareHeight, compareWeight, compareHandedness, isSameNationality
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
            <p><strong>Weight:</strong> {playerInfo.weight} {playerInfo.compareWeight}</p>
            <p><strong>Height:</strong> {playerInfo.height} {playerInfo.compareHeight}</p>
            <p><strong>Plays:</strong> {getHandedness(playerInfo.handedness) === "Right" ? <IoHandRightSharp color="yellow" /> : <IoHandLeftSharp color="yellow" />} {playerInfo.compareHandedness}</p>
            <p><strong>Country:</strong> <ReactCountryFlag countryCode={getCountryCode(playerInfo.country)} svg/> {playerInfo.isSameNationality ? <FaCheck color="green" /> : <IoClose color="red" />}</p>
            <p><strong>Try:</strong> {guessedPlayersInfo.length - index}</p>
          </div>
        )
      ))}
    </div>
  );
};

export default Guess;