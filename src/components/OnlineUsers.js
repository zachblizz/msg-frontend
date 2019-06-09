import React from 'react'
import { useOnline } from '../context/user-context'
import Loading from './Loading';

function OnlineUsers() {
  const { online } = useOnline()

  return (
    <div
      style={{
        width: '20%',
        height: '100%',
        flexDirection: 'column',
        textAlign: 'left',
        borderRight: '1px solid #eee',
        overflow: 'scroll'
      }}
    >
      <h3>Online:</h3>
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
                >{user.username}</button>
              </div>
            ))
      }
    </div>
  )
}

export default OnlineUsers
