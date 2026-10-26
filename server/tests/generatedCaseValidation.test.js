import assert from 'node:assert/strict';
import test from 'node:test';
import { InvalidGeneratedCaseError } from '../src/modules/ai/retry.js';
import { validateCase } from '../src/modules/ai/schemas.js';

function validCase() {
  const suspects = [
    { id: 's1', name: 'Mara Vale', age: 42, occupation: 'Curator', relationshipToIncident: 'Museum curator', publicDescription: 'A careful curator.', publicMotive: 'A budget dispute.', publicAlibi: 'She was cataloguing prints.', privateMotive: 'She planned to sell a duplicate.', privateKnowledge: ['Knows the display schedule.'], isCulprit: true },
    { id: 's2', name: 'Ivo Reed', age: 16, occupation: 'Student', relationshipToIncident: 'Student at the school', publicDescription: 'A student who stayed late.', publicMotive: 'A disagreement over the school play.', publicAlibi: 'He was rehearsing in the auditorium.', privateMotive: 'He wanted to protect a friend.', privateKnowledge: ['Knows the backstage schedule.'], isCulprit: false },
    { id: 's3', name: 'Nia Sol', occupation: 'Archivist', relationshipToIncident: 'Research archivist', publicDescription: 'A visiting researcher.', publicMotive: 'A denied research request.', publicAlibi: 'She was in the reading room.', privateMotive: 'She wanted access to a ledger.', privateKnowledge: ['Knows the archive layout.'], isCulprit: false }
  ];
  const evidence = Array.from({ length: 6 }, (_, index) => ({
    id: `e${index + 1}`, title: `Exhibit ${index + 1}`, type: 'documents', description: 'A fictional case record.', source: 'Museum archive', timestamp: null,
    relatedSuspectIds: [], relatedEvidenceIds: [], privateInterpretation: 'This clue helps establish the sequence.', clueRole: index === 0 ? 'core' : 'supporting'
  }));
  return {
    title: 'The Missing Key', shortDescription: 'A key vanishes during an evening shift.', briefing: 'Three staff members had access to the desk.', genre: 'theft', difficulty: 'easy', suspects, evidence,
    timeline: [1, 2, 3].map((n) => ({ id: `t${n}`, timestamp: `9:${n}0 PM`, eventDescription: 'A staff member passed the archive desk.', location: 'Museum', involvedSuspectIds: [`s${n}`], sourceEvidenceIds: [`e${n}`], confidence: 'reported', visibility: 'discoverable' })),
    solution: { culpritSuspectId: 's1', motive: 'To conceal a duplicate.', method: 'Swapped the key tag.', opportunity: 'The curator had access during the shift.', actualTimeline: ['The key was moved.'], decisiveEvidenceIds: ['e1'], supportingEvidenceIds: ['e2'], redHerringExplanations: ['The alarm code was routine.'], innocentSuspectExplanations: ['The guard remained at the entrance.'], solutionSummary: 'The records place Mara at the desk.' },
    keyDeductions: ['The archive record contradicts the curator’s account.']
  };
}

test('accepts a suspect with missing optional age without inventing a default', () => {
  const generated = validCase();
  delete generated.suspects[0].age;
  const validated = validateCase(generated, 3, 6);
  assert.equal(Object.hasOwn(validated.suspects[0], 'age'), false);
});

test('accepts adult and school-age minor suspects', () => {
  const generated = validCase();
  const validated = validateCase(generated, 3, 6);
  assert.equal(validated.suspects[0].age, 42);
  assert.equal(validated.suspects[1].age, 16);
});

test('accepts the documented lower age boundary and null for an unknown age', () => {
  const generated = validCase();
  generated.suspects[1].age = 5;
  generated.suspects[2].age = null;
  const validated = validateCase(generated, 3, 6);
  assert.equal(validated.suspects[1].age, 5);
  assert.equal(validated.suspects[2].age, null);
});

test('rejects incorrect age data types with a field-level validation reason', () => {
  const generated = validCase();
  generated.suspects[0].age = '42';
  assert.throws(() => validateCase(generated, 3, 6), (error) => {
    assert.ok(error instanceof InvalidGeneratedCaseError);
    assert.match(error.message, /suspects\.0\.age/);
    assert.match(error.message, /received string/);
    return true;
  });
});

test('rejects non-integer ages and keeps normal generated-case validation intact', () => {
  const generated = validCase();
  generated.suspects[1].age = 27.5;
  assert.throws(() => validateCase(generated, 3, 6), /suspects\.1\.age/);
  assert.equal(validateCase(validCase(), 3, 6).solution.culpritSuspectId, 's1');
});

test('enforces the documented inclusive age range', () => {
  const generated = validCase();
  generated.suspects[0].age = 110;
  assert.equal(validateCase(generated, 3, 6).suspects[0].age, 110);

  generated.suspects[0].age = 4;
  assert.throws(() => validateCase(generated, 3, 6), /suspects\.0\.age/);
  generated.suspects[0].age = 111;
  assert.throws(() => validateCase(generated, 3, 6), /suspects\.0\.age/);
});
