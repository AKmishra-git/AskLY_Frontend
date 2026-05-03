import { Trash2, X } from 'lucide-react'
import { useChatStore } from '../../store/chatStore'

export default function DeleteModal() {
  const { deleteModalChatId, deleteChat, closeDeleteModal } = useChatStore()

  if (!deleteModalChatId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 dark:bg-surface-850 bg-white p-6 shadow-2xl animate-slide-up">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-xl bg-red-500/10">
            <Trash2 size={20} className="text-red-400" />
          </div>
          <button
            onClick={closeDeleteModal}
            className="p-1 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 hover:bg-black/5 text-white/40 dark:text-white/40 text-gray-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <h3 className="font-semibold text-lg mb-1 dark:text-white text-gray-900">Delete conversation?</h3>
        <p className="text-sm dark:text-white/50 text-gray-500 mb-6">
          This action cannot be undone. The conversation and all its messages will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={closeDeleteModal}
            className="flex-1 py-2.5 rounded-xl border dark:border-white/10 border-gray-200 dark:text-white/70 text-gray-600 text-sm font-medium hover:dark:bg-white/5 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteChat(deleteModalChatId)}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
