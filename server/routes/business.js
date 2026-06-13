import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import BusinessEntry from '../models/BusinessEntry.js';
import Analysis from '../models/Analysis.js';
import Goal from '../models/Goal.js';

const router = Router();

function wrap(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.get('/entries', requireAuth, wrap(async (req, res) => {
  const entries = await BusinessEntry.find({ userId: req.userId }).sort({ date: -1 });
  res.json(entries);
}));

router.post('/entries', requireAuth, wrap(async (req, res) => {
  const entry = await BusinessEntry.create({ ...req.body, userId: req.userId });
  res.status(201).json(entry);
}));

router.delete('/entries/:id', requireAuth, wrap(async (req, res) => {
  await BusinessEntry.deleteOne({ _id: req.params.id, userId: req.userId });
  await Analysis.deleteOne({ entryId: req.params.id, userId: req.userId });
  res.json({ ok: true });
}));

router.get('/analyses', requireAuth, wrap(async (req, res) => {
  const analyses = await Analysis.find({ userId: req.userId }).sort({ date: -1 });
  res.json(analyses);
}));

router.post('/analyses', requireAuth, wrap(async (req, res) => {
  const analysis = await Analysis.create({ ...req.body, userId: req.userId });
  res.status(201).json(analysis);
}));

router.get('/goals', requireAuth, wrap(async (req, res) => {
  const goals = await Goal.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(goals);
}));

router.post('/goals', requireAuth, wrap(async (req, res) => {
  const goal = await Goal.create({ ...req.body, userId: req.userId });
  res.status(201).json(goal);
}));

router.put('/goals/:id', requireAuth, wrap(async (req, res) => {
  const goal = await Goal.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { new: true });
  res.json(goal);
}));

router.delete('/goals/:id', requireAuth, wrap(async (req, res) => {
  await Goal.deleteOne({ _id: req.params.id, userId: req.userId });
  res.json({ ok: true });
}));

export default router;
