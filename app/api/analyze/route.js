import { NextResponse } from 'next/server';
import axios from 'axios';
import { saveEntry } from '../../../utils/dataStore';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '8mb',
  },
};

export async function POST(request) {
  console.log('API route /api/analyze called');
  try {
    const body = await request.json();
    console.log('Received request body:', body);

    // ... (rest of the code remains the same until the axios call)

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
    let analysisData;
    try {
      analysisData = JSON.parse(response.data.content[0].text);
    } catch (parseError) {
      console.error('Error parsing Claude API response:', parseError);
      console.error('Raw response:', response.data.content[0].text);
      return NextResponse.json({ 
        message: 'Error parsing AI response', 
        error: parseError.message,
        rawResponse: response.data.content[0].text.substring(0, 1000) // First 1000 characters for debugging
      }, { status: 500 });
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
      // If saving fails, we still want to return the analysis to the user
      // but we should log the error for debugging
    }

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error('Unhandled error in /api/analyze:', error);
    let errorMessage = 'Internal server error';
    let errorDetails = 'No additional details available';

    if (error.response) {
      console.error('Error response:', error.response.data);
      errorMessage = error.response.data.message || errorMessage;
      errorDetails = error.response.data.error || errorDetails;
    } else if (error.request) {
      console.error('Error request:', error.request);
      errorMessage = 'No response received from the server';
    } else {
      console.error('Error message:', error.message);
      errorMessage = error.message;
    }

    return NextResponse.json({ 
      message: errorMessage, 
      error: errorDetails
    }, { status: 500 });
  }
}