import React, { useState, useEffect, useCallback } from "react";
import { Handle, Position } from "reactflow";
import styles from "./smartNode.module.css";

const SmartNode = ({ id, data, type }) => {
  const [currName, setCurrName] = useState(
    data?.inputName ||
      data?.outputName ||
      id.replace(`${type}-`, `${type.replace("custom", "").toLowerCase()}_`)
  );
  const [currType, setCurrType] = useState(
    data.inputType || data.outputType || "Text"
  );
  const [currText, setCurrText] = useState(data?.text || "{{input}}");
  const [variables, setVariables] = useState([]);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setCurrType(e.target.value);
  };

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  const updateVariables = useCallback((text) => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = [...text.matchAll(regex)];
    const newVariables = matches.map(match => match[1]);
    setVariables(newVariables);
  }, []);

  useEffect(() => {
    if (type === "text") {
      updateVariables(currText);
    }
  }, [currText, type, updateVariables]);

  const renderContent = () => {
    switch (type) {
      case "customInput":
      case "customOutput":
        return (
          <>
            <label>
              Name:
              <input
                type="text"
                value={currName}
                onChange={handleNameChange}
                className={styles.inputField}
              />
            </label>
            <label>
              Type:
              <select
                value={currType}
                onChange={handleTypeChange}
                className={styles.selectField}
              >
                <option value="Text">Text</option>
                <option value={type === "customInput" ? "File" : "Image"}>
                  {type === "customInput" ? "File" : "Image"}
                </option>
              </select>
            </label>
          </>
        );
      case "llm":
        return <span>This is a LLM.</span>;
      case "text":
        return (
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
      default:
        return null;
    }
  };

  const renderHandles = () => {
    switch (type) {
      case "customInput":
        return (
          <Handle type="source" position={Position.Right} id={`${id}-value`} />
        );
      case "customOutput":
        return (
          <Handle type="target" position={Position.Left} id={`${id}-value`} />
        );
      case "llm":
        return (
          <>
            <Handle
              type="target"
              position={Position.Left}
              id={`${id}-system`}
              style={{ top: `${100 / 3}%` }}
            />
            <Handle
              type="target"
              position={Position.Left}
              id={`${id}-prompt`}
              style={{ top: `${200 / 3}%` }}
            />
            <Handle
              type="source"
              position={Position.Right}
              id={`${id}-response`}
            />
          </>
        );
      case "text":
        return (
          <>
            <Handle type="source" position={Position.Right} id={`${id}-output`} />
            {variables.map((variable, index) => (
              <Handle
                key={variable}
                type="target"
                position={Position.Left}
                id={`${id}-${variable}`}
                style={{ top: `${(index + 1) * 20}px` }}
              />
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.smartNode}>
      <div className={styles.nodeHeader}>
        {type.replace("custom", "").toUpperCase()}
      </div>
      {renderHandles()}
      <div>
        <span>{type.replace("custom", "").toUpperCase()}</span>
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default SmartNode;