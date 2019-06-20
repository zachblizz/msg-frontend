import React from 'react'
import moment from 'moment'
import { useSocket } from '../context/socket-context'
// import { useUser } from '../context/user-context'

function Board() {
  const { socket, socketCmds } = useSocket()
  // const { userInfo } = useUser()
  const [messages, setMessages] = React.useState([])
  const boardRef = React.createRef()

  React.useEffect(() => {
    if (socket) {
      socket.on(socketCmds.receiveServerMsg, msg => setMessages([...messages, msg]))
      return () => socket.removeEventListener(socketCmds.receiveServerMsg)
    }
  }, [messages, socket, socketCmds.receiveServerMsg, boardRef])

  React.useEffect(() => {
    const boardHeight = boardRef.current.scrollHeight
    const clientHeight = boardRef.current.clientHeight
    const maxScrollTop = boardHeight - clientHeight
    boardRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
  }, [messages, boardRef])

  const displayMsg = React.useCallback((msg) => {
    if (msg) {
      if (msg.msg === '/clear') {
        setMessages([])
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
        return <img key={msg.uuid} src={imgUrl} alt="oh well" title={msg.msg} />
      }

      return msg.msg
    }
  }, [])

  return (
    <div
      style={{
        overflow: 'hidden',
        height: '81%',
        display: 'flex',
        background: '#f6f8fc',
      }}
    >
      <div
        ref={boardRef}
        // onScroll={handleScroll}
        style={{
          height: 'calc(100% + 7px)',
          width: '100%',
          margin: '0 autose',
          overflow: 'scroll'
        }}
      >
        {messages.map(msg => {
          return (
            <div
              className='msg-container'
              key={msg.uuid}
            >
              <div style={{...msg.style, marginBottom: 10, color: '#585858'}}>
                {displayMsg(msg)}
              </div>
              <div 
                style={{
                  width: '100%',
                  fontSize: 9,
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
