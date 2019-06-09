import React from 'react'
import client from '../utils/api-client'

const SocketCommandsContext = React.createContext()

function SocketCommandsProvider({children}) {
  const [socketCmds, setSocketCmds] = React.useState({})

  React.useEffect(() => {
    async function getCmds() {
      try {
        const data = await client('socketCmds')
        setSocketCmds(data)
      } catch (err) {
        console.error(err)
      }
    }

    getCmds()
  }, [])

  return (
    <SocketCommandsContext.Provider value={socketCmds}>
      {children}
    </SocketCommandsContext.Provider>
  )
}

function useSocketCommands() {
  const context = React.useContext(SocketCommandsContext)
  if (context === undefined) {
    throw new Error('useSocketCommands must be used within a SocketCommandsProvider')
  }

  return context
}

export {
  SocketCommandsProvider,
  useSocketCommands
}
