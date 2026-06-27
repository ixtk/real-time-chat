import Avatar from './Avatar'

function MessageList({ chat }) {
  return (
    <div className="messages">
      {chat.messages.map((message) => {
        const isMine = message.sender === 'me'

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
