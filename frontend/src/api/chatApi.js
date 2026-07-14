import api from './client'

export async function createChat(receiverId) {
  const { data } = await api.post('/chats', { receiverId })

  return data.chat
}

export async function sendMessage(chatId, text) {
  const { data } = await api.post(`/chats/${chatId}/messages`, { text })

  return data.message
}

export async function markChatRead(chatId) {
  const { data } = await api.patch(`/chats/${chatId}/read`)

  return data
}
