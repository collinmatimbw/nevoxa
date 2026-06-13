import mongoose from 'mongoose';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env from parent directory
const envPath = resolve(__dirname, '../../.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const match = line.match(/^MONGO_URI=(.+)$/);
    if (match) process.env.MONGO_URI = match[1].trim();
  }
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexora';

export let mongoOk = false;

export async function connectDB() {
  const src = process.env.MONGO_URI ? 'Render env var' : 'default fallback';
  console.log(`MONGO_URI source: ${src}`);
  console.log(`MONGO_URI value: ${MONGO_URI.replace(/\/\/.+@/, '//***:***@')}`);
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
    mongoOk = true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.warn('Server running without DB — API routes will fail with 503.');
  }
}
