import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import businessRoutes from './routes/business.js';
import platformRoutes from './routes/platform.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/platform', platformRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

await connectDB();
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
