// =====================
// BASE URL BACKEND
// =====================
export const BASE_URL = 'http://localhost:4000';
// =====================
// LOGIN
// =====================
export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Login gagal');
  return res.json();
}

// =====================
// REGISTER
// =====================
export async function apiRegister(name: string, email: string, password: string, role: string) {
  const res = await fetch(`${BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!res.ok) throw new Error('Registrasi gagal');
  return res.json();
}

// =====================
// GENERIC API FETCH
// =====================
export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');

  // Headers default
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}), // TypeScript-safe
  };

  if (options.headers) {
    Object.assign(headers, options.headers as any);
  }

  const res = await fetch(BASE_URL + path, {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error(`API Error ${res.status}`);
  }

  return res.json();
}

// =====================
// GET AUTH HEADER
// =====================
export function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token');
  if (!token) return {}; // kosong kalau tidak ada token
  return { Authorization: `Bearer ${token}` }; // selalu string
}
