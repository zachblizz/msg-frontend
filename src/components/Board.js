import React from 'react'
import { useUser } from '../context/user-context'
import { useSocket } from '../context/socket-context'
import moment from 'moment'

function Board() {
  const { userInfo } = useUser()
  const { socket, socketCmds } = useSocket()
  const [messages, setMessages] = React.useState([])

  React.useEffect(() => {
    if (socket) {
      socket.on(socketCmds.receiveServerMsg, msg => {
        setMessages([...messages, msg])
      })
    }
  }, [messages, socket, socketCmds.receiveServerMsg])
  
  return (
    <div
      style={{
        height: '90%',
        border: '1px solid #eee',
        margin: '10px 0px',
        overflow: 'scroll'
      }}
    >
      {messages.map(msg => {
        const currUser = msg.username !== userInfo.user.username
        const style = {
          width: '98%',
          textAlign: currUser ? 'left' : 'right',
          margin: '10px 5px'
        }

        return (
          <div
            style={style}
            key={msg.uuid}
          >
            <div>{msg.msg}</div>
            <div 
              style={{
                width: '100%',
                fontWeight: 'bold',
                fontSize: 8,
                textAlign: currUser ? 'left' : 'right'
              }}
            >
              {msg.username} {moment(new Date(msg.msgTime)).format('MMM, DD HH:mm')}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Board
