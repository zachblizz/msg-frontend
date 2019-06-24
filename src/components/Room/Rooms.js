import React from 'react'
import EditableRoomInfo from './EditableRoomInfo'
import { useRoom } from '../../context/room-context'

function Rooms() {
  const { rooms, leaveRoom } = useRoom()
  const [editRoom, setEditRoom] = React.useState({editable: false})

  return (
    <div
      style={{
        display: 'flex'
      }}
    >
      { rooms.map(r => 
        <div key={r.room}
          style={{
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            width: '30%',
            marginRight: 2
          }}
        >
          <EditableRoomInfo r={r} setEditRoom={setEditRoom} editRoom={editRoom} />
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
