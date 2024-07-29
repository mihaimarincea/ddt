'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function EntryDetail() {
  const [entry, setEntry] = useState(null);
  const params = useParams();

  useEffect(() => {
    fetch(`/api/admin/entry/${params.id}`)
      .then(response => response.json())
      .then(data => setEntry(data));
  }, [params.id]);

  if (!entry) return <div>Loading...</div>;

  return (
    <div className="entry-detail">
      <h1>Entry Detail</h1>
      <h2>Company: {entry.input.companyName}</h2>
      <h3>Analysis:</h3>
      <pre>{JSON.stringify(entry.analysis, null, 2)}</pre>
      <h3>Input Data:</h3>
      <pre>{JSON.stringify(entry.input, null, 2)}</pre>
    </div>
  );
}