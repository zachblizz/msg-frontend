import React from 'react'
import client from '../utils/api-client'

const CommandsContext = React.createContext()

function CommandsProvider({children}) {
  const [cmds, setCmds] = React.useState({})

  React.useEffect(() => {
    async function getCmds() {
      try {
        const data = await client('getCmds')
        setCmds(data)
      } catch (err) {
        console.error(err)
      }
    }

    getCmds()
  }, [])

  return (
    <CommandsContext.Provider value={cmds}>
      {children}
    </CommandsContext.Provider>
  )
}

function useCommands() {
  const context = React.useContext(CommandsContext)
  if (context === undefined) {
    throw new Error('useCommands must be used within a CommandsProvider')
  }

  return context
}

export {
  CommandsProvider,
  useCommands
}
