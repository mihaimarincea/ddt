import { NextResponse } from 'next/server';
import { getEntries } from '../../../../utils/dataStore';

export async function GET() {
  const entries = getEntries();
  return NextResponse.json(entries);
}