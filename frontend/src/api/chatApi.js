import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
})

export async function createChat(receiverId) {
  const { data } = await api.post('/chats', { receiverId })

  return data.chat
}

export async function sendMessage(chatId, text) {
  const { data } = await api.post(`/chats/${chatId}/messages`, { text })

  return data.message
}
