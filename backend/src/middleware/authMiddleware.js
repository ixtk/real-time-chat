import { authCookieName, verifyAuthToken } from '../utils/authToken.js'

export function requireAuth(req, res, next) {
  const token = req.cookies?.[authCookieName]

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated.' })
  }

  try {
    const payload = verifyAuthToken(token)
    req.userId = payload.userId

    return next()
  } catch (_error) {
    return res.status(401).json({ message: 'Not authenticated.' })
  }
}
