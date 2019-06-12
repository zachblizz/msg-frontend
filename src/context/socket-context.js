import React from 'react'
import io from 'socket.io-client'
import client from '../utils/api-client'

const socket = io('http://192.168.1.109:3000', {transports: ['websocket']})
const SocketContext = React.createContext({socket, socketCmds: null})

function SocketProvider({children}) {
  const { socket } = React.useContext(SocketContext)
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
  
  return (
    <SocketContext.Provider value={{socket, socketCmds}}>
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
