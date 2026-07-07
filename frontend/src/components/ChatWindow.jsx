import { useEffect } from 'react'
import Avatar from './Avatar'
import MessageComposer from './MessageComposer'
import MessageList from './MessageList'
import { useSocket } from '../context/SocketContext'

function ChatWindow({ chat, currentUserId, onMessage, onSend }) {
  const { getSocket } = useSocket()

  useEffect(() => {
    if (!chat?.chatId) return

    const socket = getSocket()
    if (!socket) return

    socket.emit('chat:join', chat.chatId)

    function handleIncomingMessage(payload) {
      if (payload.chatId !== chat.chatId) return

      onMessage(payload.chatId, payload.message)
    }

    socket.on('chat:message', handleIncomingMessage)

    return () => {
      socket.emit('chat:leave', chat.chatId)
      socket.off('chat:message', handleIncomingMessage)
    }
  }, [chat?.chatId, getSocket, onMessage])

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
