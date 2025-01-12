import React from "react";
import styles from './Fireworks.module.css';

const Fireworks = () => {
    return (
        <div className={styles.pyro}>
            <div className={styles.before}></div>
            <div className={styles.after}></div>
        </div>
    )
};

export default Fireworks;
