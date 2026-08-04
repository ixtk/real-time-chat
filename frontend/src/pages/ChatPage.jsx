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

  return (
    <main className="chat-shell">
      {!isCheckingSession && !user && <AuthModal />}

      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Users</h1>

          <ul className="empty-sidebar">
            {users.map(function (u) {
              return (
                <li>
                  <button>{u.username}</button>
                </li>
              )
            })}
          </ul>

        </div>

        <AccountPanel account={account} onLogout={handleLogout} />
      </aside>

      <section className="chat-main">
        <div className="empty-state">
          Next step: create a backend users route and show registered users in
          the sidebar.
        </div>
      </section>
    </main>
  )
}

export default ChatPage
