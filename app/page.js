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
      
      const data = await response.json();
      console.log('Received analysis from API:', data);
      setAnalysisData(data);
    } catch (error) {
      console.error('Error in API call:', error);
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
          <p>Analyzing your responses... This may take up to 2 minutes.</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      {analysisData && <Dashboard data={analysisData} />}
    </div>
  );
}