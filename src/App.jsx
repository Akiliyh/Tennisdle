import { useState, useEffect } from 'react'
import './App.css'
import rankingsDataATP from './data/atp_ranking_data.json'
import rankingsDataWTA from './data/wta_ranking_data.json'
import Input from './components/Input' 

const playerNamesATP = rankingsDataATP.map(player => player.player);

const getRandomPlayer = (data) => {
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
};

function App() {
  const [randomPlayer, setRandomPlayer] = useState(null);

  const handleGetRandomPlayer = () => {
    const player = getRandomPlayer(rankingsDataATP);
    setRandomPlayer(player);
  };

  useEffect(() => {
    handleGetRandomPlayer();
  }, []);

  useEffect(() => {
    // Log randomPlayer whenever it changes
    if (randomPlayer) {
      console.log(randomPlayer);
    }
  }, [randomPlayer]); // This effect runs every time randomPlayer changes

  return (
    <>
      <Input player={playerNamesATP}></Input>
    </>
  )
}

export default App
