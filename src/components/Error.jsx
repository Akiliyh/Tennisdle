import React from "react"
import styles from './Error.module.css';
import { IoInformationCircle } from "react-icons/io5";

const Error = () => {
  return (
    <div className={styles.error}>
      <span>This player doesn't exist!</span>
      <IoInformationCircle></IoInformationCircle>
    </div>
  )
};

export default Error;
