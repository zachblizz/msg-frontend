import React from 'react'
import { useTheme } from '../context/theme-context'

function ThemeBtn() {
   const { theme, setTheme } = useTheme()

   function toggleTheme(){
    setTheme((text) => {
      return text === 'Lite' ? 'Dark' : 'Lite'
    })
  }

  return (
    <button onClick={toggleTheme}>
      {theme}
    </button>
  )
}

export default ThemeBtn