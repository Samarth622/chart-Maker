// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      set((state) => {
        const newNodes = applyNodeChanges(changes, state.nodes);
        
        const updatedEdges = state.edges.map(edge => {
          const sourceNode = newNodes.find(node => node.id === edge.source);
          if (sourceNode && sourceNode.type === 'text') {
            const text = sourceNode.data.text || '';
            const variables = (text.match(/\{\{(\w+)\}\}/g) || []).map(v => v.slice(2, -2));
            if (!variables.includes(edge.sourceHandle.replace(`${edge.source}-`, ''))) {
              return null;
            }
          }
          return edge;
        }).filter(Boolean);
    
        return { nodes: newNodes, edges: updatedEdges };
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
  
          return node;
        }),
      });
    },
  }));
