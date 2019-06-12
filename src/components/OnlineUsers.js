import React from 'react'
import { useOnline, useUser } from '../context/user-context'
import { useSocket } from '../context/socket-context'
import Loading from './Loading';

function OnlineUsers() {
  const { online, setOnline } = useOnline()
  const { usersTyping, setUsersTyping } = useUser()
  const { socket, socketCmds } = useSocket()

  React.useEffect(() => {
    if (socket) {
      socket.on(socketCmds.sendOnlineUsers, ({onlineUsers}) => setOnline(onlineUsers))
      socket.on(socketCmds.typing, ({user}) => 
        setUsersTyping({...usersTyping, [user.username]: true})
      )
      socket.on(socketCmds.doneTyping, ({user}) => {
        delete usersTyping[user.username]
        setUsersTyping({...usersTyping})
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
        borderRight: '1px solid #eee',
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
                    style={{
                      width: '80%'
                    }}
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
