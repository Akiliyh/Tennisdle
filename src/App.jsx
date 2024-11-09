import { useState, useEffect } from 'react'
import './App.css'
import './vars.css'
import rankingsDataATP from './data/atp_ranking_data.json'
import rankingsDataWTA from './data/wta_ranking_data.json'
import Input from './components/Input' 
import Guess from './components/Guess' 

const playerNamesATP = rankingsDataATP.map(player => player.player);

const getRandomPlayer = (data) => {
  const limit = Math.min(200, data.length); // Only top 200
  const randomIndex = Math.floor(Math.random() * limit);
  return data[randomIndex];
};

function App() {
  const [randomPlayer, setRandomPlayer] = useState(null);
  const [guesses, setGuesses] = useState([]);

  const handleGuess = (guess) => {
    setGuesses((prevGuesses) => [...prevGuesses, guess]);
  };

  const handleGetRandomPlayer = () => {
    const player = getRandomPlayer(rankingsDataATP);
    setRandomPlayer(player);
  };

  useEffect(() => {
    handleGetRandomPlayer();
  }, []);

  useEffect(() => {
    if (randomPlayer) {
      console.log(randomPlayer);
    }
  }, [randomPlayer]);

  return (
    <>
      <Input player={playerNamesATP} handleGuess={handleGuess}></Input>
      <Guess guesses={guesses} data={rankingsDataATP} correctAnswer={randomPlayer}></Guess>
    </>
  )
}

export default App
