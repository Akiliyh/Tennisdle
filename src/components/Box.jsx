import React from "react";
import styles from './Box.module.css';
import classNames from 'classnames';
import ReactCountryFlag from "react-country-flag";

const Box = ({title, value, place, isCorrect, compare, type = "string", delay}) => {

  const boxClass = classNames(styles.line, {
    [styles.correct]: isCorrect === true,
    [styles.wrong]: isCorrect === false,
    [styles.more]: compare == "more",
    [styles.less]: compare == "less",
    [styles.start]: place === "start",
    [styles.end]: place === "end",
    [styles.country]: type === "country",
    [styles.hand]: type === "hand",
    [styles.handRight]: value === "Right",
    [styles.handLeft]: value === "Left",
  });

  value === "name"

  return (
    <div className={styles.box}>
      <strong>{title}</strong>
      <div className={boxClass} style={{animationDelay: delay + "s"}}>

        {type === "country" ? (
          <ReactCountryFlag countryCode={value} style={{ width: 'unset', height: 'unset' }} svg/>
        ) : type === "hand" ? (
          <img src="hand.svg" alt="hand" />
        ) : // Replace value with spans for each word if value === "name"
        type === "name" ? (
          value.split(' ').map((word, index) => (
            <span key={index}>{word}</span>
          ))
        ) : (
          <>
          <span>{value}</span>
          {type === "height" && <span className={styles.units}> cm</span>}
          {type === "weight" && <span className={styles.units}> kg</span>}

          </>
        )}
      </div>
    </div>
  )
};

export default Box;
