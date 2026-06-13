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

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('');
    console.error('  To use MongoDB:');
    console.error('    1. Install MongoDB locally (mongod), or');
    console.error('    2. Use MongoDB Atlas (free tier):');
    console.error('       Create a .env file with:');
    console.error('       MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/nexora');
    console.error('');
    process.exit(1);
  }
}
