import assert from 'node:assert/strict';
import test from 'node:test';
import { readApiResponse } from '../src/api.js';

test('uses the server error message for JSON API failures', async () => {
  const response = new Response(JSON.stringify({ success: false, error: { message: 'Generation quota reached.' } }), { status: 429 });
  await assert.rejects(readApiResponse(response), /Generation quota reached/);
});

test('explains a non-JSON 429 instead of hiding it behind a generic request error', async () => {
  const response = new Response('Too many requests', { status: 429, headers: { 'Content-Type': 'text/plain' } });
  await assert.rejects(readApiResponse(response), /API request limit was reached/);
});

test('reports HTTP status when a server error is non-JSON', async () => {
  const response = new Response('<html>proxy error</html>', { status: 502, headers: { 'Content-Type': 'text/html' } });
  await assert.rejects(readApiResponse(response), /HTTP 502/);
});

test('returns parsed data for a successful API response', async () => {
  const response = new Response(JSON.stringify({ success: true, data: { mysteryId: 'case-1' } }), { status: 202 });
  assert.deepEqual(await readApiResponse(response), { mysteryId: 'case-1' });
});
