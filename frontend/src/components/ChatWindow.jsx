import Avatar from './Avatar'
import MessageComposer from './MessageComposer'
import MessageList from './MessageList'

function ChatWindow({ chat, currentUserId, onSend }) {
  if (!chat) return null

  return (
    <>
      <header className="conversation-header">
        <Avatar user={chat} />
        <div>
          <h2>{chat.name}</h2>
          <p>{chat.status === 'online' ? 'Online' : chat.status}</p>
        </div>
      </header>

      <MessageList chat={chat} currentUserId={currentUserId} />
      <MessageComposer chat={chat} onSend={onSend} disabled={!chat.chatId} />
    </>
  )
}

export default ChatWindow
