import { create } from 'zustand'
import { authApi } from '../services/api'

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  // ✅ FIXED: safe getMe (no crash, no loop)
  fetchMe: async () => {
    try {
      set({ loading: true, error: null })

      const data = await authApi.getMe()

      // 🔥 Important safety check
      if (!data || data.success === false) {
        set({ user: null, loading: false })
        return
      }

      set({ user: data.user, loading: false })
    } catch (err) {
      console.log("User not logged in") // expected case
      set({ user: null, loading: false })
    }
  },

  // ✅ LOGIN
  login: async (credentials) => {
    set({ loading: true, error: null })
    try {
      const data = await authApi.login(credentials)

      set({ user: data.user, loading: false })
      return { success: true }
    } catch (err) {
      set({ loading: false, error: err.message })
      return { success: false, error: err.message }
    }
  },

  // ✅ REGISTER
  register: async (info) => {
    set({ loading: true, error: null })
    try {
      const data = await authApi.register(info)

      set({ loading: false })
      return { success: true }
    } catch (err) {
      set({ loading: false, error: err.message })
      return { success: false, error: err.message }
    }
  },

  // ✅ LOGOUT
  logout: () => set({ user: null }),

  clearError: () => set({ error: null }),
}))