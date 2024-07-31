import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const runtime = 'edge';

export async function GET(request, { params }) {
  const { jobId } = params;

  console.log(`Fetching status for job: ${jobId}`);

  try {
    if (!kv) {
      console.error('KV store is not initialized');
      return NextResponse.json({ error: 'KV store not available', details: 'KV object is undefined' }, { status: 500 });
    }

    console.log('Attempting to get job data from KV store');
    let jobData;
    try {
      jobData = await kv.get(jobId);
    } catch (kvError) {
      console.error(`Error accessing KV store: ${kvError}`);
      return NextResponse.json({ error: 'Failed to access KV store', details: kvError.message }, { status: 500 });
    }

    console.log(`Job data retrieved: ${jobData}`);

    if (!jobData) {
      console.log(`Job not found: ${jobId}`);
      return NextResponse.json({ error: 'Job not found', jobId }, { status: 404 });
    }

    // If jobData is already an object, return it directly
    if (typeof jobData === 'object' && jobData !== null) {
      return NextResponse.json(jobData);
    }

    // If jobData is a string, try to parse it
    try {
      const parsedData = JSON.parse(jobData);
      return NextResponse.json(parsedData);
    } catch (parseError) {
      console.error(`Error parsing job data: ${parseError}`);
      return NextResponse.json({ error: 'Invalid job data', details: parseError.message, rawData: jobData }, { status: 500 });
    }
  } catch (error) {
    console.error(`Unexpected error fetching job status: ${error}`);
    return NextResponse.json({ error: 'Failed to fetch job status', details: error.message, stack: error.stack }, { status: 500 });
  }
}