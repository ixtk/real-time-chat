import { useEffect, useMemo, useState } from 'react'
import { getCurrentUser, logoutUser } from '../api/authApi'
import { createChat, sendMessage } from '../api/chatApi'
import { getRegisteredUsers } from '../api/userApi'
import AuthModal from '../components/AuthModal'
import Avatar from '../components/Avatar'
import ChatList from '../components/ChatList'
import MessageComposer from '../components/MessageComposer'
import MessageList from '../components/MessageList'
import { currentUser } from '../data/mockChats'

const avatarColors = ['#2563eb', '#059669', '#d97706', '#7c3aed', '#dc2626']

function getInitials(username) {
  return username.slice(0, 2).toUpperCase()
}

function mapUsersToChats(users) {
  return users.map((registeredUser, index) => ({
    id: registeredUser.id,
    name: registeredUser.username,
    initials: getInitials(registeredUser.username),
    color: avatarColors[index % avatarColors.length],
    status: 'online',
    time: 'now',
    unread: 0,
    preview: 'Registered user',
    typing: false,
    messages: [],
  }))
}

function formatMessageTime(dateValue) {
  if (!dateValue) return 'now'

  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateValue))
}

function mapMessages(messages) {
  return messages.map((message) => ({
    ...message,
    id: message.id || message._id,
    time: formatMessageTime(message.createdAt),
  }))
}

function ChatPage() {
  const [user, setUser] = useState(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [isCreatingChat, setIsCreatingChat] = useState(false)
  const [chats, setChats] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)

  useEffect(() => {
    let isMounted = true

    getCurrentUser()
      .then((sessionUser) => {
        if (isMounted) {
          setUser(sessionUser)
        }
      })
      .catch(() => {
        if (isMounted) {
          setUser(null)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsCheckingSession(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!user) {
      setChats([])
      setActiveChatId(null)
      return
    }

    let isMounted = true

    setIsLoadingUsers(true)
    getRegisteredUsers()
      .then((registeredUsers) => {
        if (!isMounted) return

        const registeredUserChats = mapUsersToChats(registeredUsers)

        setChats(registeredUserChats)
        setActiveChatId(null)
      })
      .catch(() => {
        if (isMounted) {
          setChats([])
          setActiveChatId(null)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingUsers(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [user])

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) ?? null,
    [activeChatId, chats],
  )

  const handleSend = async (text) => {
    if (!activeChat?.chatId) return

    const savedMessage = await sendMessage(activeChat.chatId, text)
    const newMessage = {
      ...savedMessage,
      time: formatMessageTime(savedMessage.createdAt),
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

  const handleSelectUser = async (receiverId) => {
    setIsCreatingChat(true)

    try {
      const createdChat = await createChat(receiverId)

      setChats((currentChats) =>
        currentChats.map((chat) =>
          chat.id === receiverId
            ? {
                ...chat,
                chatId: createdChat.id,
                preview: 'Chat created',
                time: 'now',
                messages: mapMessages(createdChat.messages ?? []),
              }
            : chat,
        ),
      )
      setActiveChatId(receiverId)
    } catch (_error) {
      setChats((currentChats) =>
        currentChats.map((chat) =>
          chat.id === receiverId ? { ...chat, preview: 'Could not create chat' } : chat,
        ),
      )
    } finally {
      setIsCreatingChat(false)
    }
  }

  const handleLogout = async () => {
    await logoutUser()
    setUser(null)
    setChats([])
    setActiveChatId(null)
  }

  const account = user
    ? {
        ...currentUser,
        name: user.username,
        initials: user.username.slice(0, 2).toUpperCase(),
      }
    : currentUser

  return (
    <main className="chat-shell">
      {!isCheckingSession && !user && <AuthModal onAuth={setUser} />}

      <aside className="sidebar">
        <ChatList chats={chats} activeChatId={activeChat?.id} onSelect={handleSelectUser} />

        <div className="account">
          <Avatar user={account} size="small" />
          <div>
            <strong>{account.name}</strong>
            <p>Active now</p>
          </div>
          <button className="signout" type="button" title="Sign out" onClick={handleLogout}>
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
        {activeChat ? (
          <>
            <header className="conversation-header">
              <Avatar user={activeChat} />
              <div>
                <h2>{activeChat.name}</h2>
                <p>{activeChat.status === 'online' ? 'Online' : activeChat.status}</p>
              </div>
            </header>

            <MessageList chat={activeChat} currentUserId={user?.id} />
            <MessageComposer chat={activeChat} onSend={handleSend} disabled={!activeChat.chatId} />
          </>
        ) : (
          <div className="empty-state">
            {isLoadingUsers || isCreatingChat
              ? 'Loading...'
              : chats.length > 0
                ? 'Select a user to create a chat.'
                : 'No registered users to message yet.'}
          </div>
        )}
      </section>
    </main>
  )
}

export default ChatPage
