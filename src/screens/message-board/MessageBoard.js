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

  React.useMemo(() => {
    console.log('connect')
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
    console.log('emit')
    if (socket && socketCmds && userInfo.user) {
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
            alignItems: 'center',
            background: '#f2f3f7',
            padding: 20
          }}
        >
          <div>welcome {userInfo.user.username}</div>
          <DateTimeFluent />
          <ThemeBtn />
          <div className='hover-div' onClick={logout}>logout</div>
        </div>
        <Board />
        <MessageBoardForm username={userInfo.user.username} theme={theme} />
      </div>
    </div>
  )
}

export default MessageBoard
