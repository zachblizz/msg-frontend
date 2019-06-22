import React from 'react'
import Loading from './Loading'
import { useOnline, useUser } from '../context/user-context'
import { useSocket } from '../context/socket-context'
import { useTheme } from '../context/theme-context'

import '../styles/Online.css'

function OnlineUsers() {
  const { online, setOnline } = useOnline()
  const { userInfo, usersTyping, setUsersTyping } = useUser()
  const { socket, socketCmds, joinRoom, rooms } = useSocket()
  const { theme } = useTheme()

  React.useEffect(() => {
    if (socket && socketCmds) {
      socket.on(socketCmds.sendOnlineUsers, ({onlineUsers}) => setOnline(onlineUsers))
      socket.on(socketCmds.typing, ({user}) => {
        if (user) {
          setUsersTyping({...usersTyping, [user.username]: true})
        }
      })
      socket.on(socketCmds.doneTyping, ({user}) => {
        if (user) {
          delete usersTyping[user.username]
          setUsersTyping({...usersTyping})
        }
      })

      return () => {
        socket.removeEventListener(socketCmds.typing)
        socket.removeEventListener(socketCmds.doneTyping)
        socket.removeEventListener(socketCmds.sendOnlineUsers)
      }
    }
  }, [socket, socketCmds, setUsersTyping, usersTyping, setOnline])

  function startPrivateChat(username) {
    return () => {
      joinRoom({
        room: `/${username}`,
        requester: userInfo.user.username
      })
    }
  }

  return (
    <div className='online-container-no-scroll'>
      <div className='online-container-scroll'>
        <h3>Online</h3>
        {
          !online.length === 0
            ? <Loading style={{ width: 30, height: 30 }} />
            : online.map(user => (
                <div 
                  key={user.username}
                  style={{marginBottom: 7}}
                >
                  <button
                    className={theme === 'lite' ? 'lite-btn' : 'dark-btn'}
                    style={{width: '80%'}}
                    disabled={
                      rooms.includes(user.username) &&
                      user.username !== userInfo.user.username
                    }
                    onClick={startPrivateChat(user.username)}
                  >
                    {user.username}
                    {usersTyping[user.username] && '...'}
                  </button>
                </div>
              ))
        }
      </div>
    </div>
  )
}

export default OnlineUsers
