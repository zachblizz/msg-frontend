import React from 'react'

const ThemeContext = React.createContext()

function ThemeProvider({children}) {
  const [theme, setTheme] = React.useState('Lite')

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
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
