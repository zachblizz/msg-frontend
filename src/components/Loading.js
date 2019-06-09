import React from 'react'

function Loading({children, style}) {
  return (
    <div>
      <div className='spinner spinner-action' style={style}></div>
      {children}
    </div>
  )
}

export default Loading
