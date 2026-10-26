export const MAX_GEMINI_ATTEMPTS = 3;
export const RETRYABLE_GEMINI_STATUSES = new Set([429, 500, 502, 503, 504]);

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function parseDelayValue(value, numericUnit = 'seconds') {
  if (typeof value === 'number') return numericUnit === 'milliseconds' ? value : value * 1000;
  if (typeof value !== 'string') return undefined;
  const text = value.trim();
  const duration = text.match(/^(\d+(?:\.\d+)?)\s*(ms|msec|milliseconds?|s|sec|seconds?)?$/i);
  if (duration) {
    const amount = Number(duration[1]);
    const unit = (duration[2] || numericUnit).toLowerCase();
    return /^(ms|msec|milliseconds?)$/.test(unit) ? amount : amount * 1000;
  }
  const date = Date.parse(text);
  return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

function delayFromBody(bodyText) {
  let body;
  try { body = JSON.parse(bodyText); } catch { return undefined; }
  const candidates = [];
  const visit = (value) => {
    if (!value || typeof value !== 'object') return;
    for (const [key, nested] of Object.entries(value)) {
      if (/^retry.?delay(ms)?$/i.test(key) || /^retry.?after(ms)?$/i.test(key)) {
        const parsed = parseDelayValue(nested, /ms$/i.test(key) ? 'milliseconds' : 'seconds');
        if (parsed !== undefined) candidates.push(parsed);
      } else if (nested && typeof nested === 'object') visit(nested);
    }
  };
  visit(body);
  return candidates.length ? Math.max(...candidates) : undefined;
}

export function parseRetryDelay({ headers, body, message } = {}) {
  const retryAfterMs = headers?.get?.('retry-after-ms');
  if (retryAfterMs != null) {
    const parsed = parseDelayValue(retryAfterMs, 'milliseconds');
    if (parsed !== undefined) return parsed;
  }
  const retryAfter = headers?.get?.('retry-after');
  if (retryAfter != null) {
    const parsed = parseDelayValue(retryAfter);
    if (parsed !== undefined) return parsed;
  }
  const bodyDelay = body ? delayFromBody(body) : undefined;
  if (bodyDelay !== undefined) return bodyDelay;
  const match = String(message || '').match(/retry(?:ing)?\s+(?:in|after)\s+(\d+(?:\.\d+)?)\s*(ms|milliseconds?|s|seconds?)\b/i);
  return match ? parseDelayValue(`${match[1]}${match[2]}`, 'seconds') : undefined;
}

export function isRetryableGeminiError(error) {
  return error?.retryable === true || RETRYABLE_GEMINI_STATUSES.has(Number(error?.status));
}

export function getGeminiHttpStatus(error, responseStatus) {
  const sdkStatus = Number(error?.status);
  if (Number.isInteger(sdkStatus) && sdkStatus > 0) return sdkStatus;

  const capturedStatus = Number(responseStatus);
  if (Number.isInteger(capturedStatus) && capturedStatus > 0) return capturedStatus;

  // Older SDK paths can throw only a status-text message such as
  // "Retryable HTTP Error: Gateway Timeout".
  const message = String(error?.message || '').toLowerCase();
  const statusByText = [
    [504, /gateway timeout|deadline exceeded/],
    [503, /service unavailable/],
    [502, /bad gateway/],
    [500, /internal server error/],
    [429, /too many requests/]
  ];
  return statusByText.find(([, pattern]) => pattern.test(message))?.[0];
}

export async function retryGeminiRequest(operation, { wait = sleep, random = Math.random } = {}) {
  for (let attempt = 1; attempt <= MAX_GEMINI_ATTEMPTS; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      error.attempts = attempt;
      if (attempt === MAX_GEMINI_ATTEMPTS || !isRetryableGeminiError(error)) throw error;

      const exponentialDelay = 1000 * (2 ** (attempt - 1));
      const jitter = Math.floor(random() * exponentialDelay * 0.2);
      const retryAfterMs = Number(error.retryDelayMs);
      const requestedDelay = Number.isFinite(retryAfterMs) && retryAfterMs >= 0 ? retryAfterMs : 0;
      await wait(Math.max(exponentialDelay + jitter, requestedDelay));
    }
  }
}

export class InvalidGeneratedCaseError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = 'InvalidGeneratedCaseError';
    this.retryable = true;
  }
}
