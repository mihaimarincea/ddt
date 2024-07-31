'use client';

import { useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import DueDiligenceForm from '../components/DueDiligenceForm';
import Dashboard from '../components/Dashboard';
import { testData } from '../utils/testData';

export default function Home() {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  const handleAnalysis = async (answers) => {
    setIsLoading(true);
    setError(null);
    setStatus('Starting analysis...');
    console.log('Submitting answers to API:', answers);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const decodedChunk = decoder.decode(value, { stream: true });
        const lines = decodedChunk.split('\n');
        
        for (const line of lines) {
          if (line.trim() !== '') {
            const data = JSON.parse(line);
            if (data.message) {
              setStatus(data.message);
            }
            if (data.analysisData) {
              setAnalysisData(data.analysisData);
              setIsLoading(false);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in API call:', error);
      setError(`Failed to get analysis: ${error.message}. Please try again later.`);
      setIsLoading(false);
    }
  };

  const handleTestCase = () => {
    handleAnalysis(testData);
  };

  return (
    <div className="container">
      <h1>Startup Due Diligence Chat</h1>
      {!analysisData && !isLoading && (
        <>
          <DueDiligenceForm onSubmit={handleAnalysis} />
          <button onClick={handleTestCase} className="test-button">
            Run Test Case
          </button>
        </>
      )}
      {isLoading && (
        <div className="loading">
          <ThreeDots color="#00BFFF" height={80} width={80} />
          <p>{status}</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      {analysisData && <Dashboard data={analysisData} />}
    </div>
  );
}