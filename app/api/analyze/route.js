import { NextResponse } from 'next/server';
import axios from 'axios';
import { saveEntry } from '../../../utils/dataStore';


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
      
      Respond ONLY with the following JSON format, without any additional text before or after:
      {
        "analysis": "Your full analysis here as a single string",
        "dashboardData": {
          "financialMetrics": {
            "revenue": 0,
            "grossMargin": 0,
            "netProfit": 0,
            "burnRate": 0
          },
          "swot": {
            "strengths": ["1", "2", "3"],
            "weaknesses": ["1", "2", "3"],
            "opportunities": ["1", "2", "3"],
            "threats": ["1", "2", "3"]
          },
          "potentialMeter": 0,
          "generalScore": 0,
          "keyProblems": ["1", "2", "3"]
        }
      }

      Ensure all fields are present, using null for unknown numeric values and empty arrays for unknown lists.
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
        }
      }
    );

    console.log('Received response from Claude API');
    let analysisData;
    try {
      // Try to parse the entire response
      analysisData = JSON.parse(response.data.content[0].text);
    } catch (parseError) {
      console.error('Error parsing entire Claude API response:', parseError);
      
      // If parsing fails, try to extract and parse only the JSON part
      const jsonMatch = response.data.content[0].text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          analysisData = JSON.parse(jsonMatch[0]);
        } catch (secondParseError) {
          console.error('Error parsing extracted JSON:', secondParseError);
          throw new Error('Failed to parse Claude API response');
        }
      } else {
        console.error('No valid JSON found in Claude API response');
        throw new Error('No valid JSON found in Claude API response');
      }
    }

    console.log('Parsed analysis data:', analysisData);

    console.log('Parsed analysis data:', analysisData);

    // Save the entry
    try {
      saveEntry({
        input: body,
        analysis: analysisData
      });
    } catch (saveError) {
      console.error('Error saving entry:', saveError);
      // If saving fails, we still want to return the analysis to the user
      // but we should log the error for debugging
    }

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error('Unhandled error in /api/analyze:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}