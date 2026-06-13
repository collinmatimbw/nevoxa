import mongoose from 'mongoose';

const platformDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  alerts: [Object],
  memories: [Object],
  team: [Object],
  activityLog: [Object],
  businesses: [Object],
  activeBusinessId: String,
  subscription: {
    plan: { type: String, enum: ['free', 'pro', 'business', 'enterprise'], default: 'business' },
    status: { type: String, enum: ['active', 'trial', 'cancelled', 'past_due'], default: 'active' },
    billingCycle: { type: String, enum: ['monthly', 'annual'], default: 'monthly' },
    currentPeriodEnd: String,
    seats: { type: Number, default: 1 },
    usedSeats: { type: Number, default: 0 },
  },
  automations: [Object],
}, { timestamps: true });

export default mongoose.model('PlatformData', platformDataSchema);
