const BASE_URL = import.meta.env.VITE_API_URL

async function request(path, options = {}) {
  const url = `${BASE_URL.replace(/\/$/, '')}${path}`

  console.log("API CALL:", url) // debug

  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  let data

  try {
    data = await res.json()
  } catch {
    // 🔥 handle non-JSON safely
    console.error("Invalid JSON response")
    return { success: false }
  }

  // 🔥 DO NOT THROW (important)
  if (!res.ok) {
    return {
      success: false,
      message: data.message || `Error ${res.status}`,
    }
  }

  return data
}

// ✅ AUTH APIs
export const authApi = {
  register: (body) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getMe: () =>
    request('/api/auth/get-me'),

  verifyEmail: (token) =>
    request(`/api/auth/verify-email?token=${token}`),
}

// ✅ CHAT APIs
export const chatsApi = {
  sendMessage: (body) =>
    request('/api/chats/message', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getChats: () =>
    request('/api/chats'),

  getMessages: (chatId) =>
    request(`/api/chats/${chatId}/messages`),

  deleteChat: (chatId) =>
    request(`/api/chats/${chatId}`, {
      method: 'DELETE',
    }),
}