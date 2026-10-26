import Mystery from '../models/Mystery.js';
import { generateCase } from '../modules/ai/gemini.provider.js';
import { validateCase } from '../modules/ai/schemas.js';
import { retryGeminiRequest } from '../modules/ai/retry.js';

const evidenceCount = { short: 6, standard: 10, extended: 14 };

export async function runGeneration(mysteryId, input) {
  try {
    await Mystery.findByIdAndUpdate(mysteryId, { $set: { status: 'generating', generationProgress: 20 }, $unset: { generationError: 1, generationFailure: 1 } });
    const data = await retryGeminiRequest(async () => {
      const output = await generateCase(input);
      await Mystery.findByIdAndUpdate(mysteryId, { status: 'validating', generationProgress: 82 });
      return validateCase(output, input.suspectCount, evidenceCount[input.investigationLength]);
    });
    const publicCase = {
      title: data.title, shortDescription: data.shortDescription, briefing: data.briefing,
      genre: input.genre, difficulty: input.difficulty,
      suspects: data.suspects.map(({ privateMotive, privateKnowledge, isCulprit, ...s }) => s),
      evidence: data.evidence.map(({ privateInterpretation, clueRole, ...e }) => ({ ...e, visibility: 'discoverable' })),
      timeline: data.timeline.filter((e) => e.visibility !== 'private')
    };
    await Mystery.findByIdAndUpdate(mysteryId, {
      $set: { title: data.title, status: 'ready', generationProgress: 100, publicCase, suspects: data.suspects, evidence: data.evidence, timeline: data.timeline, solution: data.solution,
        blueprint: { keyDeductions: data.keyDeductions }, generationMetadata: { provider: 'google-gemini', model: process.env.GEMINI_MODEL, schemaVersion: 1 } },
      $unset: { generationError: 1, generationFailure: 1 }
    });
  } catch (error) {
    const failure = {
      model: process.env.GEMINI_MODEL,
      status: error.status ?? null,
      attempts: error.attempts ?? 1,
      retryDelayMs: error.retryDelayMs ?? null,
      name: error.name,
      message: error.message
    };
    console.error('Mystery generation failed:', failure);
    let message = 'We could not build a consistent case this time. Please try again with a simpler scenario.';
    if ([429, 500, 502, 503, 504].includes(Number(error.status))) {
      message = 'Gemini is temporarily busy. We tried a few times, but could not finish your case. Please wait a moment and try again.';
    } else if ([401, 403].includes(Number(error.status))) {
      message = 'Gemini could not authorize this request. Please check the server API key and Google AI Studio project access.';
    } else if (Number(error.status) === 404) {
      message = 'The configured Gemini model is unavailable to this API key. Check GEMINI_MODEL in server/.env.';
    }
    await Mystery.findByIdAndUpdate(mysteryId, { $set: { status: 'failed', generationProgress: 100, generationError: message, generationFailure: failure } });
  }
}

export function publicMystery(mystery, progress) {
  return { id: String(mystery._id), ...mystery.publicCase, status: mystery.status, createdAt: mystery.createdAt,
    generationProgress: mystery.generationProgress, investigationStatus: progress?.status || 'in_progress',
    viewedEvidenceIds: progress?.viewedEvidenceIds || [], notes: progress?.notes || [], selectedSuspectId: progress?.selectedSuspectId || null };
}
