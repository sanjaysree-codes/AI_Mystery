import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { rateLimit } from 'express-rate-limit';
import Mystery from '../models/Mystery.js';
import Progress from '../models/InvestigationProgress.js';
import Accusation from '../models/Accusation.js';
import { runGeneration } from '../services/mystery.service.js';
import { publicMystery } from '../services/mystery.service.js';
import { HttpError } from '../middleware/errors.js';

const router = Router();
const generationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  keyGenerator: (req) => req.ownerSessionId,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({ success: false, error: { code: 'GENERATION_LIMIT', message: 'You have reached the case creation limit. Try again later.' } })
});
const createSchema = z.object({ title: z.string().trim().max(120).optional().default(''), scenario: z.string().trim().min(20).max(2000), genre: z.enum(['theft','missing_object','disappearance','murder_mystery','corporate_espionage','general_detective']), difficulty: z.enum(['easy','medium','hard']), suspectCount: z.coerce.number().int().min(3).max(6), investigationLength: z.enum(['short','standard','extended']) });
const validId = (id) => mongoose.isValidObjectId(id);
const owned = async (id, owner, { ready = false, includeSolution = false, includeGenerationError = false } = {}) => {
  if (!validId(id)) throw new HttpError(400, 'INVALID_ID', 'The case ID is invalid.');
  const query = Mystery.findOne({ _id: id, ownerSessionId: owner });
  if (includeSolution) query.select('+solution');
  if (includeGenerationError) query.select('+generationError');
  const mystery = await query;
  if (!mystery) throw new HttpError(404, 'MYSTERY_NOT_FOUND', 'This investigation is unavailable.');
  if (ready && mystery.status !== 'ready') throw new HttpError(409, 'MYSTERY_NOT_READY', 'This case is not ready yet.');
  return mystery;
};
async function progressFor(mystery, owner) { return Progress.findOneAndUpdate({ mysteryId: mystery._id, ownerSessionId: owner }, { $setOnInsert: { mysteryId: mystery._id, ownerSessionId: owner } }, { upsert: true, new: true }); }
function asyncRoute(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }

router.post('/', generationLimiter, asyncRoute(async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'INVALID_INPUT', 'Check the scenario and selected case settings.');
  const input = parsed.data;
  const mystery = await Mystery.create({ ownerSessionId: req.ownerSessionId, title: input.title || 'Untitled Investigation', scenario: input.scenario, genre: input.genre, difficulty: input.difficulty, investigationLength: input.investigationLength, status: 'generating' });
  res.status(202).json({ success: true, data: { mysteryId: String(mystery._id), status: 'generating' } });
  setImmediate(() => runGeneration(mystery._id, input));
}));

router.get('/', asyncRoute(async (req, res) => {
  const cases = await Mystery.find({ ownerSessionId: req.ownerSessionId, status: { $ne: 'archived' } }).sort({ createdAt: -1 }).limit(50);
  const ids = cases.map((c) => c._id);
  const progress = await Progress.find({ ownerSessionId: req.ownerSessionId, mysteryId: { $in: ids } }).lean();
  const byId = new Map(progress.map((p) => [String(p.mysteryId), p]));
  res.json({ success: true, data: cases.map((c) => ({ id: String(c._id), title: c.title, genre: c.genre, difficulty: c.difficulty, status: c.status, createdAt: c.createdAt, investigationStatus: byId.get(String(c._id))?.status || 'in_progress' })) });
}));

router.get('/:id/status', asyncRoute(async (req, res) => { const m = await owned(req.params.id, req.ownerSessionId, { includeGenerationError: true }); res.json({ success: true, data: { mysteryId: String(m._id), status: m.status, progress: m.generationProgress, message: m.status === 'failed' ? m.generationError : undefined } }); }));

router.get('/:id/result', asyncRoute(async (req, res) => {
  const m = await owned(req.params.id, req.ownerSessionId, { ready: true, includeSolution: true });
  const p = await progressFor(m, req.ownerSessionId);
  const accusation = await Accusation.findOne({ mysteryId: m._id, ownerSessionId: req.ownerSessionId });
  if (!accusation && !p.revealedAt) throw new HttpError(403, 'RESULT_LOCKED', 'Submit a final accusation or choose to reveal the solution first.');
  const culprit = m.suspects.find((s) => s.id === m.solution.culpritSuspectId);
  const selected = accusation ? m.suspects.find((s) => s.id === accusation.selectedSuspectId) : null;
  const solution = m.solution.toObject?.() || m.solution;
  res.json({ success: true, data: { selectedSuspect: selected ? { id: selected.id, name: selected.name } : null, culprit: { id: culprit.id, name: culprit.name }, isCorrect: accusation?.isCorrect ?? null, score: accusation?.score ?? null, solution, evidence: m.evidence.filter((e) => [...solution.decisiveEvidenceIds, ...solution.supportingEvidenceIds].includes(e.id)).map(({ id, title, description, privateInterpretation }) => ({ id, title, description, interpretation: privateInterpretation })), timeline: m.timeline.filter((e) => e.visibility === 'private') } });
}));

router.get('/:id', asyncRoute(async (req, res) => { const m = await owned(req.params.id, req.ownerSessionId, { ready: true }); const p = await progressFor(m, req.ownerSessionId); res.json({ success: true, data: publicMystery(m, p) }); }));

