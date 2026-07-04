import Avatar from './Avatar'

function ChatList({ chats, activeChatId, onSelect }) {
  const onlineCount = chats.filter((chat) => chat.status === 'online').length

  return (
    <>
      <div className="sidebar-header">
        <h1>Messages</h1>
        <p>{onlineCount} online</p>
      </div>

      <nav className="chat-list" aria-label="Chats">
        {chats.length === 0 && (
          <p className="empty-sidebar">No registered users yet.</p>
        )}

        {chats.map((chat) => (
          <button
            className={`chat-item ${chat.id === activeChatId ? 'active' : ''}`}
            key={chat.id}
            type="button"
            onClick={() => onSelect(chat.id)}
          >
            <div className="avatar-wrap">
              <Avatar user={chat} />
              <span className={`status-dot ${chat.status}`} />
            </div>

            <div className="chat-meta">
              <div className="chat-row">
                <span className="chat-name">{chat.name}</span>
                <span className="chat-time">{chat.time}</span>
              </div>
              <p className="chat-preview">{chat.preview}</p>
            </div>

            {chat.unread > 0 && <span className="unread">{chat.unread}</span>}
          </button>
        ))}
      </nav>
    </>
  )
}

export default ChatList
