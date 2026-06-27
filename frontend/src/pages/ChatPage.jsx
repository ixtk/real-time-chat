import { useMemo, useState } from 'react'
import AuthModal from '../components/AuthModal'
import Avatar from '../components/Avatar'
import ChatList from '../components/ChatList'
import MessageComposer from '../components/MessageComposer'
import MessageList from '../components/MessageList'
import { currentUser, initialChats } from '../data/mockChats'

function ChatPage() {
  const [user, setUser] = useState(null)
  const [chats, setChats] = useState(initialChats)
  const [activeChatId, setActiveChatId] = useState(initialChats[0].id)

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) ?? chats[0],
    [activeChatId, chats],
  )

  const handleSend = (text) => {
    const newMessage = {
      id: crypto.randomUUID(),
      sender: 'me',
      text,
      time: 'now',
    }

    setChats((currentChats) =>
      currentChats.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              preview: text,
              time: 'now',
              unread: 0,
              messages: [...chat.messages, newMessage],
            }
          : chat,
      ),
    )
  }

  const account = user
    ? {
        ...currentUser,
        name: user.name,
        initials: user.name.slice(0, 2).toUpperCase(),
      }
    : currentUser

  return (
    <main className="chat-shell">
      {!user && <AuthModal onAuth={setUser} />}

      <aside className="sidebar">
        <ChatList chats={chats} activeChatId={activeChat.id} onSelect={setActiveChatId} />

        <div className="account">
          <Avatar user={account} size="small" />
          <div>
            <strong>{account.name}</strong>
            <p>Active now</p>
          </div>
          <button className="signout" type="button" title="Sign out" onClick={() => setUser(null)}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      <section className="chat-main">
        <header className="conversation-header">
          <Avatar user={activeChat} />
          <div>
            <h2>{activeChat.name}</h2>
            <p>{activeChat.status === 'online' ? 'Online' : activeChat.status}</p>
          </div>
        </header>

        <MessageList chat={activeChat} />
        <MessageComposer chat={activeChat} onSend={handleSend} />
      </section>
    </main>
  )
}

export default ChatPage
