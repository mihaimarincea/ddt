import { NextResponse } from 'next/server';
import { getEntries } from '../../../../utils/dataStore';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  console.log('GET /api/admin/entries called');
  
  // Verify the token
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    console.log('No token found');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    verify(token, JWT_SECRET);
    console.log('Token verified successfully');
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  // If token is valid, return the entries
  const entries = getEntries();
  console.log('Returning entries:', entries.length);
  return NextResponse.json(entries);
}