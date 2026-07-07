import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function checkSession() {
      try {
        const sessionUser = await getCurrentUser()

        if (isMounted) setUser(sessionUser)
      } catch (_error) {
        if (isMounted) setUser(null)
      } finally {
        if (isMounted) setIsCheckingSession(false)
      }
    }

    checkSession()

    return () => {
      isMounted = false
    }
  }, [])

  const signIn = async (credentials) => {
    const authUser = await loginUser(credentials)
    setUser(authUser)
  }

  const register = async (credentials) => {
    const authUser = await registerUser(credentials)
    setUser(authUser)
  }

  const signOut = async () => {
    await logoutUser()
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isCheckingSession,
      signIn,
      register,
      signOut,
    }),
    [user, isCheckingSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
