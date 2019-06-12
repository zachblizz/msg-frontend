import React from 'react'
import { SocketProvider } from './socket-context'
import { UserProvider, OnlineUsersProvider } from './user-context'

function AppProviders({ children }) {
  return (
    <UserProvider>
      <OnlineUsersProvider>
        <SocketProvider>
          {children}
        </SocketProvider>
      </OnlineUsersProvider>
    </UserProvider>
  )
}

export default AppProviders
