import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

export const runtime = 'edge'; // Optional: Use Edge runtime

export async function POST(request) {
  console.log('Login API called');
  
  try {
    const { username, password } = await request.json();
    console.log('Received credentials:', { username, password: '****' });

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {
      console.error('Missing environment variables');
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      console.log('Credentials valid, generating token');
      const token = sign({ username }, JWT_SECRET, { expiresIn: '1h' });
      console.log('Token generated:', token);
      
      const response = NextResponse.json({ token, message: 'Login successful' });
      response.cookies.set('admin_token', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        maxAge: 3600 
      });
      
      console.log('Token set in cookie');
      return response;
    } else {
      console.log('Invalid credentials');
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}