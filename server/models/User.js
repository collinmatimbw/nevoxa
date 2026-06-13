import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  company: String,
  plan: { type: String, enum: ['free', 'pro', 'business', 'enterprise'], default: 'free' },
  paymentStatus: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
  selectedPlan: { type: String, enum: ['free', 'pro', 'business', 'enterprise'], default: 'free' },
  registeredAt: { type: Date, default: Date.now },
  lastLogin: Date,
  loginCount: { type: Number, default: 0 },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
