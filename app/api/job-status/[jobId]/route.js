import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const runtime = 'edge';

export async function GET(request, { params }) {
  const { jobId } = params;

  console.log(`Fetching status for job: ${jobId}`);

  try {
    if (!kv) {
      console.error('KV store is not initialized');
      return NextResponse.json({ error: 'KV store not available' }, { status: 500 });
    }

    const jobData = await kv.get(jobId);
    console.log(`Job data retrieved: ${JSON.stringify(jobData)}`);

    if (!jobData) {
      console.log(`Job not found: ${jobId}`);
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    let parsedJobData;
    try {
      parsedJobData = JSON.parse(jobData);
    } catch (parseError) {
      console.error(`Error parsing job data: ${parseError}`);
      return NextResponse.json({ error: 'Invalid job data' }, { status: 500 });
    }

    return NextResponse.json(parsedJobData);
  } catch (error) {
    console.error(`Error fetching job status: ${error}`);
    return NextResponse.json({ error: 'Failed to fetch job status', details: error.message }, { status: 500 });
  }
}