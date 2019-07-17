import React from 'react'
import { useSocket } from './socket-context'
import { useMessages } from './messages-context'

const storageCmds = {
  currentRoom: 'client:current-room',
  rooms: 'client:rooms'
}

const RoomContext = React.createContext()

function RoomProvider({ children }) {
  const { socket, socketCmds } = useSocket()
  const { setMessages } = useMessages()
  const [room, setRoom] = React.useState(() => {
    const localRoom = localStorage.getItem(storageCmds.currentRoom)
    if (localRoom) {
      return JSON.parse(localRoom)
    }
    return { room: '/', roomName: 'general' }
  })
  const [rooms, setRooms] = React.useState(() => {
    const localRooms = localStorage.getItem(storageCmds.rooms)
    if (localRooms) {
      return JSON.parse(localRooms)
    }

    return [{ room: '/', chatName: 'general' }]
  })

  const joinRoom = React.useCallback(roomInfo => {
    // don't want to join to start a private room twice
    if (!rooms.find(r => r.room === roomInfo.room)) {
      setMessages([])

      if (roomInfo.switch) {
        socket.emit(socketCmds.leaveRoom, roomInfo)
      } else {
        // update rooms context
        setRooms(rooms => {
          const tmpRooms = [...rooms, roomInfo]
          // set rooms in local storage
          localStorage.setItem(storageCmds.rooms, JSON.stringify(tmpRooms))
          return tmpRooms
        })
      }
      // tell the server to start new room
      socket.emit(socketCmds.startPrivateChat, roomInfo)
    }

    // set current room in local storage
    localStorage.setItem(storageCmds.currentRoom, JSON.stringify(roomInfo))
    // set room context
    setRoom(roomInfo)
  }, [socket, socketCmds, setMessages, rooms])

  function leaveRoom(roomInfo) {
    const room = roomInfo.room
    socket.emit(socketCmds.leaveRoom, { room })
    setRooms(rooms => {
      // filter out room left
      const tmpRooms = rooms.filter(r => r.room !== room)
      localStorage.setItem(storageCmds.rooms, JSON.stringify(tmpRooms))

      // join general chat
      const generalRoom = tmpRooms.find(r => r.room === '/')
      localStorage.setItem(storageCmds.currentRoom, JSON.stringify(generalRoom))
      setRoom(generalRoom)
      joinRoom({ ...generalRoom, switch: true })

      return tmpRooms
    })
  }

  function updateRoomName(updatedRoom) {
    setRoom(updatedRoom)
    localStorage.setItem(storageCmds.currentRoom, JSON.stringify(updatedRoom))
    setRooms(rooms => {
      const updatedRooms = rooms.map(r => {
        if (r.room === updatedRoom.room) {
          return updatedRoom
        }
        return r
      })
      localStorage.setItem(storageCmds.rooms, JSON.stringify(updatedRooms))
      return updatedRooms
    })
  }

  return (
    <RoomContext.Provider
      value={{
        room,
        setRoom,
        rooms,
        setRooms,
        joinRoom,
        leaveRoom,
        updateRoomName,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}

function useRoom() {
  const context = React.useContext(RoomContext)
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider')
  }
  return context
}

export { RoomProvider, useRoom }
