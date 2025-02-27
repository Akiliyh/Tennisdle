import React from "react";
import styles from "./Button.module.css";
import { IoClipboard } from "react-icons/io5";

const Button = ({ classname, func, icon, content }) => {
  const buttonClass = classname && styles[classname] ? styles[classname] : ""; // Ensures the class exists

  return (
    <button className={buttonClass} onClick={func}>
      {icon && <IoClipboard />}
      {content}
    </button>
  );
};

export default Button;
