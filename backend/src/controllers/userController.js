import User from '../models/User.js'

export async function getUsers(req, res) {
  const users = await User.find({ _id: { $ne: req.userId } })
    .select('username createdAt')
    .sort({ username: 1 })

  return res.json({
    users: users.map((user) => ({
      id: user._id,
      username: user.username,
      createdAt: user.createdAt,
    })),
  })
}
