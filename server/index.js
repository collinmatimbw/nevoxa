import express from 'express';
import cors from 'cors';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { connectDB } from './config/db.js';

console.log('Starting server v3 (userId string + error handler) ...');
import authRoutes from './routes/auth.js';
import businessRoutes from './routes/business.js';
import platformRoutes from './routes/platform.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/platform', platformRoutes);
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Serve built frontend in production
const distPath = resolve(__dirname, '../dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(resolve(distPath, 'index.html')));
}

// Global error handler (prevents crashes from async route errors)
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

await connectDB();
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
