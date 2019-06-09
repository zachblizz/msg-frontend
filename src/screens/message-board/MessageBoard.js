import React from 'react'
import { useUser, useOnline } from '../../context/user-context'
import { useSocket } from '../../context/socket-context'
import OnlineUsers from '../../components/OnlineUsers'
import Board from '../../components/Board'
import MessageBoardForm from './MessageBoardForm'

function MessageBoard() {
  const { userInfo } = useUser()
  const { setOnline } = useOnline()
  const { socket,socketCmds } = useSocket()

  React.useEffect(() => {
    if (socket && socketCmds) {
      socket.on(socketCmds.sendOnlineUsers, ({onlineUsers}) => setOnline(onlineUsers))
      socket.on(socketCmds.loggedOut, ({msg}) => {
        console.log(msg)
        alert(msg)
      })
      socket.emit(socketCmds.newUser, {username: userInfo.user.username})
    }

    return () => {
      if (socket) {
        localStorage.removeItem('client:user')
        socket.disconnect()
      }
    }
  }, [socket, userInfo.user.username, socketCmds, setOnline])


  return (
    <div
      style={{
        width: '90%',
        height: 600,
        padding: 30,
        margin: '0 auto',
        marginTop: 150,
        border: '1px solid #eee',
        display: 'flex',
      }}
    >
      <OnlineUsers />
      <div
        style={{
          flexDirection: 'column',
          width: '80%',
          marginLeft: 30
        }}
      >
        <div>welcome {userInfo.user.username}</div>
        <Board />
        <MessageBoardForm username={userInfo.user.username} />
      </div>
    </div>
  )
}

export default MessageBoard
