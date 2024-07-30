'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      console.log('Redirecting to dashboard...');
      console.log('Cookies:', document.cookie);
      router.push('/admin/dashboard');
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Login attempt with:', { username, password });
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response status:', response.status);
      
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        // Handle non-JSON response
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Unexpected response from server');
      }
      
      console.log('Response data:', data);

      if (response.ok) {
        console.log('Login successful, setting cookie');
        document.cookie = `admin_token=${data.token}; path=/; max-age=3600; SameSite=Strict; Secure`;
        console.log('Cookie set:', document.cookie);
        setIsLoggedIn(true);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="admin-login">
      <h1>Admin Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}