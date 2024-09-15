import React from "react";
import styles from "./smartNode.module.css";
import NodeHeader from "./NodeHeader";
import NodeHandles from "./NodeHandles";
import NodeContent from "./NodeContent";

const SmartNode = ({ id, data, type }) => {
  return (
    <div className={`${styles.smartNode} ${styles[type]}`}>
      <NodeHeader type={type} />
      <NodeHandles id={id} type={type} data={data} />
      <NodeContent id={id} data={data} type={type} />
    </div>
  );
};

export default SmartNode;