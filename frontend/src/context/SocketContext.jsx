import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { createSocket } from '../socket/socketClient'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { user } = useAuth()
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!user) {
      setSocket(null)
      return
    }

    const nextSocket = createSocket()
    nextSocket.connect()
    setSocket(nextSocket)

    return () => {
      nextSocket.disconnect()
      setSocket(null)
    }
  }, [user])

  const value = useMemo(
    () => ({
      socket,
    }),
    [socket],
  )

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export function useSocket() {
  const context = useContext(SocketContext)

  if (!context) {
    throw new Error('useSocket must be used inside SocketProvider')
  }

  return context
}
