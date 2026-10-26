import assert from 'node:assert/strict';
import test from 'node:test';
import { getGeminiHttpStatus, isRetryableGeminiError, parseRetryDelay, retryGeminiRequest } from '../src/modules/ai/retry.js';

test('only the selected temporary Gemini HTTP statuses are retryable', () => {
  for (const status of [429, 500, 502, 503, 504]) assert.equal(isRetryableGeminiError({ status }), true);
  for (const status of [400, 401, 403, 404, 501]) assert.equal(isRetryableGeminiError({ status }), false);
});

test('retries at most three total requests with exponential delays', async () => {
  const waits = [];
  let calls = 0;
  let finalError;
  await assert.rejects(retryGeminiRequest(async () => {
    calls += 1;
    throw Object.assign(new Error('temporarily unavailable'), { status: 503 });
  }, { wait: async (ms) => waits.push(ms), random: () => 0 }), (error) => {
    finalError = error;
    return /temporarily unavailable/.test(error.message);
  });
  assert.equal(calls, 3);
  assert.equal(finalError.attempts, 3);
  assert.deepEqual(waits, [1000, 2000]);
});

test('respects a server retry delay when it exceeds the exponential delay', async () => {
  const waits = [];
  let calls = 0;
  const result = await retryGeminiRequest(async () => {
    calls += 1;
    if (calls === 1) throw Object.assign(new Error('busy'), { status: 503, retryDelayMs: 3500 });
    return 'ok';
  }, { wait: async (ms) => waits.push(ms), random: () => 0 });
  assert.equal(result, 'ok');
  assert.deepEqual(waits, [3500]);
});

test('does not retry non-retryable errors', async () => {
  let calls = 0;
  await assert.rejects(retryGeminiRequest(async () => {
    calls += 1;
    throw Object.assign(new Error('invalid API key'), { status: 401 });
  }, { wait: async () => assert.fail('must not wait') }), /invalid API key/);
  assert.equal(calls, 1);
});

test('parses retry delay from standard headers and Google RetryInfo details', () => {
  assert.equal(parseRetryDelay({ headers: new Headers({ 'retry-after-ms': '2750' }) }), 2750);
  assert.equal(parseRetryDelay({ headers: new Headers({ 'retry-after': '3' }) }), 3000);
  assert.equal(parseRetryDelay({ body: JSON.stringify({ error: { details: [{ retryDelay: '4.5s' }] } }) }), 4500);
  assert.equal(parseRetryDelay({ message: 'Please retry in 2 seconds.' }), 2000);
});

test('recovers the 504 status from the SDK Gateway Timeout error shape', () => {
  const sdkError = new Error('Retryable HTTP Error: Gateway Timeout');
  const status = getGeminiHttpStatus(sdkError);
  assert.equal(status, 504);
  assert.equal(isRetryableGeminiError({ ...sdkError, status }), true);
});

test('prefers the captured HTTP response status over an unhelpful SDK error', () => {
  const sdkError = new Error('Request failed');
  assert.equal(getGeminiHttpStatus(sdkError, 504), 504);
});
