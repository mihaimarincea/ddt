import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

export const runtime = 'edge';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request) {
  console.log('Login API called');
  
  try {
    const { username, password } = await request.json();
    console.log('Received credentials:', { username, password: '****' });

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      console.log('Credentials valid, generating token');
      
      const token = await new SignJWT({ username })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(JWT_SECRET);
      
      console.log('Token generated');
      
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