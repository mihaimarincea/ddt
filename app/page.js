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

  const handleAnalysis = async (answers) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${data.error || 'Unknown error'}`);
      }
      
      console.log('Received analysis data:', data);
      
      if (data.status === 'completed') {
        setAnalysisData(data.analysisData);
      } else if (data.status === 'failed') {
        throw new Error(`Analysis failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error in analysis:', error);
      setError(`Failed to get analysis: ${error.message}. Please try again later.`);
    } finally {
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
          <p>Analyzing...</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      {analysisData && <Dashboard data={analysisData} />}
    </div>
  );
}