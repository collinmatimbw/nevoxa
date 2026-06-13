import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  type: { type: String, enum: ['revenue', 'profit', 'expenses', 'retention', 'growth', 'custom'] },
  targetValue: Number,
  currentValue: Number,
  unit: String,
  deadline: String,
  status: { type: String, enum: ['active', 'completed', 'missed'], default: 'active' },
}, { timestamps: true });

export default mongoose.model('Goal', goalSchema);
