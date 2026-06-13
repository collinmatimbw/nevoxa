import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  entryId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessEntry' },
  date: String,
  profitScore: Number,
  profitScoreBreakdown: Object,
  revenueGrowth: Number,
  expenseGrowth: Number,
  profitGrowth: Number,
  profitMargin: Number,
  summary: String,
  leaks: [Object],
  focusItems: [Object],
  opportunities: [Object],
}, { timestamps: true });

export default mongoose.model('Analysis', analysisSchema);
