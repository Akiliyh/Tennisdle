import { useState, useEffect } from 'react'
import './App.css'
import rankingsDataATP from './data/atp_ranking_data.json'
import rankingsDataWTA from './data/wta_ranking_data.json'
import Input from './components/Input' 
import Guess from './components/Guess' 

const playerNamesATP = rankingsDataATP.map(player => player.player);

const getRandomPlayer = (data) => {
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
};

function App() {
  const [randomPlayer, setRandomPlayer] = useState(null);
  const [guessPlayer, setGuessPlayer] = useState(null);

  const handleGuess = (guess) => {
    setGuessPlayer(guess);
  }

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
      <Guess guessPlayer={guessPlayer} data={rankingsDataATP} correctAnswer={randomPlayer}></Guess>
    </>
  )
}

export default App
