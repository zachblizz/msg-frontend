import React from 'react'
import moment from 'moment'
import uuid from 'uuid'
import { useSocket } from '../context/socket-context'
import { useUser } from '../context/user-context'

function Board() {
  const { socket, socketCmds } = useSocket()
  const { userInfo } = useUser()
  const [messages, setMessages] = React.useState([])

  React.useEffect(() => {
    if (socket) {
      socket.on(socketCmds.receiveServerMsg, msg => setMessages([...messages, msg]))
      return () => socket.removeEventListener(socketCmds.receiveServerMsg)
    }
  }, [messages, socket, socketCmds.receiveServerMsg])

  function displayMsg(msg) {
    // if (msg) {
      if (msg.msg === '/clear') {
        setMessages([{msg: 'BOARD CLEARED!!', style: {color: '#ff5252'}, uuid: uuid()}])
      } else if (msg.msg instanceof Array) {
        return msg.msg.map((cmd, i) =>
          <div key={i} style={{...msg.style, padding: i > 0 && '0px 10px'}}>{cmd}</div>
        )
      } else if (msg.type === 'html') {
        return <div dangerouslySetInnerHTML={{__html: msg.msg}} />
      } else if (msg.image) {
        let arrayBufferView = new Uint8Array(msg.buffer)
        let blob = new Blob([arrayBufferView], {type: 'image/jpeg'})
        let imgUrl = URL.createObjectURL(blob)
        return <img key={msg.uuid} src={imgUrl} alt="oh well" />
      }

      return msg.msg
    // }
  }

  return (
    <div
      style={{
        overflow: 'hidden',
        height: '87%',
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
          const textAlign = userInfo.user.username === msg.username ? 'right' : 'left'

          return (
            <div
              style={{
                width: '98%',
                textAlign,
                margin: '10px 5px',
                padding: '0px 5px'
              }}
              key={msg.uuid}
            >
              <div>
                {displayMsg(msg)}
              </div>
              <div 
                style={{
                  width: '100%',
                  fontSize: 9,
                  textAlign
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
