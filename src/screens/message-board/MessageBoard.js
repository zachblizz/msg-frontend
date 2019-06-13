import React from 'react'
import OnlineUsers from '../../components/OnlineUsers'
import Board from '../../components/Board'
import MessageBoardForm from './MessageBoardForm'
import DateTimeFluent from '../../components/DateTimeFluent'
import { useUser } from '../../context/user-context'
import { useSocket } from '../../context/socket-context'
import { getContainerStyle, getInnerContainerStyle } from '../../utils'

function MessageBoard() {
  const { userInfo, setUserInfo } = useUser()
  const { socket, socketCmds, connect, disconnect } = useSocket()
  const logout = React.useCallback(() => {
    localStorage.removeItem('client:user')
    setUserInfo({})
  }, [setUserInfo])

  React.useEffect(() => {
    if (!socket && userInfo.user) {
      connect()
    }

    return () => {
      if (socket) {
        disconnect()
      }
    }
  }, [socket, connect, disconnect, userInfo.user])

  React.useEffect(() => {
    if (socket && socketCmds && userInfo.user) {
      console.log('new user')
      socket.emit(socketCmds.newUser, {username: userInfo.user.username})
    }
  }, [socket, userInfo.user, socketCmds])

  return (
    <div
      style={getContainerStyle()}
    >
      { window.innerWidth > 400 && <OnlineUsers /> }
      <div
        style={getInnerContainerStyle()}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12
          }}
        >
          <div>welcome {userInfo.user.username}</div>
          <DateTimeFluent />
          <div><div className='logout' onClick={logout}>logout</div></div>
        </div>
        <Board />
        <MessageBoardForm username={userInfo.user.username} />
      </div>
    </div>
  )
}

export default MessageBoard
