import React from 'react'

const MessagesContext = React.createContext()

function MessagesProvider({children}) {
  const [messages, setMessages] = React.useState({})

  return (
    <MessagesContext.Provider value={{messages, setMessages}}>
      {children}
    </MessagesContext.Provider>
  )
}

function useMessages() {
  const context = React.useContext(MessagesContext)
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider')
  }
  return context
}

export { MessagesProvider, useMessages }
