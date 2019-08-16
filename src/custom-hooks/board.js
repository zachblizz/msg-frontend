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

  useUpdateScroll(boardRef, messages)

  return { boardRef, messages, setMessages }
}

function useUpdateScroll(scrollRef, runEffect) {
  useEffect(() => {
    const boardHeight = scrollRef.current.scrollHeight
    const clientHeight = scrollRef.current.clientHeight
    const maxScrollTop = boardHeight - clientHeight
    scrollRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
  }, [runEffect, scrollRef])
}

export { useUpdateBoard, useUpdateScroll }
