import Avatar from './Avatar'

function ChatList({ chats, activeChatId, totalUnread, onSelect }) {
  const onlineCount = chats.filter((chat) => chat.status === 'online').length

  return (
    <>
      <div className="sidebar-header">
        <div className="sidebar-title">
          <h1>Messages</h1>
          {totalUnread > 0 && <span className="total-unread">{totalUnread}</span>}
        </div>
        <p>{onlineCount} online</p>
      </div>

      <nav className="chat-list" aria-label="Chats">
        {chats.length === 0 && (
          <p className="empty-sidebar">No registered users yet.</p>
        )}

        {chats.map((chat) => (
          <button
            className={`chat-item ${chat.id === activeChatId ? 'active' : ''} ${
              chat.unread > 0 ? 'has-unread' : ''
            }`}
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
