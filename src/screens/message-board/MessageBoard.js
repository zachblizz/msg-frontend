import React from 'react'
import { toast } from 'react-toastify'

import Board from '../../components/Board'
import MessageBoardForm from '../../components/MessageBoardForm'
import Nav from '../../components/Nav'
import OnlineUsers from '../../components/OnlineUsers'
import Rooms from '../../components/Room/Rooms'

import { useRoom } from '../../context/room-context'
import { useSocket } from '../../context/socket-context'
import { useTheme } from '../../context/theme-context'
import { useUser } from '../../context/user-context'

import '../../styles/MsgBoard.css'

function MessageBoard() {
  const { userInfo } = useUser()
  const { theme } = useTheme()
  const { socket, socketCmds, connect, disconnect } = useSocket()
  const { joinRoom, rooms } = useRoom()

  React.useMemo(() => {
    if (!socket && userInfo.user && socketCmds.newUser) {
      connect(userInfo.user.username)
    } else if (socket && userInfo.user && socketCmds.askToJoin) {
      socket.removeListener(socketCmds.askToJoin)
      socket.on(socketCmds.askToJoin, ({requester, room}) => {
        if (room === `/${userInfo.user.username}` && !rooms.find(r => r.room === room)) {
          toast(
            <div style={{display: 'flex'}}>
              <div style={{width: '70%', alignItems: 'center'}}>join chat with {requester}</div>
              <div
                className='hover-div'
                style={{width: '30%'}}
                onClick={() => joinRoom({room})}
              >
                join
              </div>
            </div>,
            { autoClose: false }
          )
        }
      })
    }

    return () => {
      if (socket && userInfo.user) {
        disconnect()
      }
    }
  }, [socket, connect, disconnect, userInfo.user, socketCmds, joinRoom, rooms])

  return (
    <div className='msg-board-container'>
      { window.innerWidth > 400 && <OnlineUsers /> }
      <div className='msg-board-inner-container'>
        <Nav />
        <Rooms />
        <Board />
        <MessageBoardForm username={userInfo.user.username} theme={theme} />
      </div>
    </div>
  )
}

export default MessageBoard
