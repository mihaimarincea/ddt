import { kv } from '@vercel/kv';

export async function saveEntry(entry) {
  const entries = await getEntries();
  const newEntry = { ...entry, id: Date.now(), timestamp: new Date().toISOString() };
  entries.push(newEntry);
  await kv.set('entries', JSON.stringify(entries));
}

export async function getEntries() {
  const entries = await kv.get('entries');
  return entries ? JSON.parse(entries) : [];
}

export async function getEntryById(id) {
  const entries = await getEntries();
  return entries.find(entry => entry.id === parseInt(id));
}