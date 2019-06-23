import React from 'react'
import { useRoom } from '../context/room-context'
import { useModal } from '../context/modal-context'

function Rooms() {
  const { room, rooms, joinRoom, leaveRoom, updateRoomName } = useRoom()
  const { setOpen, setModalData } = useModal()

  function editRoomName(r) {
    const updatedRoom = {...r}
    const actionOk = () => {
      updateRoomName(updatedRoom)
      setOpen(false)
    }

    setModalData({
      info: {
        title: 'change room name',
        children: <form onSubmit={actionOk}>
          <input
            placeholder='change name...'
            onChange={({target: { value }}) => updatedRoom.roomName = value}
          />
        </form>
      },
      actionOk
    })
    setOpen(true)
  }

  return (
    <div
      style={{
        display: 'flex'
      }}
    >
      {rooms.map(r => 
        <div key={r.room}
          style={{
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            width: '30%',
            marginRight: 2
          }}
        >
          <div
            style={{
              color: room === r ? 'orange' : '#555',
              padding: 5,
              margin: 1,
              width: '80%'
            }}
            className='hover-div'
            onClick={() => joinRoom({...r, switch: true})}
            disabled={r.room === room.room}
            title={`${r.room === room.room ? 'in' : 'join'} ${r.roomName || r.room}`}
          >
            {r.roomName || r.room}
          </div>
          <div
            className='hover-div room-edits'
            onClick={() => editRoomName(r)}
            style={{width: '10%'}}
            title='edit room info'
          >edit</div>
          { r.room !== '/' && 
            <div
              className='hover-div red room-edits'
              onClick={() => leaveRoom(r)}
              style={{width: '10%'}}
              title='leave room'
            >&times;</div>
          }
        </div>
      )}
    </div>
  )
}

export default Rooms
