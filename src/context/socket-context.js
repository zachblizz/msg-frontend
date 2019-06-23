import React from 'react'
import io from 'socket.io-client'
import client from '../utils/api-client'

const SocketContext = React.createContext()

const storageCmds = {
  currentRoom: 'client:current-room',
  rooms: 'client:rooms'
}

function SocketProvider({children}) {
  const [socket, setSocket] = React.useState(null)
  const [socketCmds, setSocketCmds] = React.useState({})
  const [room, setRoom] = React.useState(() => {
    const localRoom = localStorage.getItem(storageCmds.currentRoom)
    return localRoom || undefined
  })
  const [rooms, setRooms] = React.useState(() => {
    const localRooms = localStorage.getItem(storageCmds.rooms)
    if (localRooms) {
      return JSON.parse(localRooms)
    }

    return ['/']
  })

  const joinRoom = React.useCallback(roomInfo => {
    if (roomInfo.switch) {
      socket.emit(socketCmds.leaveRoom, roomInfo)
    } else {
      // update rooms context
      setRooms(rooms => {
        const tmpRooms = [...rooms, roomInfo.room]
        // set rooms in local storage
        localStorage.setItem(storageCmds.rooms, JSON.stringify(tmpRooms))
        return tmpRooms
      })
    }
    // tell the server to start new room
    socket.emit(socketCmds.startPrivateChat, roomInfo)
    // set current room in local storage
    localStorage.setItem(storageCmds.currentRoom, roomInfo.room)
    // set room context
    setRoom(roomInfo.room)
  }, [socket, socketCmds])

  React.useEffect(() => {
    async function getSocketCmds() {
      try {
        const data = await client('socketCmds')
        const commands = data.commands
        setSocketCmds(commands)
      } catch (err) {
        console.error(err)
      }
    }

    getSocketCmds()
  }, [room, joinRoom])

  function connect(username) {
    setSocket(socket => {
      socket = io(`http://localhost:8080`, {transports: ['websocket']})
      console.log('going to send newUser')
      socket.emit(socketCmds.newUser, {username})
      return socket
    })
  }

  function leaveRoom(info) {
    const room = info.username
    socket.emit(socketCmds.leaveRoom, {room})
    setRooms(rooms => {
      const tmpRooms = rooms.filter(r => r !== room)
      localStorage.setItem(storageCmds.rooms, JSON.stringify(tmpRooms))
      return tmpRooms
    })
  }

  function disconnect() {
    console.log('disconnecting...')
    socket.disconnect()
    socket.removeAllListeners()
    setSocket(null)
  }

  return (
    <SocketContext.Provider 
      value={{
        socket,
        socketCmds,
        connect,
        disconnect,
        room,
        setRoom,
        rooms,
        joinRoom,
        leaveRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

function useSocket() {
  const context = React.useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocketCommands must be used within a SocketProvider')
  }
  return context
}

export {
  SocketProvider,
  useSocket,
}
