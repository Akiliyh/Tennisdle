import React from "react";
import styles from './Box.module.css';
import classNames from 'classnames';
import ReactCountryFlag from "react-country-flag";

const Box = ({title, value, place, isCorrect, compare, type = "string"}) => {

  const boxClass = classNames(styles.line, {
    [styles.correct]: isCorrect === true,
    [styles.wrong]: isCorrect === false,
    [styles.more]: compare == "more",
    [styles.less]: compare == "less",
    [styles.start]: place === "start",
    [styles.end]: place === "end",
    [styles.country]: type === "country",
  });

  return (
    <div className={styles.box}>
      <strong>{title}</strong>
      <div className={boxClass}>
        {type === "country" ? <ReactCountryFlag countryCode={value} style={{width: 'unset', height: 'unset',}}svg /> : <span>{value}</span>}
      </div>
    </div>
  )
};

export default Box;
