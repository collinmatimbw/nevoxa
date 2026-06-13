import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const isAdmin = email.trim().toLowerCase() === 'kelly@gmail.com' && password === 'kelly';
  if (isAdmin) {
    return res.json({
      user: { id: 'admin-1', name: 'Kelly (Admin)', email, company: 'Nexora Admin', role: 'admin', plan: 'enterprise' },
      token: 'admin-1',
    });
  }

  const user = await User.findOne({ email });
  if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid credentials' });

  user.lastLogin = new Date();
  user.loginCount += 1;
  await user.save();

  res.json({
    user: { id: user._id, name: user.name, email: user.email, company: user.company, role: user.role, plan: user.plan },
    token: user._id,
  });
});

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const user = await User.create({
    name, email, password,
    company: `${name.split(' ')[0]}'s Company`,
    registeredAt: new Date(),
    lastLogin: new Date(),
    loginCount: 1,
  });

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, company: user.company, role: 'user', plan: 'free' },
    token: user._id,
  });
});

router.get('/tracked-users', async (_req, res) => {
  const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
  res.json(users);
});

router.post('/upgrade-request', async (req, res) => {
  const { email, plan } = req.body;
  await User.findOneAndUpdate({ email }, { selectedPlan: plan, paymentStatus: 'pending' });
  res.json({ ok: true });
});

router.post('/approve-payment', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.plan = user.selectedPlan;
  user.paymentStatus = 'approved';
  user.selectedPlan = 'free';
  await user.save();
  res.json({ ok: true });
});

router.post('/reject-payment', async (req, res) => {
  const { email } = req.body;
  await User.findOneAndUpdate({ email }, { paymentStatus: 'rejected', selectedPlan: 'free' });
  res.json({ ok: true });
});

router.post('/change-plan', async (req, res) => {
  const { email, plan } = req.body;
  await User.findOneAndUpdate({ email }, { plan, paymentStatus: plan === 'free' ? 'none' : 'approved', selectedPlan: 'free' });
  res.json({ ok: true });
});

export default router;
