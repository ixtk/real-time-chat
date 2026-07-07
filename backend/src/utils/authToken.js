import jwt from 'jsonwebtoken'

export const authCookieName = 'chat_token'

const sessionMaxAge = 14 * 24 * 60 * 60 * 1000

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
}

export function createAuthToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '14d',
  })
}

export function verifyAuthToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}

export function setAuthCookie(res, token) {
  res.cookie(authCookieName, token, {
    ...cookieOptions,
    maxAge: sessionMaxAge,
  })
}

export function clearAuthCookie(res) {
  res.clearCookie(authCookieName, cookieOptions)
}
