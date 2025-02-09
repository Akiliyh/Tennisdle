import React, { useState, useEffect } from "react";
import styles from './Modal.module.css';
import ReactCountryFlag from "react-country-flag";
import { IoClose, IoClipboard } from "react-icons/io5";

const Modal = ({ closeModal, tries, correctAnswer, guesses, guessedPlayersInfo }) => {
  const [timeRemaining, setTimeRemaining] = useState(getTimeUntilNextDay());
  const [isClosing, setIsClosing] = useState(false);
  const [resultDiagram, setResultDiagram] = useState("");
  const [isCopied, setIsCopied] = useState(false);

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

  const numberToEmoji = (num) => { // in results transform int string to emojis
    const digits = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
    return num.toString().split('').map(digit => digits[parseInt(digit)]).join('');
  };
  

  // Function to get the country code by name
  function getCountryCode(countryName) {
    if (countryName === "Great Britain") return "GB"; // special cases not working properly
    if (countryName === "Chinese Taipei") return "TW";
    if (!countryName) return "UN";
    return countryLookup[countryName] || 'Country not found';
  }

  // Function to calculate time remaining until the next day
  function getTimeUntilNextDay() {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Set time to midnight
    return Math.floor((tomorrow - now) / 1000); // Time remaining in seconds
  }

  // Update the countdown every second
  useEffect(() => {
    console.log(guessedPlayersInfo);
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const nextValue = prev - 1;
        if (nextValue <= 0) {
          clearInterval(timer);
          return 0;
        }
        return nextValue;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, [guessedPlayersInfo]);

  // Format time into HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return hrs + ":" + mins + ":" + secs;
  };

  const copyToClipboard = () => {
    let today = new Date();
    let resultText = `Tennisdle - ${today.toLocaleDateString('en-GB')}
    `

    const attributes = [
      { isCorrect: 'isRankCorrect', compare: 'compareRank' },
      { isCorrect: 'isAgeCorrect', compare: 'compareAge' },
      { isCorrect: 'isWeightCorrect', compare: 'compareWeight' },
      { isCorrect: 'isHeightCorrect', compare: 'compareHeight' },
      { isCorrect: 'isHandCorrect', compare: null }, // No 'compare' for this one
      { isCorrect: 'isSameNationality', compare: null } // No 'compare' for this one
    ];

    for (let i = 0; i < guessedPlayersInfo.length; i++) {
      resultText += '\n'; // separate each player scores
      if (i > 5) { // don't display everything cause long yk
        resultText += '+';
        resultText += numberToEmoji(guessedPlayersInfo.length - 5) + ' guesses';
        break;
      }
      for (let j = 0; j < attributes.length; j++) {
      const isCorrect = guessedPlayersInfo[i][attributes[j].isCorrect];
      const compare = guessedPlayersInfo[i][attributes[j].compare];

      if (isCorrect) {
        resultText += '🟩';
      } else if (compare === 'less') {
        resultText += '⬇️';
      } else if (compare === 'more') {
        resultText += '⬆️';
      } else {
        resultText += '🟥'; // Default incorrect state (for hand or nationality)
      }
    }
    }

    setResultDiagram(resultText.split('\n').slice(1).map((line, index) => <span key={index}>{line}</span>));


    if (!isCopied) {
      navigator.clipboard.writeText(resultText);
      setIsCopied(true)
    }
  };

  const close = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeModal();
    }, 2000);
  };

  return (
    <div className={styles.modal + (isClosing ? ' ' + styles.closing : '')}>
      <div className={styles.content + (isClosing ? ' ' + styles.closing : '')}>
        <IoClose onClick={() => close()} className={styles.closeIcon} />
        <span>Congrats you found!</span>
        <div className={styles.player}>
          <ReactCountryFlag countryCode={getCountryCode(correctAnswer.country)} style={{ width: '50px', height: 'unset' }} svg />
          <span>{correctAnswer.player}</span>
          <span>n° {correctAnswer.rank}</span>

        </div>
        <span>In {tries} {tries === 1 ? 'try' : 'tries'}</span>
        <div className={styles.results}>{resultDiagram}</div>
        <button className={styles.clipboard} onClick={copyToClipboard}>
          <IoClipboard></IoClipboard> 
          {isCopied ? 'Copied!' : 'Copy results'} 
        </button>


        <div className={styles.timerContainer}>
          <span>Next round in: </span>
          <span className={styles.timer}>{formatTime(timeRemaining)}</span>
        </div>
      </div>
    </div>
  );
};

export default Modal;
