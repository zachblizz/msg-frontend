import React from 'react'
import Login from './screens/login/Login'
import { useUser } from './context/user-context'
import Loading from './components/Loading'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import './App.css'

const loadMessageBoard = () => import('./screens/message-board/MessageBoard')
const MessageBoard = React.lazy(loadMessageBoard)

function App() {
  const { userInfo } = useUser()

  React.useEffect(() => {
    document.title = 'msg me'
    loadMessageBoard()
  }, [])

  return (
    <div className="App">
      <React.Suspense fallback={
        <Loading style={{ marginTop: 150, marginBottom: 10, height: 40, width: 40 }}>
          <div>loading...</div>
        </Loading>
      }>
        <ToastContainer />
        { userInfo && userInfo.user && userInfo.user.username
          ? <MessageBoard />
          : <Login />
        }
      </React.Suspense>
    </div>
  )
}

export default App
