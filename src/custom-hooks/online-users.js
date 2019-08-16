import { useEffect } from 'react'

import { useSocket } from '../context/socket-context'
import { useOnline, useUser } from '../context/user-context'

function useOnlineUsers() {
  const { online, setOnline } = useOnline()
  const { userInfo, usersTyping, setUsersTyping } = useUser()
  const { socket, socketCmds } = useSocket()

  useEffect(() => {
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

  return { online, userInfo, usersTyping }
}

export { useOnlineUsers }
