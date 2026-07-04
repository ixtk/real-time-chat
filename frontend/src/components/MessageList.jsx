import Avatar from './Avatar'

function MessageList({ chat, currentUserId }) {
  return (
    <div className="messages">
      {chat.messages.map((message) => {
        const senderId =
          typeof message.sender === 'object' ? message.sender.id || message.sender._id : message.sender
        const isMine = senderId === currentUserId

        return (
          <article className={`message ${isMine ? 'mine' : ''}`} key={message.id}>
            {isMine ? <div className="avatar small" /> : <Avatar user={chat} size="small" />}

            <div className="message-content">
              <div className="bubble">{message.text}</div>
              <span className="message-time">{message.time}</span>
            </div>
          </article>
        )
      })}

      {chat.typing && (
        <div className="typing">
          <Avatar user={chat} size="small" />
          <div className="typing-bubble" aria-label={`${chat.name} is typing`}>
            <span />
            <span />
            <span />
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageList
