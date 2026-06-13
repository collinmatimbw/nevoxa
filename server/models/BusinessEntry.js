import mongoose from 'mongoose';

const businessEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: String,
  revenue: Number,
  expenses: Number,
  profit: Number,
  industry: String,
  employeeCount: Number,
  customerCount: Number,
  adSpend: Number,
  productCount: Number,
  topProduct: String,
  notes: String,
  currency: { type: String, default: 'USD' },
}, { timestamps: true });

export default mongoose.model('BusinessEntry', businessEntrySchema);
