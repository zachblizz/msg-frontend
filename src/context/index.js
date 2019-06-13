import React from 'react'
import { SocketProvider } from './socket-context'
import { UserProvider, OnlineUsersProvider } from './user-context'
import { ThemeProvider } from './theme-context'

function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <OnlineUsersProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </OnlineUsersProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default AppProviders
