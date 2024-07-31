'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEntries } from '../../../utils/dataStore';

export default function AdminDashboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchEntries() {
      try {
        const fetchedEntries = await getEntries();
        setEntries(fetchedEntries);
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, []);

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