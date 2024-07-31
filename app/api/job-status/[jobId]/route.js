import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const runtime = 'edge';

export async function GET(request, { params }) {
  const { jobId } = params;

  try {
    const jobData = await kv.get(jobId);

    if (!jobData) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const parsedJobData = JSON.parse(jobData);
    return NextResponse.json(parsedJobData);
  } catch (error) {
    console.error('Error fetching job status:', error);
    return NextResponse.json({ error: 'Failed to fetch job status' }, { status: 500 });
  }
}