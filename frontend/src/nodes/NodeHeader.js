import React from "react";
import styles from "./smartNode.module.css";

const NodeHeader = ({ type }) => {
  const headerText = type.replace("custom", "").toUpperCase();
  return <div className={styles.nodeHeader}>{headerText}</div>;
};

export default NodeHeader;