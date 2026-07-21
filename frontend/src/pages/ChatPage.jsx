import AccountPanel from '../components/AccountPanel'
import AuthModal from '../components/AuthModal'
import { fallbackAccount } from '../constants/currentUser'
import { useAuth } from '../context/AuthContext'

function buildAccount(user) {
  if (!user) return fallbackAccount

  return {
    ...fallbackAccount,
    name: user.username,
    initials: user.username.slice(0, 2).toUpperCase(),
  }
}

function ChatPage() {
  const { user, isCheckingSession, signOut } = useAuth()
  const account = buildAccount(user)

  async function handleLogout() {
    await signOut()
  }

  return (
    <main className="chat-shell">
      {!isCheckingSession && !user && <AuthModal />}

      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Users</h1>
          <p>Next exercise</p>
        </div>

        <div className="empty-sidebar">
          Load registered users here.
        </div>

        <AccountPanel account={account} onLogout={handleLogout} />
      </aside>

      <section className="chat-main">
        <div className="empty-state">
          Next step: create a backend users route and show registered users in the sidebar.
        </div>
      </section>
    </main>
  )
}

export default ChatPage
