import { useState, useEffect } from 'react'
import './App.css'
import './vars.css'
import rankingsDataATP from './data/atp_ranking_data.json'
import rankingsDataWTA from './data/wta_ranking_data.json'
import Input from './components/Input'
import Guess from './components/Guess'
import Fireworks from './components/Fireworks'
import Modal from './components/Modal'

const playerNamesATP = rankingsDataATP.map(player => player.player);

const getRandomPlayer = (data) => {
  const limit = Math.min(100, data.length); // Only top 100
  const randomIndex = Math.floor(Math.random() * limit);
  return data[randomIndex];
};

const getRandomPlayerDaily = (data) => {
  const date = new Date(); // cur date new Date(2025,10,5) for testing

  const maxLimit = Math.min(100, data.length); // Limit to top 100 players

  // Generate a unique string based on the date
  const dateKey = date.getFullYear() + "-" + date.getMonth() + 1 + "-" + date.getDate();
  console.log(`Date Key: ${dateKey}`);
  console.log(dateKey.charCodeAt(dateKey.length-1));

   // Hashing mechanism to generate a seed from the date string
   let seed = 0;
   for (let i = 0; i < dateKey.length; i++) {
     if (i === dateKey.length - 1) {
       // Amplify the effect of the last character (the day of the month)
       seed = (seed * 31 + dateKey.charCodeAt(i) * 1000);
     } else {
       seed = (seed * 31 + dateKey.charCodeAt(i));
     }
   }

  // Deterministic randomness
  const prng = (seed) => {
    const a = 1664525;  // Multiplier
    const c = 1013904223; // Increment
    const m = 4294967296;  // Modulus (2^32)

    // Linear congruential generator formula
    seed = (a * seed + c) % m;
    return seed / m; // Returns a floating point number between 0 and 1
  };

  // Generate the random index
  const randomValue = prng(seed);
  const randomIndex = Math.floor(randomValue * maxLimit);  // Ensure the index is within range

  return data[randomIndex];
};



function App() {
  const [randomPlayer, setRandomPlayer] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const handleGuess = (guess) => {
    setGuesses((prevGuesses) => [...prevGuesses, guess]);
  };

  const handleGetRandomPlayer = () => {
    const player = getRandomPlayerDaily(rankingsDataATP);
    setRandomPlayer(player);
  };

  const checkGuessedPlayer = (guesses, randomPlayer) => {
    // we check the new player guessed
    if (guesses.length > 0) {
      console.log(guesses[guesses.length-1]);
      console.log(randomPlayer.player);
      if (guesses[guesses.length-1] == randomPlayer.player)
      {
        console.log("Tu as trouvé !");
        setGameOver(true);
      } 
      else {
        console.log("pas bon");
      }
    }
  };

  useEffect(() => {
    handleGetRandomPlayer();
  }, []);

  useEffect(() => {
    if (randomPlayer) {
      console.log(randomPlayer);
    }
  }, [randomPlayer]);

  // detect if random player is guessed

  useEffect(() => {
    checkGuessedPlayer(guesses, randomPlayer);
  }, [guesses, randomPlayer]);

  return (
    <>
      <Input player={playerNamesATP} handleGuess={handleGuess}></Input>
      <Guess guesses={guesses} data={rankingsDataATP} correctAnswer={randomPlayer}></Guess>

      {gameOver && 
      <>
      <Fireworks></Fireworks>
      <Modal correctAnswer={randomPlayer} guesses={guesses}></Modal>
      </>
      }
    </>
  )
}

export default App
