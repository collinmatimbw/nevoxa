import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import PlatformData from '../models/PlatformData.js';

function wrap(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

const router = Router();

async function getOrCreate(userId) {
  let data = await PlatformData.findOne({ userId });
  if (!data) {
    data = await PlatformData.create({
      userId,
      subscription: { plan: 'business', status: 'active', billingCycle: 'monthly', seats: 1, usedSeats: 0 },
    });
  }
  return data;
}

router.get('/', requireAuth, wrap(async (req, res) => {
  const data = await getOrCreate(req.userId);
  res.json(data);
}));

router.put('/', requireAuth, wrap(async (req, res) => {
  const data = await getOrCreate(req.userId);
  const allowed = ['alerts', 'memories', 'team', 'businesses', 'activeBusinessId', 'subscription', 'automations'];
  for (const key of allowed) {
    if (req.body[key] !== undefined) data[key] = req.body[key];
  }
  await data.save();
  res.json(data);
}));

router.post('/alert/read/:id', requireAuth, wrap(async (req, res) => {
  const data = await getOrCreate(req.userId);
  const alert = data.alerts.find(a => a.id === req.params.id);
  if (alert) alert.read = true;
  await data.save();
  res.json(data);
}));

router.post('/alert/read-all', requireAuth, wrap(async (req, res) => {
  const data = await getOrCreate(req.userId);
  data.alerts.forEach(a => { a.read = true; });
  await data.save();
  res.json(data);
}));

export default router;
