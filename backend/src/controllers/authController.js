import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import {
  authCookieName,
  clearAuthCookie,
  createAuthToken,
  setAuthCookie,
  verifyAuthToken,
} from '../utils/authToken.js'

function publicUser(user) {
  return {
    id: user._id,
    username: user.username,
  }
}

export async function registerUser(req, res) {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' })
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' })
  }

  const normalizedUsername = username.trim().toLowerCase()
  const existingUser = await User.findOne({ username: normalizedUsername })

  if (existingUser) {
    return res.status(409).json({ message: 'Username is already taken.' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({
    username: normalizedUsername,
    password: hashedPassword,
  })
  const token = createAuthToken(user._id)

  setAuthCookie(res, token)

  return res.status(201).json({
    message: 'Registration successful.',
    user: publicUser(user),
  })
}

export async function loginUser(req, res) {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' })
  }

  const user = await User.findOne({ username: username.trim().toLowerCase() })

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password.' })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid username or password.' })
  }

  const token = createAuthToken(user._id)

  setAuthCookie(res, token)

  return res.json({
    message: 'Login successful.',
    user: publicUser(user),
  })
}

export async function getCurrentUser(req, res) {
  const token = req.cookies?.[authCookieName]

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated.' })
  }

  try {
    const payload = verifyAuthToken(token)
    const user = await User.findById(payload.userId)

    if (!user) {
      clearAuthCookie(res)
      return res.status(401).json({ message: 'Not authenticated.' })
    }

    return res.json({ user: publicUser(user) })
  } catch (_error) {
    clearAuthCookie(res)
    return res.status(401).json({ message: 'Not authenticated.' })
  }
}

export function logoutUser(_req, res) {
  clearAuthCookie(res)

  return res.json({ message: 'Logged out.' })
}
