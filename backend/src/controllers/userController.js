import User from "../models/User.js"
import Chat from "../models/Chat.js"

export async function getAllUsers(req, res) {
  const allUsers = await User.find().select("_id username")

  res.json({
    users: allUsers
  })
}

export async function loadChatByUserId(req, res) {
  // 1. find chat by user
  const recipientId = req.params.userId
  const loggedInUserId = req.user._id

  const foundChat = await Chat.findOne({
    participants: { $all: [loggedInUserId, recipientId] }
  })

  if (foundChat !== null) {
    return res.json({
      chat: foundChat
    })
  } else {
    // 2. create chat by user
    const newChat = await Chat.create({
      participants: [loggedInUserId, recipientId],
      messages: []
    })

    newChat.save()

    return res.json({
      chat: newChat
    })
  }
}
