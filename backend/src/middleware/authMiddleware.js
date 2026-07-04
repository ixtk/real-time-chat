import jwt from 'jsonwebtoken'

const cookieName = 'chat_token'

export function requireAuth(req, res, next) {
  const token = req.cookies?.[cookieName]

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated.' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.userId

    return next()
  } catch (_error) {
    return res.status(401).json({ message: 'Not authenticated.' })
  }
}
