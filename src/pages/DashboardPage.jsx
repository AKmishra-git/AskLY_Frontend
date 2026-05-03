import Sidebar from '../components/layout/Sidebar'
import ChatArea from '../components/chat/ChatArea'
import DeleteModal from '../components/ui/DeleteModal'

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden dark:bg-surface-950 bg-surface-50">
      <Sidebar />
      <ChatArea />
      <DeleteModal />
    </div>
  )
}
