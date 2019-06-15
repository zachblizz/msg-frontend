import React from 'react'

const ThemeContext = React.createContext()

function ThemeProvider({children}) {
  const [theme, setTheme] = React.useState(() => {
    let localTheme = localStorage.getItem('client:theme')
    if (localTheme) {
      return localTheme
    }
    return 'lite'
  })

  function toggleTheme() {
    const newTheme = theme === 'lite' ? 'dark' : 'lite'
    localStorage.setItem('client:theme', newTheme)
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme() {
  // { theme: "lite", setTheme: (theme) => this.setState({theme})}
  const context = React.useContext(ThemeContext) 
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export { useTheme, ThemeProvider }
