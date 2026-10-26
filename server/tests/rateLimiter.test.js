import assert from 'node:assert/strict';
import { once } from 'node:events';
import express from 'express';
import test from 'node:test';
import { createApiRateLimit } from '../src/middleware/rateLimiter.js';

test('rate limit is scoped to session and returns JSON for 429', async () => {
  const app = express();
  app.use((req, _res, next) => { req.ownerSessionId = req.header('x-test-session'); next(); });
  app.use(createApiRateLimit({ windowMs: 60_000, limit: 1 }));
  app.get('/api', (_req, res) => res.json({ success: true, data: 'ok' }));
  const server = app.listen(0);
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}/api`;

  try {
    const first = await fetch(base, { headers: { 'x-test-session': 'session-a' } });
    const limited = await fetch(base, { headers: { 'x-test-session': 'session-a' } });
    const otherSession = await fetch(base, { headers: { 'x-test-session': 'session-b' } });
    assert.equal(first.status, 200);
    assert.equal(limited.status, 429);
    assert.deepEqual(await limited.json(), {
      success: false,
      error: { code: 'API_RATE_LIMIT', message: 'This session has made too many requests. Please wait briefly and try again.' }
    });
    assert.equal(otherSession.status, 200);
  } finally {
    server.close();
    await once(server, 'close');
  }
});
