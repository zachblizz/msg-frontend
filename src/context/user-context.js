import React from 'react'
import client from '../utils/api-client'

const UserContext = React.createContext()
const OnlineUserContext = React.createContext()

function UserProvider({children}) {
  const [userInfo, setUserInfo] = React.useState(() => {
    let localUser = localStorage.getItem('client:user')
    if (localUser) {
      return JSON.parse(localUser)
    }

    return null
  })

  const newUser = async (username, setBtnInfo) => {
    try {
      if (!userInfo || !userInfo.userAdded) {
        const data = await client('login', {
          body: {username},
          method: 'put'
        })
        localStorage.setItem('client:user', JSON.stringify(data))

        if (data.userAdded) {
          setUserInfo({
            user: data.user,
            badUser: false
          })
        } else {
          setUserInfo({
            user: null,
            badUser: true,
            msg: data.msg
          })
        }

        if (!data.userAdded) {
          setBtnInfo({loading: false, child: 'go to board'})
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <UserContext.Provider value={{userInfo, newUser}}>
      {children}
    </UserContext.Provider> 
  )
}

function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used under a UserProvider')
  }
  return context
}

function OnlineUsersProvider({children}) {
  const [online, setOnline] = React.useState([])

  return (
    <OnlineUserContext.Provider value={{online, setOnline}}>
      {children}
    </OnlineUserContext.Provider>
  )
}

function useOnline() {
  const context = React.useContext(OnlineUserContext)
  if (context === undefined) {
    throw new Error('useOnline must be used under a OnlineUsersProvider')
  }
  return context
}

export {
  UserProvider,
  useUser,
  OnlineUsersProvider,
  useOnline
}
