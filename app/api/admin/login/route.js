import { NextResponse } from 'next/server';
import axios from 'axios';
import { saveEntry } from '../../../utils/dataStore';

export const runtime = 'edge'; // Optional: Use Edge runtime

export async function POST(request) {
  console.log('API route /api/analyze called');
  try {
    const body = await request.json();
    console.log('Received request body:', body);

    const prompt = `
      Analyze the following startup due diligence information and provide a concise response:
      ${JSON.stringify(body, null, 2)}
      
      Provide a brief analysis covering:
      1. Company Overview
      2. Product and Market Fit
      3. Competitive Landscape
      4. Financial Health
      5. Team and Execution
      6. Growth Potential
      7. Overall Assessment
      
      Also provide the following data for a dashboard:
      1. Financial Metrics (Revenue, Gross Margin, Net Profit, Burn Rate)
      2. SWOT Analysis (2-3 points each)
      3. Potential Meter (a percentage)
      4. General Business Score (out of 100)
      5. Key Problems (top 3)

      Be concise but critical in your analysis. Highlight key strengths and risks.
    `;

    console.log('Sending request to Claude API');
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-opus-20240229',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        timeout: 60000 // 60 seconds timeout
      }
    );

    console.log('Received response from Claude API');
    const rawResponse = response.data.content[0].text;
    console.log('Raw response:', rawResponse);

    // Attempt to extract JSON from the response
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    let analysisData;
    if (jsonMatch) {
      try {
        analysisData = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('Error parsing extracted JSON:', parseError);
      }
    }

    if (!analysisData) {
      // If JSON parsing fails, create a structured response from the text
      analysisData = {
        analysis: rawResponse,
        dashboardData: {
          financialMetrics: {
            revenue: null,
            grossMargin: null,
            netProfit: null,
            burnRate: null
          },
          swot: {
            strengths: [],
            weaknesses: [],
            opportunities: [],
            threats: []
          },
          potentialMeter: null,
          generalScore: null,
          keyProblems: []
        }
      };
    }

    console.log('Parsed analysis data:', analysisData);

    // Save the entry
    try {
      saveEntry({
        input: body,
        analysis: analysisData
      });
    } catch (saveError) {
      console.error('Error saving entry:', saveError);
    }

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error('Unhandled error in /api/analyze:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    return NextResponse.json({ 
      message: 'Internal server error', 
      error: error.message,
      details: error.response?.data || 'No additional details available'
    }, { status: 500 });
  }
}