const API_BASE = 'http://localhost:5000/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('owner_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('owner_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('owner_token');
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'An API error occurred');
  }

  return data as T;
}
