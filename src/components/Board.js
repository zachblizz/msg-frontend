import React from 'react'
import moment from 'moment'
import { useSocket } from '../context/socket-context'

function Board() {
  const { socket, socketCmds } = useSocket()
  const [messages, setMessages] = React.useState([])

  React.useEffect(() => {
    if (socket) {
      socket.on(socketCmds.receiveServerMsg, msg => setMessages([...messages, msg]))
      return () => socket.removeEventListener(socketCmds.receiveServerMsg)
    }
  }, [messages, socket, socketCmds.receiveServerMsg])
  
  return (
    <div
      style={{
        overflow: 'hidden',
        height: '90%',
        marginBottom: 5,
        border: '1px solid #eee',
      }}
    >
      <div
        style={{
          height: 'calc(100% + 7px)',
          width: 'calc(100% + 17px)',
          margin: '10px 0px',
          overflow: 'scroll'
        }}
      >
        {messages.map(msg => {
          const style = {
            width: '98%',
            textAlign: 'left',
            margin: '10px 5px',
            padding: '0px 5px'
          }

          return (
            <div
              style={style}
              key={msg.uuid}
            >
              <div>
                { msg.msg instanceof Array
                  ? msg.msg.map((cmd, i) => 
                      <div key={i} style={{...msg.style, padding: i > 0 && '0px 10px'}}>{cmd}</div>
                    )
                  : msg.msg
                }
              </div>
              <div 
                style={{
                  width: '100%',
                  fontSize: 9,
                  textAlign: 'left'
                }}
              >
                {msg.username} {msg.msgTime && moment(new Date(msg.msgTime)).format('MMM, DD HH:mm')}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Board
