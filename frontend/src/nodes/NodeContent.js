import React, { useState } from "react";
import styles from "./smartNode.module.css";

const NodeContent = ({ id, data, type }) => {
  const [currName, setCurrName] = useState(
    data?.inputName ||
    data?.outputName ||
    id.replace(`${type}-`, `${type.replace("custom", "").toLowerCase()}_`)
  );
  const [currType, setCurrType] = useState(data.inputType || data.outputType || "Text");
  const [currText, setCurrText] = useState(data?.text || "{{input}}");

  const handleNameChange = (e) => setCurrName(e.target.value);
  const handleTypeChange = (e) => setCurrType(e.target.value);
  const handleTextChange = (e) => setCurrText(e.target.value);

  switch (type) {
    case "customInput":
    case "customOutput":
      return <IONodeContent currName={currName} currType={currType} handleNameChange={handleNameChange} handleTypeChange={handleTypeChange} type={type} />;
    case "llm":
      return <span>This is a LLM.</span>;
    case "text":
      return <TextNodeContent currText={currText} handleTextChange={handleTextChange} />;
    default:
      return null;
  }
};

const IONodeContent = ({ currName, currType, handleNameChange, handleTypeChange, type }) => (
  <>
    <label>
      Name:
      <input type="text" value={currName} onChange={handleNameChange} className={styles.inputField} />
    </label>
    <label>
      Type:
      <select value={currType} onChange={handleTypeChange} className={styles.selectField}>
        <option value="Text">Text</option>
        <option value={type === "customInput" ? "File" : "Image"}>
          {type === "customInput" ? "File" : "Image"}
        </option>
      </select>
    </label>
  </>
);

const TextNodeContent = ({ currText, handleTextChange }) => (
  <label>
    Text:
    <textarea
      value={currText}
      onChange={handleTextChange}
      className={`${styles.inputField} ${styles.resizableTextarea}`}
      rows={Math.max(2, currText.split('\n').length)}
    />
  </label>
);

export default NodeContent;