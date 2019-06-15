import React from 'react'
import uuid from 'uuid'
import { useSocket } from '../context/socket-context'
import colors from '../utils/colors'

function MessageBoardForm({username, theme}) {
  const [msg, setMsg] = React.useState('')
  const [typing, setTyping] = React.useState(false)
  const { socket, socketCmds } = useSocket()

  function handleSendMessage(event) {
    event.preventDefault()

    setTyping(false)
    if (msg && msg.trim().length > 0) {
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
    const msg = event.target.value
    setMsg(msg)
    if (!typing) {
      setTyping(true)
      socket.emit(socketCmds.typing, {username})
    } else if (msg.trim().length === 0) {
      setTyping(false)
      socket.emit(socketCmds.doneTyping, {username})
    }
  }

  return (
    <form
      style={{display: 'flex'}}
      onSubmit={handleSendMessage}
    >
      <input
        style={{
          height: 35,
          width: '90%',
          flexDirection: 'column',
          padding: '0px 5px',
          border: '1px solid #eee',
          ...colors[theme]
        }}
        placeholder='Enter message here...'
        onChange={onMessageChange}
        value={msg}
      />
      <button
        style={{
          width: '10%',
          flexDirection: 'column',
          border: '1px solid #ddd',
          alignItems: 'center',
          background: colors[theme].btnBackground,
          color: colors[theme].color
        }}
        type='submit'
        value='submit'
      >send</button>
    </form>
  )
}

export default MessageBoardForm
