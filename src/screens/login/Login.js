import React from 'react'
import { useUser } from '../../context/user-context'
import Loading from '../../components/Loading'

function Login() {
  const [username, setUsername] = React.useState('')
  const [btnInfo, setBtnInfo] = React.useState({loading: false, child: 'go to board'}) 
  const { newUser, userInfo } = useUser()

  function handleSubmit(event) {
    event.preventDefault()
    setBtnInfo({loading: true, child: <Loading style={{width: 10, height: 10}} />})
    newUser(username, setBtnInfo)
  }

  function handleChange(event) {
    setUsername(event.target.value)
  }

  return (
    <form
      style={{
        padding: 20,
        marginTop: 150,
        textAlign: 'left'
      }}
      onSubmit={handleSubmit}
    >
      <div style={{ padding: 10 }}>
        <div style={{ margin: '20px 10px' }}>
          <label htmlFor='username'>username</label><br />
          <input
            style={{
              border: userInfo && userInfo.badUser ? '1px solid #ff5252' : '1px solid #ddd',
              padding: '0px 5px'
            }}
            id='username'
            onChange={handleChange} 
          />
          {userInfo && userInfo.badUser && 
            <div style={{color: '#ff5252', fontSize: 10}}>
              {userInfo.msg}
            </div>
          }
        </div>
        <button
          type='submit'
          value='Submit'
          style={{
            width: 100,
            marginLeft: 10
          }}
          disabled={btnInfo.loading}
        >{btnInfo.child}</button>
      </div>
    </form>
  )
}

export default Login
