import { create } from 'zustand'
import { authApi } from '../services/api'

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  fetchMe: async () => {
    try {
      set({ loading: true, error: null })
      const data = await authApi.getMe()
      set({ user: data.user || data, loading: false })
    } catch {
      set({ user: null, loading: false })
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null })
    try {
      const data = await authApi.login(credentials)
      set({ user: data.user || data, loading: false })
      return { success: true }
    } catch (err) {
      set({ loading: false, error: err.message })
      return { success: false, error: err.message }
    }
  },

  register: async (info) => {
    set({ loading: true, error: null })
    try {
      await authApi.register(info)
      set({ loading: false })
      return { success: true }
    } catch (err) {
      set({ loading: false, error: err.message })
      return { success: false, error: err.message }
    }
  },

  logout: () => set({ user: null }),
  clearError: () => set({ error: null }),
}))
