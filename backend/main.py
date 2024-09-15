from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import networkx as nx

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow your frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# ... rest of your code remains the same

class Node(BaseModel):
    id: str
    type: str
    data: Dict

class Edge(BaseModel):
    id: str
    source: str
    target: str

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
async def parse_pipeline(pipeline: Pipeline):
    try:
        print("Received pipeline data:", pipeline)
        
        # Create a directed graph
        G = nx.DiGraph()

        # Add nodes
        for node in pipeline.nodes:
            G.add_node(node.id)

        # Add edges
        for edge in pipeline.edges:
            G.add_edge(edge.source, edge.target)

        # Calculate number of nodes and edges
        num_nodes = G.number_of_nodes()
        num_edges = G.number_of_edges()

        # Check if the graph is a DAG
        is_dag = nx.is_directed_acyclic_graph(G)

        result = {
            "num_nodes": num_nodes,
            "num_edges": num_edges,
            "is_dag": is_dag
        }
        print("Returning result:", result)
        return result
    except Exception as e:
        print("Error occurred:", str(e))
        raise HTTPException(status_code=400, detail=str(e))