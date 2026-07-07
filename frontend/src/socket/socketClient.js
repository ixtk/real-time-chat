import { io } from 'socket.io-client'

export function createSocket() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  const socketUrl = apiUrl.replace(/\/api\/?$/, '')

  return io(socketUrl, {
    autoConnect: false,
    withCredentials: true,
  })
}
