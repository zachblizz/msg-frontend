import React from 'react'
import uuid from 'uuid'
import { useSocket } from '../context/socket-context'
import colors from '../utils/colors'

function MessageBoardForm({username, theme}) {
  const [msg, setMsg] = React.useState('')
  const [typing, setTyping] = React.useState(false)
  const { socket, socketCmds, room } = useSocket()

  function handleSendMessage(event) {
    event.preventDefault()

    setTyping(false)
    if (msg && msg.trim().length > 0) {
      setMsg('')
      const chatCmd = room ? socketCmds.chatReceiveClientMsg : socketCmds.receiveClientMsg
      socket.emit(chatCmd, {
        username,
        msg,
        msgTime: new Date(),
        uuid: uuid(),
        room
      })

      socket.emit(socketCmds.doneTyping, {username, room})
    }
  }

  function onMessageChange(event) {
    const msg = event.target.value
    setMsg(msg)
    if (!typing) {
      setTyping(true)
      socket.emit(socketCmds.typing, {username, room})
    } else if (msg.trim().length === 0) {
      setTyping(false)
      socket.emit(socketCmds.doneTyping, {username, room})
    }
  }

  return (
    <form
      style={{display: 'flex', background: '#f6f8fc', width: '85%', margin: '0 auto'}}
      onSubmit={handleSendMessage}
    >
      <input
        style={{
          maxHeight: 35,
          minHeight: 35,
          minWidth: '96%',
          flexDirection: 'column',
          padding: '11px 15px',
          border: '1px solid #eee',
          borderRadius: 5,
          ...colors[theme]
        }}
        placeholder='Enter message here...'
        onChange={onMessageChange}
        value={msg}
      />
    </form>
  )
}

export default MessageBoardForm
