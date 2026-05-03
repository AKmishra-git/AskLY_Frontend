import { create } from 'zustand'
import { chatsApi } from '../services/api'


export const useChatStore = create((set, get) => ({
  chats: [],
  activeChatId: null,
  messages: [],
  loadingChats: false,
  loadingMessages: false,
  sending: false,
  error: null,
  deleteModalChatId: null,

  setActiveChatId: (id) => set({ activeChatId: id, messages: [] }),

  fetchChats: async () => {
    set({ loadingChats: true })
    try {
      const data = await chatsApi.getChats()
      set({ chats: data.chats || data, loadingChats: false })
    } catch (err) {
      set({ loadingChats: false, error: err.message })
    }
  },

  fetchMessages: async (chatId) => {
    set({ loadingMessages: true, messages: [] })
    try {
      const data = await chatsApi.getMessages(chatId)
      set({ messages: data.messages || data, loadingMessages: false })
    } catch (err) {
      set({ loadingMessages: false, error: err.message })
    }
  },

  sendMessage: async (content) => {
    const { activeChatId, messages, chats } = get()
    const userMsg = { role: 'user', content, _id: Date.now() + '_u', createdAt: new Date().toISOString() }
    set({ sending: true, messages: [...messages, userMsg] })

    try {
      const body = { message: content }
      if (activeChatId) body.chatId = activeChatId

      const data = await chatsApi.sendMessage(body)
      const newChatId = data.chatId || data.chat?._id || activeChatId

      const aiMsg = {
        role: 'assistant',
        content: data.reply || 'No response',
        _id: Date.now() + '_a',
        createdAt: new Date().toISOString(),
      }


      set((s) => ({
        sending: false,
        messages: [...s.messages, aiMsg],
        activeChatId: newChatId,
        chats: s.chats.find((c) => (c._id || c.id) === newChatId)
          ? s.chats
          : [data.chat || { _id: newChatId, title: content.slice(0, 40) }, ...s.chats],
      }))

      // Refresh sidebar chats
      get().fetchChats()
      return { success: true }
    } catch (err) {
      set((s) => ({
        sending: false,
        messages: s.messages.filter((m) => m._id !== userMsg._id),
        error: err.message,
      }))
      return { success: false, error: err.message }
    }
  },

  deleteChat: async (chatId) => {
    try {
      await chatsApi.deleteChat(chatId)
      set((s) => ({
        chats: s.chats.filter((c) => (c._id || c.id) !== chatId),
        activeChatId: s.activeChatId === chatId ? null : s.activeChatId,
        messages: s.activeChatId === chatId ? [] : s.messages,
        deleteModalChatId: null,
      }))
    } catch (err) {
      set({ error: err.message, deleteModalChatId: null })
    }
  },

  openDeleteModal: (id) => set({ deleteModalChatId: id }),
  closeDeleteModal: () => set({ deleteModalChatId: null }),
  clearError: () => set({ error: null }),
  newChat: () => set({ activeChatId: null, messages: [] }),
}))
