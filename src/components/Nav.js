import React from 'react'
import DateTimeFluent from './DateTimeFluent'

import { useUser } from '../context/user-context'

import Bug from '../assets/bug.png'

function Nav() {
  const { userInfo, setUserInfo } = useUser()
  const leave = React.useCallback(() => {
    localStorage.removeItem('client:user')
    setUserInfo({})
  }, [setUserInfo])

  return (
    <div className='welcome-container'>
      <div className='welcome-centered'>
        <div>welcome {userInfo.user.username}</div>
        <DateTimeFluent />
        <a 
          className='hover-div'
          target='__blank'
          href='https://github.com/zachblizz/msg-frontend/issues/new'
        >
          <img title='report a bug' style={{width: 30}} src={Bug} alt='bug' />
        </a>
        <div className='hover-div' onClick={leave}>leave</div>
      </div>
    </div>
  )
}

export default Nav
