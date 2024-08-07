import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = ({ data }) => {
  const { financialMetrics, swot, potentialMeter, generalScore, keyProblems } = data.dashboardData || {};
  const analysis = data.analysis || '';

  const financialData = [
    { name: 'Revenue', value: financialMetrics?.revenue || 0 },
    { name: 'Gross Margin', value: financialMetrics?.grossMargin || 0 },
    { name: 'Net Profit', value: financialMetrics?.netProfit || 0 },
    { name: 'Burn Rate', value: financialMetrics?.burnRate || 0 },
  ];

  const swotData = [
    { name: 'Strengths', value: swot?.strengths?.length || 0 },
    { name: 'Weaknesses', value: swot?.weaknesses?.length || 0 },
    { name: 'Opportunities', value: swot?.opportunities?.length || 0 },
    { name: 'Threats', value: swot?.threats?.length || 0 },
  ];

  return (
    <div className="dashboard">
      <h2>Company Dashboard</h2>
      
      <div className="dashboard-grid">
        <div className="dashboard-item financial-metrics">
          <h3>Financial Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-item swot-analysis">
          <h3>SWOT Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={swotData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {swotData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="swot-details">
            {Object.entries(swot || {}).map(([key, values]) => (
              <div key={key} className="swot-category">
                <h4>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                <ul>
                  {Array.isArray(values) ? values.map((item, index) => (
                    <li key={index}>{item}</li>
                  )) : <li>No data available</li>}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-item potential-score">
          <h3>Potential Meter</h3>
          <div className="potential-meter">
            <div className="potential-fill" style={{ width: `${potentialMeter || 0}%` }}></div>
            <span>{potentialMeter || 0}%</span>
          </div>
          <h3>General Business Score</h3>
          <div className="score-circle">
            <span>{generalScore || 0}/100</span>
          </div>
        </div>

        <div className="dashboard-item key-problems">
          <h3>Key Problems</h3>
          <ul>
            {(keyProblems || []).length > 0 ? keyProblems.map((problem, index) => (
              <li key={index}>{problem}</li>
            )) : <li>No key problems identified</li>}
          </ul>
        </div>
      </div>

      <div className="dashboard-item analysis">
        <h3>Detailed Analysis</h3>
        <div className="analysis-content">
          <p>{analysis}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;