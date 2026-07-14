import Chat from '../models/Chat.js'
import User from '../models/User.js'
import { getOnlineUserIds } from '../socket/socketServer.js'

export async function getUsers(req, res) {
  const currentUserId = req.userId
  const onlineUserIds = new Set(getOnlineUserIds())
  const users = await User.find({ _id: { $ne: currentUserId } })
    .select('username createdAt')
    .sort({ username: 1 })
  const chats = await Chat.find({ participants: currentUserId })
  const chatSummaries = buildChatSummaries(chats, currentUserId)

  return res.json({
    users: users.map((user) => {
      const userId = user._id.toString()
      const summary = chatSummaries.get(userId)

      return {
        id: user._id,
        username: user.username,
        status: onlineUserIds.has(userId) ? 'online' : 'offline',
        chatId: summary?.chatId,
        preview: summary?.preview,
        unread: summary?.unread ?? 0,
        lastMessageAt: summary?.lastMessageAt,
        createdAt: user.createdAt,
      }
    }),
  })
}

function buildChatSummaries(chats, currentUserId) {
  const summaries = new Map()

  chats.forEach((chat) => {
    const otherParticipantId = chat.participants
      .find((participantId) => participantId.toString() !== currentUserId)
      ?.toString()

    if (!otherParticipantId) return

    const lastMessage = chat.messages.at(-1)
    const unread = chat.messages.filter((message) => {
      const isIncoming = message.sender.toString() !== currentUserId

      return isIncoming && !message.messageReadAt
    }).length

    summaries.set(otherParticipantId, {
      chatId: chat._id,
      preview: lastMessage?.text,
      unread,
      lastMessageAt: lastMessage?.createdAt ?? chat.updatedAt,
    })
  })

  return summaries
}
