import React from 'react'
import { useSocket } from '../../context/socket-context'
import uuid from 'uuid'

function MessageBoardForm({username}) {
  const [msg, setMsg] = React.useState('')
  const { socket, socketCmds } = useSocket()

  function handleSendMessage(event) {
    event.preventDefault()

    if (socket && msg && msg.trim().length > 0) {
      setMsg('')
      socket.emit(socketCmds.receiveClientMsg, {
        username,
        msg,
        msgTime: new Date(),
        uuid: uuid()
      })

      socket.emit(socketCmds.doneTyping, {username})
    }
  }

  function onMessageChange(event) {
    setMsg(event.target.value)
    if (socket) {
      socket.emit(socketCmds.typing, {username})
    }
  }
  
  return (
    <form
      style={{display: 'flex'}}
      onSubmit={handleSendMessage}
    >
      <input
        style={{
          height: 33,
          width: '90%',
          flexDirection: 'column',
          padding: '0px 5px'
        }}
        onChange={onMessageChange}
        value={msg}
      />
      <button
        style={{
          width: '10%',
          flexDirection: 'column',
          border: '1px solid #ddd'
        }}
        type='submit'
        value='submit'
      >send</button>
    </form>
  )
}

export default MessageBoardForm
