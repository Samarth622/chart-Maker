import React, { useState } from 'react';
import { useStore } from './store';
import styles from './submit.module.css';

export const SubmitButton = () => {
    const nodes = useStore(state => state.nodes);
    const edges = useStore(state => state.edges);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            console.log('Submitting data:', { nodes, edges });
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nodes, edges }),
            });

            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Response text:', responseText);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
            }

            const data = JSON.parse(responseText);
            alert(`Pipeline Analysis:
                Number of nodes: ${data.num_nodes}
                Number of edges: ${data.num_edges}
                Is a DAG: ${data.is_dag ? 'Yes' : 'No'}`);
        } catch (error) {
            console.error('Error details:', error);
            alert(`An error occurred while submitting the pipeline: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <button 
                type="button" 
                className={styles.submitButton} 
                onClick={handleSubmit}
                disabled={isLoading}
            >
                {isLoading ? 'Submitting...' : 'Submit'}
            </button>
        </div>
    );
}