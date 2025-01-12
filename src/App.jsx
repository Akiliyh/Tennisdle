import { useState, useEffect } from 'react'
import './App.css'
import './vars.css'
import rankingsDataATP from './data/atp_ranking_data.json'
import rankingsDataWTA from './data/wta_ranking_data.json'
import Input from './components/Input'
import Guess from './components/Guess'
import Fireworks from './components/Fireworks'

const playerNamesATP = rankingsDataATP.map(player => player.player);

const getRandomPlayer = (data) => {
  const limit = Math.min(200, data.length); // Only top 200
  const randomIndex = Math.floor(Math.random() * limit);
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
    const player = getRandomPlayer(rankingsDataATP);
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

      {gameOver && <Fireworks></Fireworks>}
    </>
  )
}

export default App
