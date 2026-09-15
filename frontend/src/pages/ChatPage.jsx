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
  const [message, setMessage] = useState('')

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

  async function openChat(recipient) {
    console.log("Opening chat...", recipient._id)

    const response = await api.get(`/users/${recipient._id}/loadChat`)

    // setIsChatOpen(true)
    setOpenChatUser(recipient.username)
  }

  function saveMessage(event) {
    setMessage(event.target.value)
  }

  function sendMessage() {
    console.log("Sending message", message)
    setMessage('')
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
                    className={`user-button ${openChatUser === recipient.username ? "active" : ""}`}
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
          <div className="chat-conversation">
            <header className="conversation-header">
              <span className="conversation-avatar" aria-hidden="true">
                {openChatUser.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <h2>{openChatUser}</h2>
                <p>
                  <span className="online-dot" /> Available to chat
                </p>
              </div>
            </header>

            <div className="messages">
              <div className="conversation-hint">
                Say hello to start the conversation.
              </div>
            </div>

            <div className="composer">
              <div className="composer-form">
                <textarea
                  placeholder={`Message ${openChatUser}`}
                  aria-label={`Message ${openChatUser}`}
                  rows="1"
                  value={message}
                  onChange={saveMessage}
                />
                <button
                  className="send-button"
                  type="button"
                  aria-label="Send message"
                  onClick={sendMessage}
                >
                  ↑
                </button>
              </div>
            </div>
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
