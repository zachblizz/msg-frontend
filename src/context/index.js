import React from 'react'
import { SocketProvider } from './socket-context'
import { UserProvider, OnlineUsersProvider } from './user-context'
import { ThemeProvider } from './theme-context'
import { RoomProvider } from './room-context'
import { ModalProvider } from './modal-context';
import { MessagesProvider } from './messages-context';

function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <ModalProvider>
        <UserProvider>
          <OnlineUsersProvider>
            <SocketProvider>
              <MessagesProvider>
                <RoomProvider>
                  {children}
                </RoomProvider>
              </MessagesProvider>
            </SocketProvider>
          </OnlineUsersProvider>
        </UserProvider>
      </ModalProvider>
    </ThemeProvider>
  )
}

export default AppProviders
