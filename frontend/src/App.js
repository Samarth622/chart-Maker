import React from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.appContainer}>
      <div className={styles.toolbarContainer}>
        <PipelineToolbar />
      </div>
      <div className={styles.pipelineContainer}>
        <PipelineUI />
      </div>
      <div className={styles.submitButtonContainer}>
        <SubmitButton />
      </div>
    </div>
  );
}

export default App;