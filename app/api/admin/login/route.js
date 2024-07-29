import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  const { username, password } = await request.json();

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    return NextResponse.json({ token });
  } else {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
}