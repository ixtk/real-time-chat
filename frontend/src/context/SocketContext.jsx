import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { useAuth } from './AuthContext'
import { createSocket } from '../socket/socketClient'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { user } = useAuth()
  const socketRef = useRef(null)

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect()
      socketRef.current = null
      return
    }

    const socket = createSocket()
    socket.connect()
    socketRef.current = socket

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [user])

  const value = useMemo(
    () => ({
      getSocket: () => socketRef.current,
    }),
    [],
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
