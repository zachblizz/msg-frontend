import React from 'react'
import io from 'socket.io-client'
import client from '../utils/api-client'

const SocketContext = React.createContext()

function SocketProvider({children}) {
  const [socket, setSocket] = React.useState(null)
  const [socketCmds, setSocketCmds] = React.useState({})

  React.useEffect(() => {
    async function getSocketCmds() {
      try {
        const data = await client('socketCmds')
        const commands = data.commands
        setSocketCmds(commands)
      } catch (err) {
        console.error(err)
      }
    }

    getSocketCmds()
  }, [])

  function connect() {
    setSocket(io(`http://localhost:3000`, {transports: ['websocket']}))
  }

  function disconnect() {
    socket.disconnect()
    setSocket(null)
  }

  return (
    <SocketContext.Provider value={{socket, socketCmds, connect, disconnect}}>
      {children}
    </SocketContext.Provider>
  )
}

function useSocket() {
  const context = React.useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocketCommands must be used within a SocketProvider')
  }
  return context
}

export {
  SocketProvider,
  useSocket,
}
