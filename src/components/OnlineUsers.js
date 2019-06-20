import React from 'react'
import Loading from './Loading'
// import colors from '../utils/colors'
import { useOnline, useUser } from '../context/user-context'
import { useSocket } from '../context/socket-context'
import { useTheme } from '../context/theme-context'

function OnlineUsers() {
  const { online, setOnline } = useOnline()
  const { usersTyping, setUsersTyping } = useUser()
  const { socket, socketCmds } = useSocket()
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

  return (
    <div
      style={{
        width: '20%',
        height: '100%',
        overflow: 'hidden',
        background: '#fff',
        padding: '0px 10px'
      }}
    >
      <div
        style={{
          height: 'calc(100% + 17px)',
          width: 'calc(100% + 16px)',
          flexDirection: 'column',
          textAlign: 'left',
          overflow: 'scroll'
        }}
      >
        <h3>Online</h3>
        {
          !online.length === 0
            ? <Loading style={{ width: 30, height: 30 }} />
            : online.map(user => (
                <div 
                  key={user.username}
                  style={{
                    marginBottom: 7
                  }}
                >
                  <button
                    className={theme === 'lite' ? 'lite-btn' : 'dark-btn'}
                    style={{width: '80%'}}
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
