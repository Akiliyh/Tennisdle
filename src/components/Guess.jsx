import React from "react"
import { useState, useEffect } from "react"

const Guess = ({guessPlayer, data, correctAnswer}) => {

    const [playerInfo, setPlayerInfo] = useState(data.find(player => player.player === guessPlayer));
    const [isPlayerFound, setIsPlayerFound] = useState(false);
    const [compareAge, setCompareAge] = useState("x");
    const [compareRank, setCompareRank] = useState("x");
    const [IsSameNationality , setIsSameNationality] = useState(false);

    useEffect(() => {
        setPlayerInfo(data.find(player => player.player === guessPlayer));
      }, [guessPlayer, data]);

    useEffect(() => {
        if (!isPlayerFound && playerInfo != undefined) {
            if (playerInfo.age > correctAnswer.age) {
                setCompareAge("<");
            }
            if (playerInfo.age === correctAnswer.age) {
                setCompareAge("=");
            }
            if (playerInfo.age < correctAnswer.age) {
                setCompareAge(">");
            }
            if (playerInfo.rank > correctAnswer.rank) {
                setCompareRank("<");
            }
            if (playerInfo.rank === correctAnswer.rank) {
                setCompareRank("=");
            }
            if (playerInfo.rank < correctAnswer.rank) {
                setCompareRank(">");
            }
            if (playerInfo.country === correctAnswer.country) {
                setIsSameNationality(true);
            } else {
                setIsSameNationality(false);
            }
        }
      }, [guessPlayer, correctAnswer, playerInfo]);

    useEffect(() => {
        if (guessPlayer != null) {

        if (guessPlayer === correctAnswer.player) {
          console.log("bien");
          setIsPlayerFound(true);
        } else {
            console.log("c'est pas ça");
            setIsPlayerFound(false);
        }
    }
      }, [guessPlayer, correctAnswer]);

  return (
    <div>
        {playerInfo && 
        <div>
            <p><strong>Player:</strong> {playerInfo.player}{isPlayerFound ? "oui" : "x"}</p>
            <p><strong>Rank:</strong> {playerInfo.rank}{compareRank}</p>
            <p><strong>Age:</strong> {playerInfo.age}{compareAge}</p>
            <p><strong>Country:</strong> {playerInfo.country}{IsSameNationality ? "oui" : "non"}</p>
            <p><strong>Points:</strong> {playerInfo.points}{compareRank}</p>
          </div> 
          }
    </div>
  )
};

export default Guess;
