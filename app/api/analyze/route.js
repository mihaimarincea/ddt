import { NextResponse } from 'next/server';

export const runtime = 'edge';

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
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API responded with status: ${response.status}`);
    }

    console.log('Received response from Claude API');
    const data = await response.json();
    const rawResponse = data.content[0].text;
    console.log('Raw response from Claude:', rawResponse);

    const analysisData = parseResponse(rawResponse);
    console.log('Parsed analysis data:', analysisData);

    return NextResponse.json({ status: 'completed', analysisData });
  } catch (error) {
    console.error('Error in analysis:', error);
    return NextResponse.json({ 
      status: 'failed', 
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
}

function parseResponse(rawResponse) {
  try {
    const analysis = rawResponse;
    const dashboardData = {
      financialMetrics: { revenue: 0, grossMargin: 0, netProfit: 0, burnRate: 0 },
      swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
      potentialMeter: 0,
      generalScore: 0,
      keyProblems: []
    };

    // Parse Financial Metrics
    const financialMetricsMatch = rawResponse.match(/Financial Metrics:\s*- Revenue: \$(\d+)M\s*- Gross Margin: (\d+)%\s*- Net Profit: -?\$(\d+)K\s*- Burn Rate: \$(\d+)K\/month/);
    if (financialMetricsMatch) {
      dashboardData.financialMetrics = {
        revenue: parseFloat(financialMetricsMatch[1]) * 1000000,
        grossMargin: parseFloat(financialMetricsMatch[2]),
        netProfit: -parseFloat(financialMetricsMatch[3]) * 1000,
        burnRate: parseFloat(financialMetricsMatch[4]) * 1000
      };
    }

    // Parse SWOT Analysis
    const swotMatch = rawResponse.match(/SWOT Analysis:([\s\S]*?)3\. Potential Meter/);
    if (swotMatch) {
      const swotText = swotMatch[1];
      ['strengths', 'weaknesses', 'opportunities', 'threats'].forEach(category => {
        const categoryMatch = swotText.match(new RegExp(`${category.charAt(0).toUpperCase() + category.slice(1)}:(.+)`));
        if (categoryMatch) {
          dashboardData.swot[category] = categoryMatch[1].split(',').map(item => item.trim());
        }
      });
    }

    // Parse Potential Meter
    const potentialMeterMatch = rawResponse.match(/Potential Meter: (\d+)%/);
    if (potentialMeterMatch) {
      dashboardData.potentialMeter = parseInt(potentialMeterMatch[1]);
    }

    // Parse General Business Score
    const scoreMatch = rawResponse.match(/General Business Score: (\d+)\/100/);
    if (scoreMatch) {
      dashboardData.generalScore = parseInt(scoreMatch[1]);
    }

    // Parse Key Problems
    const keyProblemsMatch = rawResponse.match(/Key Problems:([\s\S]*?)$/);
    if (keyProblemsMatch) {
      dashboardData.keyProblems = keyProblemsMatch[1].split('\n')
        .map(line => line.trim())
        .filter(line => line.match(/^\d+\./))
        .map(line => line.replace(/^\d+\.\s*/, ''));
    }

    return { analysis, dashboardData };
  } catch (error) {
    console.error('Error parsing Claude response:', error);
    throw error;
  }
}