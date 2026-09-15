const BASE = '/api';

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore non-JSON error body
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getExpenses: () => request('/expenses'),
  createExpense: (expense) =>
    request('/expenses', { method: 'POST', body: JSON.stringify(expense) }),
  deleteExpense: (id) => request(`/expenses/${id}`, { method: 'DELETE' }),
  getStats: () => request('/stats'),
};
