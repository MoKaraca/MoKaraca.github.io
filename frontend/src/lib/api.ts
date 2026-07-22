const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`API GET ${endpoint} failed`);
    return res.json();
  },
  
  post: async (endpoint: string, body?: any) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`API POST ${endpoint} failed`);
    return res.json();
  },

  patch: async (endpoint: string, body?: any) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`API PATCH ${endpoint} failed`);
    return res.json();
  },

  delete: async (endpoint: string) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`API DELETE ${endpoint} failed`);
    return res.json();
  }
};
