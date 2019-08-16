import React from 'react'
import moment from 'moment'

import { useUser } from '../context/user-context'
import { useRoom } from '../context/room-context'

import { useUpdateBoard } from '../custom-hooks/board'

import '../styles/Board.css'

function Board() {
  const { boardRef, messages, setMessages } = useUpdateBoard()
  const { userInfo } = useUser()
  const { room } = useRoom()

  const displayMsg = React.useCallback(msg => {
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
  }, [setMessages])

  return (
    <div className='board-container-no-scroll'>
      <div
        ref={boardRef}
        className='board-container-scroll'
      >
        { messages && messages[room.room] && messages[room.room].map(msg => {
          const canViewMsg = msg && msg.room && msg.room.room === room.room
          const sameUser = userInfo.user.username === msg.username
          const color = sameUser ? '#fff' : '#585858'
          const background = sameUser ? '#4e71ff' : '#fff'
          const userClass = sameUser ? 'current-user' : 'other-user'

          return ( 
            canViewMsg &&
              <div style={{display: 'flex', width: '100%'}} key={msg.uuid}>
                {sameUser && <div className='hidden-msg'></div>}
                <div
                  className={`msg-container ${userClass}`}
                  style={{
                    color,
                    background
                  }}
                >
                  <div 
                    style={{
                      ...msg.style,
                      marginBottom: 10,
                      wordBreak: 'break-word'
                    }}
                  >
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
              </div>
          )
        })}
      </div>
    </div>
  )
}

export default Board
