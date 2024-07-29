import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'entries.json');

// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure the entries.json file exists
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, '[]', 'utf8');
}

export function saveEntry(entry) {
  let entries = [];
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    entries = JSON.parse(data);
  } catch (error) {
    console.error('Error reading entries file:', error);
  }

  entries.push({ ...entry, id: Date.now(), timestamp: new Date().toISOString() });
  
  try {
    fs.writeFileSync(dataFile, JSON.stringify(entries, null, 2));
  } catch (error) {
    console.error('Error writing to entries file:', error);
    throw new Error('Failed to save entry');
  }
}

export function getEntries() {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading entries file:', error);
    return [];
  }
}

export function getEntryById(id) {
  const entries = getEntries();
  return entries.find(entry => entry.id === parseInt(id));
}