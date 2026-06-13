const BASE = import.meta.env.DEV ? '/api' : 'https://nevoxa.onrender.com/api';

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('nexora-token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string> || {}) };
  if (token) headers['x-user-id'] = token;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

function addIdAlias(obj: any): any {
  if (Array.isArray(obj)) return obj.map(addIdAlias);
  if (obj && typeof obj === 'object') {
    if (obj._id && !obj.id) obj.id = obj._id;
    for (const val of Object.values(obj)) {
      if (val && typeof val === 'object') addIdAlias(val);
    }
  }
  return obj;
}

async function requestAndTransform(path: string, options: RequestInit = {}) {
  const data = await request(path, options);
  return addIdAlias(data);
}

export const api = {
  get: (path: string) => requestAndTransform(path),
  post: (path: string, body?: any) => requestAndTransform(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: (path: string, body?: any) => requestAndTransform(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: (path: string) => requestAndTransform(path, { method: 'DELETE' }),
};
