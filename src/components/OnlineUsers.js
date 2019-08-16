import React from 'react'

import Loading from './Loading'

import { useTheme } from '../context/theme-context'
import { useRoom } from '../context/room-context'

import { useOnlineUsers } from '../custom-hooks/online-users'

import '../styles/Online.css'

function OnlineUsers() {
  const { online, userInfo, usersTyping } = useOnlineUsers()
  const { joinRoom, rooms } = useRoom()
  const { theme } = useTheme()


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
