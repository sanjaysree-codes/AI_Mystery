import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  mysteryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mystery', required: true },
  progressId: { type: mongoose.Schema.Types.ObjectId, ref: 'InvestigationProgress', required: true },
  ownerSessionId: { type: String, required: true },
  selectedSuspectId: { type: String, required: true },
  reasoning: { type: String, maxlength: 1000, default: '' },
  isCorrect: { type: Boolean, required: true },
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });
schema.index({ mysteryId: 1, progressId: 1 }, { unique: true });
export default mongoose.model('Accusation', schema);
