import { useEffect, createRef } from 'react'

import { useSocket } from '../context/socket-context'
import { useMessages } from '../context/messages-context'

function useUpdateBoard() {
  const { socket, socketCmds } = useSocket()
  const { messages, setMessages } = useMessages()
  const boardRef = createRef()

  useEffect(() => {
    if (socket) {
      socket.on(socketCmds.receiveServerMsg, msg => setMessages(messages => {
        if (!messages[msg.room.room]) {
          return {...messages, [msg.room.room]: [msg]}
        } else {
          return {...messages, [msg.room.room]: [...messages[msg.room.room], msg]}
        }
      }))
      return () => socket.removeEventListener(socketCmds.receiveServerMsg)
    }
  }, [messages, setMessages, socket, socketCmds, boardRef])

  useUpdateScroll(boardRef)

  return { boardRef, messages, setMessages }
}

function useUpdateScroll(boardRef) {
  const { messages } = useMessages()

  useEffect(() => {
    const boardHeight = boardRef.current.scrollHeight
    const clientHeight = boardRef.current.clientHeight
    const maxScrollTop = boardHeight - clientHeight
    boardRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
  }, [messages, boardRef])
}

export { useUpdateBoard }
