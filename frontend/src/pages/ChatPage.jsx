import AccountPanel from '../components/AccountPanel'
import AuthModal from '../components/AuthModal'
import { fallbackAccount } from '../constants/currentUser'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from "react";
import api from '../api/client'

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
  const [users, setUsers] = useState([])
  // const [isChatOpen, setIsChatOpen] = useState(false)
  const [openChatUser, setOpenChatUser] = useState(null)

  async function handleLogout() {
    await signOut()
  }

  useEffect(function () {
    async function fetchUsers() {
      console.log("Fetching users from backend...")

      // 'http://localhost:5000/api/users/all-users'
      const response = await api.get("/users/all-users")

      const allUsers = response.data.users

      console.log(allUsers)

      setUsers(allUsers)
    }

    fetchUsers()
  }, [])

  function openChat(recipient) {
    console.log("Opening chat...", recipient)

    // setIsChatOpen(true)
    setOpenChatUser(recipient.username)
  }

  return (
    <main className="chat-shell">
      {!isCheckingSession && !user && <AuthModal />}

      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Users</h1>

          <ul className="user-list">
            {users.map(function (recipient) {
              const initials = recipient.username.slice(0, 2).toUpperCase()
              return (
                <li key={recipient._id || recipient.id || recipient.username}>
                  <button
                    onClick={() => openChat(recipient)}
                    className="user-button"
                  >
                    <span className="user-initials">{initials}</span>
                    <strong>{recipient.username}</strong>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <AccountPanel account={account} onLogout={handleLogout} />
      </aside>

      <section className="chat-main">
        {openChatUser !== null ? (
          <div>
            <h2>{openChatUser}</h2>
            <input type="text" />
          </div>
        ) : (
          <div className="empty-state">
            <h2>Welcome to the Chat App</h2>
            <p>Select a user from the list to start chatting.</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default ChatPage
