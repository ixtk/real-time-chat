import User from '../models/User.js'

export async function getAllUsers (req, res) {
  const allUsers = await User.find()

  res.json({ 
    users: allUsers
  })
}
