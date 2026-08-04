import User from '../models/User.js'

export async function getAllUsers (req, res) {
  const allUsers = await User.find().select('_id username')

  res.json({ 
    users: allUsers
  })
}
