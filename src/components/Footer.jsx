import React from "react"
import styles from './Footer.module.css';

const Footer = (props) => {
  return (
    <footer className={styles.footer}>
        <p>Data sourced from <a href="https://www.atptour.com/" target="_blank" rel="noopener noreferrer">ATP Tour</a></p>
    </footer>
  )
};

export default Footer;
