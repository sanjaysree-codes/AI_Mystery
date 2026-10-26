import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  mysteryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mystery', required: true },
  ownerSessionId: { type: String, required: true },
  viewedEvidenceIds: { type: [String], default: [] },
  notes: { type: [{ id: String, text: String, createdAt: Date, updatedAt: Date }], default: [] },
  selectedSuspectId: String,
  status: { type: String, enum: ['in_progress', 'completed', 'abandoned'], default: 'in_progress' },
  revealedAt: Date,
  startedAt: { type: Date, default: Date.now },
  completedAt: Date
}, { timestamps: true });
schema.index({ ownerSessionId: 1, mysteryId: 1 }, { unique: true });
export default mongoose.model('InvestigationProgress', schema);
