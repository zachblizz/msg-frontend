import React from 'react'
import OnlineUsers from '../../components/OnlineUsers'
import Board from '../../components/Board'
import MessageBoardForm from '../../components/MessageBoardForm'
import DateTimeFluent from '../../components/DateTimeFluent'
import ThemeBtn from '../../components/ThemeBtn'
import { useUser } from '../../context/user-context'
import { useSocket } from '../../context/socket-context'
import { useTheme } from '../../context/theme-context'
import { getContainerStyle, getInnerContainerStyle } from '../../utils'

function MessageBoard() {
  const { userInfo, setUserInfo } = useUser()
  const { theme } = useTheme()
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
      if (socket && userInfo.user) {
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
      style={getContainerStyle(theme)}
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
          <div className='logout' onClick={logout}>logout</div>
          <ThemeBtn />
        </div>
        <Board />
        <MessageBoardForm username={userInfo.user.username} theme={theme} />
      </div>
    </div>
  )
}

export default MessageBoard
