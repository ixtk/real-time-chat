const avatarColors = ['#2563eb', '#059669', '#d97706', '#7c3aed', '#dc2626']

export function getInitials(username) {
  return username.slice(0, 2).toUpperCase()
}

export function formatMessageTime(dateValue) {
  if (!dateValue) return 'now'

  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateValue))
}

export function mapMessage(message) {
  return {
    ...message,
    id: message.id || message._id,
    time: formatMessageTime(message.createdAt),
  }
}

export function mapMessages(messages = []) {
  return messages.map(mapMessage)
}

export function mapUsersToChats(users) {
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

export function buildAccount(user, fallbackUser) {
  if (!user) return fallbackUser

  return {
    ...fallbackUser,
    name: user.username,
    initials: getInitials(user.username),
  }
}
