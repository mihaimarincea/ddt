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
      
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        // If parsing as JSON fails, try to get the response as text
        const textResponse = await response.text();
        errorData = { message: textResponse };
      }

      if (!response.ok) {
        console.error('API response not OK:', response.status, response.statusText);
        console.error('Error details:', errorData);
        throw new Error(`Analysis failed: ${errorData.message || 'Unknown error'}`);
      }
      
      console.log('Received analysis from API:', errorData);
      
      // Ensure the data has the expected structure
      const formattedData = {
        analysis: errorData.analysis || '',
        dashboardData: {
          financialMetrics: errorData.dashboardData?.financialMetrics || {},
          swot: errorData.dashboardData?.swot || {},
          potentialMeter: errorData.dashboardData?.potentialMeter || 0,
          generalScore: errorData.dashboardData?.generalScore || 0,
          keyProblems: errorData.dashboardData?.keyProblems || [],
        },
      };
      
      setAnalysisData(formattedData);
    } catch (error) {
      console.error('Error in API call:', error);
      alert(`Failed to get analysis: ${error.message}. Please try again or contact support if the problem persists.`);
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
          <p>Analyzing your responses... This may take up to a minute.</p>
        </div>
      )}
      {analysisData && <Dashboard data={analysisData} />}
    </div>
  );
}