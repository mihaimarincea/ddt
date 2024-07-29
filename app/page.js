'use client';

import { useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import DueDiligenceForm from '../components/DueDiligenceForm';
import Dashboard from '../components/Dashboard';
import { testData } from '../utils/testData';

export default function Home() {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysis = async (answers) => {
    setIsLoading(true);
    console.log('Submitting answers to API:', answers);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      
      if (!response.ok) {
        console.error('API response not OK:', response.status, response.statusText);
        const errorData = await response.json();
        console.error('Error details:', errorData);
        throw new Error(`Analysis failed: ${errorData.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log('Received analysis from API:', data);
      
      // Ensure the data has the expected structure
      const formattedData = {
        analysis: data.analysis || '',
        dashboardData: {
          financialMetrics: data.dashboardData?.financialMetrics || {},
          swot: data.dashboardData?.swot || {},
          potentialMeter: data.dashboardData?.potentialMeter || 0,
          generalScore: data.dashboardData?.generalScore || 0,
          keyProblems: data.dashboardData?.keyProblems || [],
        },
      };
      
      setAnalysisData(formattedData);
    } catch (error) {
      console.error('Error in API call:', error);
      alert(`Failed to get analysis: ${error.message}. Check console for more details.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestCase = () => {
    handleAnalysis(testData);
  };

  return (
    <div className="container jc">
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
          <p>Analyzing your responses...</p>
        </div>
      )}
      {analysisData && <Dashboard data={analysisData} />}
    </div>
  );
}