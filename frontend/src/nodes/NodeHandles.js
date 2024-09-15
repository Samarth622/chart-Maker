import React, { useState, useEffect, useCallback } from "react";
import { Handle, Position } from "reactflow";

const NodeHandles = ({ id, type, data }) => {
  switch (type) {
    case "customInput":
      return <Handle type="source" position={Position.Right} id={`${id}-value`} />;
    case "customOutput":
      return <Handle type="target" position={Position.Left} id={`${id}-value`} />;
    case "llm":
      return (
        <>
          <Handle type="target" position={Position.Left} id={`${id}-system`} style={{ top: "33%" }} />
          <Handle type="target" position={Position.Left} id={`${id}-prompt`} style={{ top: "66%" }} />
          <Handle type="source" position={Position.Right} id={`${id}-response`} />
        </>
      );
    case "text":
      return <TextNodeHandles id={id} data={data} />;
    default:
      return null;
  }
};

const TextNodeHandles = ({ id, data }) => {
  const [variables, setVariables] = useState([]);

  const updateVariables = useCallback((text) => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = [...text.matchAll(regex)];
    const newVariables = matches.map(match => match[1]);
    setVariables(newVariables);
  }, []);

  useEffect(() => {
    if (data && data.text) {
      updateVariables(data.text);
    }
  }, [data, updateVariables]);

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
};

export default NodeHandles;