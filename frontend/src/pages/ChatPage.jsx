import { useCallback, useEffect, useState } from 'react'
import { createChat, sendMessage } from '../api/chatApi'
import { getRegisteredUsers } from '../api/userApi'
import AccountPanel from '../components/AccountPanel'
import AuthModal from '../components/AuthModal'
import ChatList from '../components/ChatList'
import ChatWindow from '../components/ChatWindow'
import { fallbackAccount } from '../constants/currentUser'
import { useAuth } from '../context/AuthContext'
import {
  buildAccount,
  mapMessage,
  mapMessages,
  mapUsersToChats,
} from '../utils/chatHelpers'

function updateChat(chats, chatId, updates) {
  return chats.map((chat) => (chat.id === chatId ? { ...chat, ...updates } : chat))
}

function EmptyChatState({ isBusy, hasUsers }) {
  if (isBusy) {
    return <div className="empty-state">Loading...</div>
  }

  return (
    <div className="empty-state">
      {hasUsers ? 'Select a user to create a chat.' : 'No registered users to message yet.'}
    </div>
  )
}

function ChatPage() {
  const { user, isCheckingSession, signOut } = useAuth()
  const [chats, setChats] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [isCreatingChat, setIsCreatingChat] = useState(false)

  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? null
  const account = buildAccount(user, fallbackAccount)
  const isBusy = isLoadingUsers || isCreatingChat

  useEffect(() => {
    if (!user) {
      setChats([])
      setActiveChatId(null)
      return
    }

    loadUsers()
  }, [user])

  async function loadUsers() {
    setIsLoadingUsers(true)

    try {
      const users = await getRegisteredUsers()
      setChats(mapUsersToChats(users))
      setActiveChatId(null)
    } catch (_error) {
      setChats([])
      setActiveChatId(null)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  async function handleSelectUser(receiverId) {
    setIsCreatingChat(true)

    try {
      const selectedChat = await createChat(receiverId)
      const updates = {
        chatId: selectedChat.id,
        preview: 'Chat created',
        time: 'now',
        messages: mapMessages(selectedChat.messages),
      }

      setChats((currentChats) => updateChat(currentChats, receiverId, updates))
      setActiveChatId(receiverId)
    } catch (_error) {
      setChats((currentChats) =>
        updateChat(currentChats, receiverId, { preview: 'Could not create chat' }),
      )
    } finally {
      setIsCreatingChat(false)
    }
  }

  async function handleSend(text) {
    if (!activeChat?.chatId) return

    const savedMessage = await sendMessage(activeChat.chatId, text)
    addMessageToChat(activeChat.chatId, savedMessage)
  }

  const addMessageToChat = useCallback((chatId, message) => {
    const newMessage = mapMessage(message)

    setChats((currentChats) =>
      currentChats.map((chat) => {
        if (chat.chatId !== chatId) return chat

        const hasMessage = chat.messages.some((item) => item.id === newMessage.id)
        if (hasMessage) return chat

        return {
          ...chat,
          preview: newMessage.text,
          time: 'now',
          unread: 0,
          messages: [...chat.messages, newMessage],
        }
      }),
    )
  }, [])

  const handleSocketMessage = useCallback((chatId, message) => {
    addMessageToChat(chatId, message)
  }, [addMessageToChat])

  async function handleLogout() {
    await signOut()
    setChats([])
    setActiveChatId(null)
  }

  return (
    <main className="chat-shell">
      {!isCheckingSession && !user && <AuthModal />}

      <aside className="sidebar">
        <ChatList chats={chats} activeChatId={activeChat?.id} onSelect={handleSelectUser} />
        <AccountPanel account={account} onLogout={handleLogout} />
      </aside>

      <section className="chat-main">
        {activeChat ? (
          <ChatWindow
            chat={activeChat}
            currentUserId={user?.id}
            onMessage={handleSocketMessage}
            onSend={handleSend}
          />
        ) : (
          <EmptyChatState isBusy={isBusy} hasUsers={chats.length > 0} />
        )}
      </section>
    </main>
  )
}

export default ChatPage
