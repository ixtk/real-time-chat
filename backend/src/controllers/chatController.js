import Chat from '../models/Chat.js'
import User from '../models/User.js'
import { emitChatMessage } from '../socket/socketServer.js'

function getParticipantKey(userId, receiverId) {
  return [userId.toString(), receiverId.toString()].sort().join(':')
}

function formatMessage(message) {
  return {
    id: message._id,
    sender: message.sender,
    text: message.text,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  }
}

function formatChat(chat) {
  return {
    id: chat._id,
    participants: chat.participants,
    messages: chat.messages.map(formatMessage),
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
  }
}

export function getChats(_req, res) {
  res.json({
    message: 'Chats endpoint is ready. Frontend currently uses mock data.',
    chats: [],
  })
}

export async function createChat(req, res) {
  const { receiverId } = req.body
  const currentUserId = req.userId

  if (!receiverId) {
    return res.status(400).json({ message: 'Receiver is required.' })
  }

  if (receiverId === currentUserId) {
    return res.status(400).json({ message: 'You cannot create a chat with yourself.' })
  }

  const receiver = await User.findById(receiverId)

  if (!receiver) {
    return res.status(404).json({ message: 'Receiver not found.' })
  }

  const participantKey = getParticipantKey(currentUserId, receiverId)
  const chat = await Chat.findOneAndUpdate(
    { participantKey },
    {
      $setOnInsert: {
        participantKey,
        participants: [currentUserId, receiverId],
        messages: [],
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  ).populate('participants', 'username')

  return res.status(201).json({
    chat: formatChat(chat),
  })
}

export async function sendMessage(req, res) {
  const { chatId } = req.params
  const { text } = req.body
  const currentUserId = req.userId

  if (!text?.trim()) {
    return res.status(400).json({ message: 'Message text is required.' })
  }

  const chat = await Chat.findOne({
    _id: chatId,
    participants: currentUserId,
  })

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found.' })
  }

  chat.messages.push({
    sender: currentUserId,
    text: text.trim(),
  })

  await chat.save()

  const message = chat.messages.at(-1)
  const formattedMessage = formatMessage(message)

  emitChatMessage(chat._id, formattedMessage)

  return res.status(201).json({
    message: formattedMessage,
  })
}
