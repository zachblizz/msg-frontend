import React from 'react'
import { toast } from 'react-toastify'
import OnlineUsers from '../../components/OnlineUsers'
import Board from '../../components/Board'
import MessageBoardForm from '../../components/MessageBoardForm'
import DateTimeFluent from '../../components/DateTimeFluent'
import { useUser } from '../../context/user-context'
import { useSocket } from '../../context/socket-context'
import { useTheme } from '../../context/theme-context'

import '../../styles/MsgBoard.css'

function MessageBoard() {
  const { userInfo, setUserInfo } = useUser()
  const { theme } = useTheme()
  const {
    socket,
    socketCmds,
    connect,
    disconnect,
    joinRoom,
    room,
    rooms
  } = useSocket()
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
        if (room === `/${userInfo.user.username}`) {
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
  }, [socket, connect, disconnect, userInfo.user, socketCmds, joinRoom])

  // React.useMemo(() => {
  //   if (socket && socketCmds) {
  //     socket.on(socketCmds.loggedOut, leaveRoom)
  //   }
  //   return () => socket.removeListener(socketCmds.loggedOut)
  // }, [socket, socketCmds, leaveRoom])

  // React.useEffect(() => {}, [rooms])

  return (
    <div className='msg-board-container'>
      { window.innerWidth > 400 && <OnlineUsers /> }
      <div className='msg-board-inner-container'>
        <div className='welcome-container'>
          <div className='welcome-centered'>
            <div>welcome {userInfo.user.username}</div>
            <DateTimeFluent />
            {/* <ThemeBtn /> */}
            <div className='hover-div' onClick={logout}>logout</div>
          </div>
        </div>
        {rooms.map(r => 
          <div
            key={r}
            className='hover-div'
            onClick={() => joinRoom({room: r, switch: true})}
            disabled={r === room}
          >
            {r}
          </div>)
        }
        <Board />
        <MessageBoardForm username={userInfo.user.username} theme={theme} />
      </div>
    </div>
  )
}

export default MessageBoard
