import React from 'react'
import { useRoom } from '../../context/room-context'

function EditableRoomInfo({ r, editRoom, setEditRoom }) {
  const { room, joinRoom, updateRoomName } = useRoom()

  function changeRoomName(e) {
    e.preventDefault()
    updateRoomName(r)
    setEditRoom({editable: false, room: undefined})
  }

  function newRoomName(e) {
    r.roomName = e.target.value
  }

  function updateRoom() {
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        setEditRoom({editable: false, room: undefined})
      }
    })
    setEditRoom({editable: true, room: r.room})
  }

  if (editRoom.editable && editRoom.room === r.room) {
    return <form
      style={{ width: '100%', padding: 5 }}
      onSubmit={changeRoomName}
    >
      <input
        style={{ padding: 5, width: '90%' }}
        placeholder={`old room: ${r.roomName || 'change name...'}`}
        onChange={newRoomName}
      />
    </form>
  }

  return (
    <>
      <div
        style={{
          color: room === r ? 'orange' : '#555',
          padding: 6,
          width: '80%'
        }}
        className='hover-div'
        onClick={() => joinRoom({ ...r, switch: true })}
        disabled={r.room === room.room}
        title={`${r.room === room.room ? 'in' : 'join'} ${r.roomName || r.room}`}
      >
        {r.roomName || r.room}
      </div>
      <div
        className='hover-div room-edits'
        onClick={updateRoom}
        style={{ width: '15%' }}
        title='edit room info'
      >
        edit
      </div>
    </>
  )
}

export default EditableRoomInfo
