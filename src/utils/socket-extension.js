import React from 'react'

function onAskToJoin({requester, room}) {
  if (room === `/${userInfo.user.username}` && !rooms.find(r => r.room !== room)) {
    toast(
      <div style={{display: 'flex'}}>
        <div style={{width: '70%', alignItems: 'center'}}>join chat with {requester}</div>
        <div
          className='hover-div'
          style={{width: '30%'}}
          onClick={() => joinRoom({room})}
        >
          join
        </div>
      </div>,
      { autoClose: false }
    )
  }
}