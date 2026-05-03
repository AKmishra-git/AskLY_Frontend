const BASE_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`)
  }

  return data
}

// Auth
export const authApi = {
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/api/auth/get-me'),
  verifyEmail: (token) => request(`/api/auth/verify-email?token=${token}`),
}

// Chats
export const chatsApi = {
  sendMessage: (body) => request('/api/chats/message', { method: 'POST', body: JSON.stringify(body) }),
  getChats: () => request('/api/chats'),
  getMessages: (chatId) => request(`/api/chats/${chatId}/messages`),
  deleteChat: (chatId) => request(`/api/chats/${chatId}`, { method: 'DELETE' }),
}
