export class HttpError extends Error { constructor(status, code, message) { super(message); this.status = status; this.code = code; } }
export function notFound(_req, res) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'That page or API route was not found.' } }); }
export function errorHandler(error, _req, res, _next) {
  if (error?.type === 'entity.too.large') return res.status(413).json({ success: false, error: { code: 'BODY_TOO_LARGE', message: 'The request is too large.' } });
  if (error instanceof HttpError) return res.status(error.status).json({ success: false, error: { code: error.code, message: error.message } });
  console.error(error);
  const status = error?.name === 'ValidationError' ? 400 : 500;
  res.status(status).json({ success: false, error: { code: status === 400 ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR', message: status === 400 ? 'The request could not be processed.' : 'Something went wrong. Please try again.' } });
}
