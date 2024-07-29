import { NextResponse } from 'next/server';
import { getEntryById } from '../../../../../utils/dataStore';

export async function GET(request, { params }) {
  const entry = getEntryById(params.id);
  if (entry) {
    return NextResponse.json(entry);
  } else {
    return NextResponse.json({ message: 'Entry not found' }, { status: 404 });
  }
}