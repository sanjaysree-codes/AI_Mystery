import mongoose from 'mongoose';

const mysterySchema = new mongoose.Schema({
  ownerSessionId: { type: String, required: true, index: true },
  title: { type: String, required: true, maxlength: 120 },
  scenario: { type: String, required: true, maxlength: 2000 },
  genre: { type: String, required: true },
  difficulty: { type: String, required: true },
  investigationLength: { type: String, required: true },
  status: { type: String, enum: ['generating', 'validating', 'ready', 'failed', 'archived'], default: 'generating', index: true },
  generationProgress: { type: Number, default: 5 },
  generationError: { type: String, select: false },
  generationFailure: { type: mongoose.Schema.Types.Mixed, select: false },
  publicCase: { type: mongoose.Schema.Types.Mixed, default: {} },
  solution: { type: mongoose.Schema.Types.Mixed, default: {}, select: false },
  blueprint: { type: mongoose.Schema.Types.Mixed, default: {}, select: false },
  suspects: { type: [mongoose.Schema.Types.Mixed], default: [] },
  evidence: { type: [mongoose.Schema.Types.Mixed], default: [] },
  timeline: { type: [mongoose.Schema.Types.Mixed], default: [] },
  generationMetadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true, minimize: false });

mysterySchema.index({ ownerSessionId: 1, createdAt: -1 });
export default mongoose.model('Mystery', mysterySchema);
