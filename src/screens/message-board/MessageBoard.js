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
    rooms
  } = useSocket()
  const logout = React.useCallback(() => {
    localStorage.removeItem('client:user')
    setUserInfo({})
  }, [setUserInfo])

  React.useMemo(() => {
    if (!socket && userInfo.user) {
      connect()
    }

    return () => {
      if (socket && userInfo.user) {
        disconnect()
      }
    }
  }, [socket, connect, disconnect, userInfo.user])

  React.useMemo(() => {
    if (socket && socketCmds && userInfo.user) {
      socket.emit(socketCmds.newUser, {username: userInfo.user.username})
      socket.on(socketCmds.askToJoin, ({requester, room}) => {
        if (room === userInfo.user.username) {
          toast(
            <div style={{display: 'flex'}}>
              <div style={{width: '70%'}}>join chat with {requester}</div>
              <div style={{width: '30%'}}>
                <button onClick={() => joinRoom({room})}>join</button>
              </div>
            </div>
          )
        }
      })
    }

    return () => socket.removeListener(socketCmds.askToJoin)
  }, [socket, userInfo.user, socketCmds, joinRoom])

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
        {rooms.map(room => <div key={room}>{room}</div>)}
        <Board />
        <MessageBoardForm username={userInfo.user.username} theme={theme} />
      </div>
    </div>
  )
}

export default MessageBoard
