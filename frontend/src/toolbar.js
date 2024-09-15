// toolbar.js

import { DraggableNode } from './draggableNode';
import styles from './toolbar.module.css';

export const PipelineToolbar = () => {
    // Available node types
    const nodeTypes = [
        { type: 'customInput', label: 'Input' },
        { type: 'llm', label: 'LLM' },
        { type: 'customOutput', label: 'Output' },
        { type: 'text', label: 'Text' }
    ];

    return (
        <div className={styles.header}>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {nodeTypes.map(node => (
                    <DraggableNode key={node.type} type={node.type} label={node.label} />
                ))}
            </div>
        </div>
    );
};