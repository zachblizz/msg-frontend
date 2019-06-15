import React from 'react'
import { useTheme } from '../context/theme-context'

function ThemeBtn() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className='hover-div' onClick={toggleTheme}>
      {theme}
    </div>
  )
}

export default ThemeBtn