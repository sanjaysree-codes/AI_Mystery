export async function readApiResponse(response) {
  const rawBody = await response.text();
  let body;
  try { body = rawBody ? JSON.parse(rawBody) : null; } catch { body = null; }

  if (!response.ok) {
    const message = body?.error?.message || (response.status === 429
      ? 'The API request limit was reached. Please wait briefly and try again.'
      : `The server returned HTTP ${response.status}. Please try again shortly.`);
    throw new Error(message);
  }
  if (!body?.success) {
    throw new Error(body?.error?.message || `The server returned an invalid response (HTTP ${response.status}). Please try again shortly.`);
  }
  return body.data;
}

export async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`/api/v1${path}`, { credentials: 'include', ...options, headers: { 'Content-Type': 'application/json', ...options.headers } });
  } catch (error) {
    throw new Error('Could not connect to the Mystery Room API. Make sure the backend is running, then try again.', { cause: error });
  }
  return readApiResponse(response);
}
export const api = {
  list: () => request('/mysteries'), create: (data) => request('/mysteries', { method: 'POST', body: JSON.stringify(data) }),
  status: (id) => request(`/mysteries/${id}/status`), get: (id) => request(`/mysteries/${id}`), result: (id) => request(`/mysteries/${id}/result`),
  evidence: (id, evidenceId) => request(`/mysteries/${id}/evidence/${evidenceId}`), progress: (id, data) => request(`/mysteries/${id}/progress`, { method: 'PATCH', body: JSON.stringify(data) }),
  accuse: (id, data) => request(`/mysteries/${id}/accusations`, { method: 'POST', body: JSON.stringify(data) }), reveal: (id) => request(`/mysteries/${id}/reveal`, { method: 'POST', body: '{}' }),
  remove: (id) => request(`/mysteries/${id}`, { method: 'DELETE' })
};
