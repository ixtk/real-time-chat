import User from '../models/User.js'
import { getOnlineUserIds } from '../socket/socketServer.js'

export async function getUsers(req, res) {
  const onlineUserIds = new Set(getOnlineUserIds())
  const users = await User.find({ _id: { $ne: req.userId } })
    .select('username createdAt')
    .sort({ username: 1 })

  return res.json({
    users: users.map((user) => ({
      id: user._id,
      username: user.username,
      status: onlineUserIds.has(user._id.toString()) ? 'online' : 'offline',
      createdAt: user.createdAt,
    })),
  })
}
