import React from 'react'
import { toast } from 'react-toastify'
import OnlineUsers from '../../components/OnlineUsers'
import Board from '../../components/Board'
import MessageBoardForm from '../../components/MessageBoardForm'
import DateTimeFluent from '../../components/DateTimeFluent'
import Rooms from '../../components/Room/Rooms'
import { useUser } from '../../context/user-context'
import { useSocket } from '../../context/socket-context'
import { useRoom } from '../../context/room-context'
import { useTheme } from '../../context/theme-context'

import Bug from '../../assets/bug.png'

import '../../styles/MsgBoard.css'

function MessageBoard() {
  const { userInfo, setUserInfo } = useUser()
  const { theme } = useTheme()
  const { socket, socketCmds, connect, disconnect } = useSocket()
  const { joinRoom, rooms } = useRoom()
  const logout = React.useCallback(() => {
    localStorage.removeItem('client:user')
    setUserInfo({})
  }, [setUserInfo])

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
        <div className='welcome-container'>
          <div className='welcome-centered'>
            <div>welcome {userInfo.user.username}</div>
            <DateTimeFluent />
            <a 
              className='hover-div'
              target='__blank'
              href='https://github.com/zachblizz/msg-frontend/issues/new'
            >
              <img title='report a bug' style={{width: 30}} src={Bug} alt='bug' />
            </a>
            <div className='hover-div' onClick={logout}>logout</div>
          </div>
        </div>
        <Rooms />
        <Board />
        <MessageBoardForm username={userInfo.user.username} theme={theme} />
      </div>
    </div>
  )
}

export default MessageBoard
