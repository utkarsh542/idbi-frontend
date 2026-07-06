const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getCustomers = async () => {
  const res = await fetch(`${API_BASE}/customers`);
  if (!res.ok) throw new Error('Failed to fetch customers');
  return res.json();
};

export const getCustomerMetrics = async (customerId) => {
  const res = await fetch(`${API_BASE}/customers/${customerId}/metrics`);
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return res.json();
};

export const getChatHistory = async (customerId) => {
  const res = await fetch(`${API_BASE}/advisor/chat/${customerId}`);
  if (!res.ok) throw new Error('Failed to fetch chat history');
  return res.json();
};

export const sendChatMessage = async (customerId, message) => {
  const res = await fetch(`${API_BASE}/advisor/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_id: customerId, message })
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
};

export const clearChatHistory = async (customerId) => {
  const res = await fetch(`${API_BASE}/advisor/chat/${customerId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to clear history');
  return res.json();
};
