import { useEffect, useState } from 'react'
import Avatar from './Avatar'
import MessageComposer from './MessageComposer'
import MessageList from './MessageList'
import { useSocket } from '../context/SocketContext'

function ChatWindow({ chat, currentUserId, onMessage, onSend }) {
  const { socket } = useSocket()
  const [isPeerTyping, setIsPeerTyping] = useState(false)

  useEffect(() => {
    setIsPeerTyping(false)

    if (!chat?.chatId || !socket) return

    socket.emit('chat:join', chat.chatId)

    function handleIncomingMessage(payload) {
      if (payload.chatId !== chat.chatId) return

      onMessage(payload.chatId, payload.message)
    }

    function handleTyping(payload) {
      if (payload.chatId !== chat.chatId) return
      if (payload.userId === currentUserId) return

      setIsPeerTyping(payload.isTyping)
    }

    socket.on('chat:message', handleIncomingMessage)
    socket.on('chat:typing', handleTyping)

    return () => {
      socket.emit('chat:typing', { chatId: chat.chatId, isTyping: false })
      socket.emit('chat:leave', chat.chatId)
      socket.off('chat:message', handleIncomingMessage)
      socket.off('chat:typing', handleTyping)
    }
  }, [chat?.chatId, currentUserId, socket, onMessage])

  function startTyping() {
    if (!chat?.chatId || !socket) return

    socket.emit('chat:typing', { chatId: chat.chatId, isTyping: true })
  }

  function stopTyping() {
    if (!chat?.chatId || !socket) return

    socket.emit('chat:typing', { chatId: chat.chatId, isTyping: false })
  }

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

      <MessageList chat={chat} currentUserId={currentUserId} isTyping={isPeerTyping} />
      <MessageComposer
        key={chat.chatId}
        chat={chat}
        onSend={onSend}
        onTypingStart={startTyping}
        onTypingStop={stopTyping}
        disabled={!chat.chatId}
      />
    </>
  )
}

export default ChatWindow
