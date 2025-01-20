import React from "react"
import styles from './Modal.module.css';

const Modal = ({correctAnswer, guesses}) => {
  return (
    <div className={styles.modal}>
        <div className={styles.content}>
            <span>Congrats you found!</span>
            <span>{correctAnswer.player}</span>
        
        </div>
    </div>
  )
};

export default Modal;
