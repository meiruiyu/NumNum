// src/app/api/client.ts
// Thin typed fetch wrapper around our Express backend.
//
// In dev (vite dev server) we use a RELATIVE base URL — Vite's proxy config
// (see vite.config.ts) forwards anything starting with /api to the Express
// server on :4000. This means the same code works:
//   - locally        (vite proxy → localhost:4000)
//   - on LAN         (vite proxy → host's localhost:4000)
//   - through ngrok  (vite proxy → host's localhost:4000)
//
// You can still override with VITE_API_BASE_URL if you want to point the
// frontend at a different deployed backend.

const BASE_URL =
  (import.meta.env?.VITE_API_BASE_URL as string | undefined) ?? '';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    ...init,
  });

  // Try to parse JSON body even on error — the server always returns JSON.
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // non-JSON response — leave body null
  }

  if (!res.ok) {
    const message = body?.error ?? `${res.status} ${res.statusText}`;
    throw new ApiError(message, res.status);
  }
  return body as T;
}

export const api = {
  get:   <T = any>(path: string) => request<T>(path, { method: 'GET' }),
  post:  <T = any>(path: string, body?: any) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T = any>(path: string, body?: any) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T = any>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export { BASE_URL };
