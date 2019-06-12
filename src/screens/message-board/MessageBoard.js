import React from 'react'
import { useUser, useOnline } from '../../context/user-context'
import { useSocket } from '../../context/socket-context'
import OnlineUsers from '../../components/OnlineUsers'
import Board from '../../components/Board'
import MessageBoardForm from './MessageBoardForm'
import DateTimeFluent from '../../components/DateTimeFluent'
import { getContainerStyle, getInnerContainerStyle } from '../../utils'

function MessageBoard() {
  const { userInfo, setUserInfo } = useUser()
  const { setOnline } = useOnline()
  const { socket, socketCmds } = useSocket()
  const logout = React.useCallback(() => {
    localStorage.removeItem('client:user')
    socket.disconnect()
    setUserInfo({})
  }, [socket, setUserInfo])

  React.useEffect(() => {
    if (socket && socketCmds) {
      socket.emit(socketCmds.newUser, {username: userInfo.user.username})
    }

    return logout
  }, [socket, userInfo.user.username, socketCmds, setOnline, logout])

  console.log('msg board...')

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
