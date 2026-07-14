import { Server } from 'socket.io'
import { authCookieName, verifyAuthToken } from '../utils/authToken.js'

let io
const onlineUsers = new Map()

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
    const userId = socket.userId.toString()
    const userRoom = getUserRoom(userId)
    const userSockets = onlineUsers.get(userId) ?? new Set()
    const wasOffline = userSockets.size === 0

    userSockets.add(socket.id)
    onlineUsers.set(userId, userSockets)
    socket.join(userRoom)

    socket.emit('presence:snapshot', getOnlineUserIds())

    if (wasOffline) {
      io.emit('presence:online', userId)
    }

    socket.on('chat:join', (chatId) => {
      if (chatId) socket.join(chatId)
    })

    socket.on('chat:leave', (chatId) => {
      if (!chatId) return

      emitTyping(socket, chatId, false)
      socket.leave(chatId)
    })

    socket.on('chat:typing', ({ chatId, isTyping }) => {
      if (!chatId) return

      emitTyping(socket, chatId, Boolean(isTyping))
    })

    socket.on('presence:get', () => {
      socket.emit('presence:snapshot', getOnlineUserIds())
    })

    socket.on('disconnecting', () => {
      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          emitTyping(socket, room, false)
        }
      })
    })

    socket.on('disconnect', () => {
      const activeSockets = onlineUsers.get(userId)

      if (!activeSockets) return

      activeSockets.delete(socket.id)

      if (activeSockets.size > 0) {
        onlineUsers.set(userId, activeSockets)
        return
      }

      onlineUsers.delete(userId)
      io.emit('presence:offline', userId)
    })
  })

  return io
}

function emitTyping(socket, chatId, isTyping) {
  socket.to(chatId.toString()).emit('chat:typing', {
    chatId: chatId.toString(),
    userId: socket.userId.toString(),
    isTyping,
  })
}

export function emitChatMessage(chatId, message) {
  if (!io) return

  io.to(chatId.toString()).emit('chat:message', {
    chatId: chatId.toString(),
    message,
  })
}

export function emitUserChatMessage(userId, chatId, message) {
  if (!io) return

  io.to(getUserRoom(userId)).emit('chat:message', {
    chatId: chatId.toString(),
    message,
  })
}

export function emitChatRead(chatId, readerId, readMessageIds, readAt) {
  if (!io) return

  io.to(chatId.toString()).emit('chat:read', {
    chatId: chatId.toString(),
    readerId: readerId.toString(),
    readMessageIds,
    readAt,
  })
}

export function getOnlineUserIds() {
  return [...onlineUsers.keys()]
}

function getUserRoom(userId) {
  return `user:${userId}`
}
