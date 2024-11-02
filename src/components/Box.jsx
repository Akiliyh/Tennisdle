import React from "react";
import styles from './Box.module.css';
import classNames from 'classnames';

const Box = ({title, value, place, isCorrect, compare, type = "string"}) => {

  const boxClass = classNames(styles.line, {
    [styles.correct]: isCorrect,
    [styles.wrong]: !isCorrect,
    [styles.more]: compare == "more",
    [styles.less]: compare == "less",
    [styles.start]: place === "start",
    [styles.end]: place === "end",
  });

  return (
    <div className={styles.box}>
      <strong>{title}</strong>
      <div className={boxClass}>
        <span>{value}</span>
      </div>
    </div>
  )
};

export default Box;
