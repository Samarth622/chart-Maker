import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import SmartNode from './nodes/smartNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: (props) => <SmartNode {...props} type="customInput" />,
  llm: (props) => <SmartNode {...props} type="llm" />,
  customOutput: (props) => <SmartNode {...props} type="customOutput" />,
  text: (props) => <SmartNode {...props} type="text" />,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: type };
      switch (type) {
        case 'customInput':
        case 'customOutput':
          nodeData.inputName = nodeData.outputName = nodeID.replace(`${type}-`, `${type.replace('custom', '').toLowerCase()}_`);
          nodeData.inputType = nodeData.outputType = 'Text';
          break;
        case 'text':
          nodeData.text = '{{input}}';
          break;
        case 'llm':
          nodeData.text = "This is LLM Node."
          break;
      }
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
          const type = appData?.nodeType;
    
          if (typeof type === 'undefined' || !type) {
            return;
          }
    
          const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          });

          const nodeID = getNodeID(type);
          const newNode = {
            id: nodeID,
            type,
            position,
            data: getInitNodeData(nodeID, type),
          };
    
          addNode(newNode);
        },
        [reactFlowInstance, getNodeID, addNode]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <div ref={reactFlowWrapper} style={{width: '100vw', height: '70vh'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
            >
                <Background color="#aaa" gap={gridSize} />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
};