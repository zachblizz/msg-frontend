import React from 'react'
import { CommandsProvider } from './commands-context'
import { SocketProvider } from './socket-context'
import { UserProvider, OnlineUsersProvider } from './user-context'

function AppProviders({children}) {
  return (
    <UserProvider>
      <OnlineUsersProvider>
        <SocketProvider>
          <CommandsProvider>
            { children }
          </CommandsProvider>
        </SocketProvider>
      </OnlineUsersProvider>
    </UserProvider>
  )
}

export default AppProviders