router.get('/:id/suspects/:suspectId', asyncRoute(async (req, res) => { const m = await owned(req.params.id, req.ownerSessionId, { ready: true }); const s = m.publicCase.suspects.find((x) => x.id === req.params.suspectId); if (!s) throw new HttpError(404, 'SUSPECT_NOT_FOUND', 'Suspect not found.'); res.json({ success: true, data: s }); }));
router.get('/:id/evidence/:evidenceId', asyncRoute(async (req, res) => { const m = await owned(req.params.id, req.ownerSessionId, { ready: true }); const e = m.publicCase.evidence.find((x) => x.id === req.params.evidenceId); if (!e) throw new HttpError(404, 'EVIDENCE_NOT_FOUND', 'Evidence not found.'); const p = await progressFor(m, req.ownerSessionId); if (!p.viewedEvidenceIds.includes(e.id)) { p.viewedEvidenceIds.push(e.id); await p.save(); } res.json({ success: true, data: e }); }));

router.patch('/:id/progress', asyncRoute(async (req, res) => {
  const m = await owned(req.params.id, req.ownerSessionId, { ready: true });
  const schema = z.object({ viewedEvidenceId: z.string().optional(), selectedSuspectId: z.string().optional(), note: z.object({ action: z.enum(['add','edit','delete']), id: z.string().optional(), text: z.string().trim().max(2000).optional() }).optional() });
  const body = schema.safeParse(req.body); if (!body.success) throw new HttpError(400, 'INVALID_INPUT', 'The progress update is invalid.');
  const p = await progressFor(m, req.ownerSessionId); const d = body.data;
  if (d.viewedEvidenceId) { if (!m.evidence.some((e) => e.id === d.viewedEvidenceId)) throw new HttpError(400, 'INVALID_EVIDENCE', 'That clue does not belong to this case.'); if (!p.viewedEvidenceIds.includes(d.viewedEvidenceId)) p.viewedEvidenceIds.push(d.viewedEvidenceId); }
  if (d.selectedSuspectId) { if (!m.suspects.some((s) => s.id === d.selectedSuspectId)) throw new HttpError(400, 'INVALID_SUSPECT', 'That suspect does not belong to this case.'); p.selectedSuspectId = d.selectedSuspectId; }
  if (d.note) { const { action, id, text } = d.note; if (action === 'add') { if (!text) throw new HttpError(400, 'NOTE_REQUIRED', 'Write a note first.'); p.notes.push({ id: randomUUID(), text, createdAt: new Date(), updatedAt: new Date() }); } else { const note = p.notes.find((n) => n.id === id); if (!note) throw new HttpError(404, 'NOTE_NOT_FOUND', 'Note not found.'); if (action === 'delete') p.notes = p.notes.filter((n) => n.id !== id); else { if (!text) throw new HttpError(400, 'NOTE_REQUIRED', 'Write a note first.'); note.text = text; note.updatedAt = new Date(); } } }
  await p.save(); res.json({ success: true, data: { viewedEvidenceIds: p.viewedEvidenceIds, selectedSuspectId: p.selectedSuspectId, notes: p.notes } });
}));

router.post('/:id/accusations', asyncRoute(async (req, res) => {
  const m = await owned(req.params.id, req.ownerSessionId, { ready: true, includeSolution: true });
  const parsed = z.object({ suspectId: z.string().min(1), reasoning: z.string().trim().max(1000).optional().default('') }).safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'INVALID_INPUT', 'Select a suspect before submitting.');
  const suspect = m.suspects.find((s) => s.id === parsed.data.suspectId); if (!suspect) throw new HttpError(400, 'INVALID_SUSPECT', 'That suspect does not belong to this case.');
  const p = await progressFor(m, req.ownerSessionId);
  if (await Accusation.exists({ mysteryId: m._id, progressId: p._id })) throw new HttpError(409, 'ACCUSATION_FINAL', 'Your final accusation has already been submitted.');
  const isCorrect = parsed.data.suspectId === m.solution.culpritSuspectId;
  const accusation = await Accusation.create({ mysteryId: m._id, progressId: p._id, ownerSessionId: req.ownerSessionId, selectedSuspectId: parsed.data.suspectId, reasoning: parsed.data.reasoning, isCorrect, score: isCorrect ? 100 : 0 });
  p.status = 'completed'; p.completedAt = new Date(); await p.save();
  res.status(201).json({ success: true, data: { accusationId: String(accusation._id), isCorrect, resultUrl: `/mystery/${m._id}/result` } });
}));

router.post('/:id/reveal', asyncRoute(async (req, res) => { const m = await owned(req.params.id, req.ownerSessionId, { ready: true }); const p = await progressFor(m, req.ownerSessionId); if (await Accusation.exists({ mysteryId: m._id, progressId: p._id })) throw new HttpError(409, 'ACCUSATION_FINAL', 'A final accusation is already recorded.'); p.revealedAt = new Date(); p.status = 'completed'; p.completedAt = new Date(); await p.save(); res.json({ success: true, data: { resultUrl: `/mystery/${m._id}/result` } }); }));

router.delete('/:id', asyncRoute(async (req, res) => { const m = await owned(req.params.id, req.ownerSessionId); await Promise.all([Progress.deleteMany({ mysteryId: m._id, ownerSessionId: req.ownerSessionId }), Accusation.deleteMany({ mysteryId: m._id, ownerSessionId: req.ownerSessionId }), m.deleteOne()]); res.json({ success: true, data: { deleted: true } }); }));

export default router;
