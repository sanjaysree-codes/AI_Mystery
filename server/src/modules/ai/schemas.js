import { z } from 'zod';
import { InvalidGeneratedCaseError } from './retry.js';

const suspect = z.object({
  id: z.string().min(1), name: z.string().min(1), age: z.number().int().min(5).max(110).optional().nullable(),
  occupation: z.string(), relationshipToIncident: z.string(), publicDescription: z.string(), publicMotive: z.string(), publicAlibi: z.string(),
  privateMotive: z.string(), privateKnowledge: z.array(z.string()), isCulprit: z.boolean()
});
const evidence = z.object({
  id: z.string().min(1), title: z.string(), type: z.enum(['messages','images','cctv','documents','witness_statements','physical_evidence','timeline_events']),
  description: z.string(), source: z.string(), timestamp: z.string().nullable().optional(), relatedSuspectIds: z.array(z.string()), relatedEvidenceIds: z.array(z.string()).default([]),
  privateInterpretation: z.string(), clueRole: z.enum(['core','supporting','red_herring'])
});
const event = z.object({ id: z.string(), timestamp: z.string(), eventDescription: z.string(), location: z.string(), involvedSuspectIds: z.array(z.string()), sourceEvidenceIds: z.array(z.string()), confidence: z.enum(['confirmed','reported','inferred']), visibility: z.enum(['public','discoverable','private']) });
export const caseSchema = z.object({
  title: z.string().min(1).max(120), shortDescription: z.string(), briefing: z.string(), genre: z.string(), difficulty: z.string(),
  suspects: z.array(suspect).min(3).max(6), evidence: z.array(evidence).min(6).max(14), timeline: z.array(event).min(3),
  solution: z.object({ culpritSuspectId: z.string(), motive: z.string(), method: z.string(), opportunity: z.string(), actualTimeline: z.array(z.string()), decisiveEvidenceIds: z.array(z.string()).min(1), supportingEvidenceIds: z.array(z.string()), redHerringExplanations: z.array(z.string()), innocentSuspectExplanations: z.array(z.string()), solutionSummary: z.string() }),
  keyDeductions: z.array(z.string()).min(1)
});

export function validateCase(data, expectedSuspects, expectedEvidence) {
  const result = caseSchema.safeParse(data);
  if (!result.success) {
    const details = result.error.issues.slice(0, 4).map((issue) => {
      const path = issue.path.join('.') || 'case';
      return `${path}: ${issue.message}`;
    });
    throw new InvalidGeneratedCaseError(`Generated case did not match the required structure: ${details.join('; ')}`);
  }
  const c = result.data;
  const unique = (items) => new Set(items).size === items.length;
  const suspectIds = c.suspects.map((s) => s.id);
  const evidenceIds = c.evidence.map((e) => e.id);
  if (c.suspects.length !== expectedSuspects || c.evidence.length < expectedEvidence) throw new InvalidGeneratedCaseError('Generated case did not meet the selected case size.');
  if (!unique(suspectIds) || !unique(evidenceIds)) throw new InvalidGeneratedCaseError('Generated case contains duplicate IDs.');
  if (c.suspects.filter((s) => s.isCulprit).length !== 1 || !suspectIds.includes(c.solution.culpritSuspectId)) throw new InvalidGeneratedCaseError('Generated case must contain exactly one valid culprit.');
  if (c.suspects.find((s) => s.id === c.solution.culpritSuspectId)?.isCulprit !== true) throw new InvalidGeneratedCaseError('Culprit and private solution disagree.');
  for (const e of c.evidence) if (e.relatedSuspectIds.some((id) => !suspectIds.includes(id)) || e.relatedEvidenceIds.some((id) => !evidenceIds.includes(id))) throw new InvalidGeneratedCaseError('Evidence contains an invalid case reference.');
  for (const t of c.timeline) if (t.involvedSuspectIds.some((id) => !suspectIds.includes(id)) || t.sourceEvidenceIds.some((id) => !evidenceIds.includes(id))) throw new InvalidGeneratedCaseError('Timeline contains an invalid case reference.');
  if (c.solution.decisiveEvidenceIds.some((id) => !evidenceIds.includes(id))) throw new InvalidGeneratedCaseError('Solution references missing evidence.');
  return c;
}
