import React from "react"
import styles from './Rules.module.css';

const Rules = ({fadeOutDesc}) => {
  return (
    <div className={fadeOutDesc ? styles.game_description + " " + styles.fade_out : styles.game_description}>
        <h2>How to Play</h2>
        <p>Try to guess the mystery tennis player of the day! Each day, a new player is randomly selected from the top 100 rankings. With every incorrect guess, you will receive clues such as the player's nationality, ranking, or playing style to help you find the correct answer!</p>
    </div>
  )
};

export default Rules;
