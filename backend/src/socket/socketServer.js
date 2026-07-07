import { Server } from 'socket.io'
import { authCookieName, verifyAuthToken } from '../utils/authToken.js'

let io

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [name, ...valueParts] = cookie.trim().split('=')

    if (!name) return cookies

    cookies[name] = decodeURIComponent(valueParts.join('='))
    return cookies
  }, {})
}

export function initializeSocketServer(server, allowedOrigins) {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  })

  io.use((socket, next) => {
    try {
      const cookies = parseCookies(socket.handshake.headers.cookie)
      const token = cookies[authCookieName]

      if (!token) {
        return next(new Error('Not authenticated.'))
      }

      const payload = verifyAuthToken(token)
      socket.userId = payload.userId

      return next()
    } catch (_error) {
      return next(new Error('Not authenticated.'))
    }
  })

  io.on('connection', (socket) => {
    socket.on('chat:join', (chatId) => {
      if (chatId) socket.join(chatId)
    })

    socket.on('chat:leave', (chatId) => {
      if (chatId) socket.leave(chatId)
    })
  })

  return io
}

export function emitChatMessage(chatId, message) {
  if (!io) return

  io.to(chatId.toString()).emit('chat:message', {
    chatId: chatId.toString(),
    message,
  })
}
