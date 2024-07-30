'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log('Dashboard component mounted');
    const fetchEntries = async () => {
      try {
        console.log('Fetching entries...');
        const response = await fetch('/api/admin/entries');
        console.log('Entries response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Entries data:', data);
          setEntries(data);
        } else {
          console.error('Failed to fetch entries');
          if (response.status === 401) {
            console.log('Unauthorized, redirecting to login');
            router.push('/admin/login');
          }
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [router]);

  console.log('Rendering dashboard, loading:', loading, 'entries:', entries);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Previous Entries</h2>
      {entries.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        <ul>
          {entries.map((entry, index) => (
            <li key={index}>
              {entry.input.companyName} - {new Date(entry.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}