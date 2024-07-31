'use client';

import { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import DueDiligenceForm from '../components/DueDiligenceForm';
import Dashboard from '../components/Dashboard';
import { testData } from '../utils/testData';

export default function Home() {
  const [jobId, setJobId] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  const handleAnalysis = async (answers) => {
    setIsLoading(true);
    setError(null);
    setStatus('Initiating analysis...');
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
      setJobId(data.jobId);
    } catch (error) {
      console.error('Error initiating analysis:', error);
      setError(`Failed to initiate analysis: ${error.message}. Please try again later.`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      const pollJobStatus = async () => {
        try {
          const response = await fetch(`/api/job-status/${jobId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          
          if (data.status === 'completed') {
            setAnalysisData(data.analysisData);
            setIsLoading(false);
          } else if (data.status === 'failed') {
            setError(`Analysis failed: ${data.error}`);
            setIsLoading(false);
          } else {
            setStatus(`Analysis in progress: ${data.status}`);
            setTimeout(pollJobStatus, 5000); // Poll every 5 seconds
          }
        } catch (error) {
          console.error('Error polling job status:', error);
          setError(`Failed to get analysis status: ${error.message}. Please try again later.`);
          setIsLoading(false);
        }
      };

      pollJobStatus();
    }
  }, [jobId]);

  const handleTestCase = () => {
    handleAnalysis(testData);
  };

  return (
    <div className="container">
      <h1>Startup Due Diligence Chat</h1>
      {!jobId && !isLoading && (
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