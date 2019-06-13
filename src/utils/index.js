function getContainerStyle(theme) {
  const background = theme === 'Lite' ? '#fff' : '#333'
  const color = theme === 'Lite' ? '#333' : '#fff'

  if (window.innerWidth < 400) {
    return {
      height: 600,
      margin: '0 auto',
      display: 'flex',
    }
  }

  return {
    width: '90%',
    height: 600,
    padding: 30,
    margin: '0 auto',
    marginTop: 150,
    border: '1px solid #eee',
    display: 'flex',
    background,
    color,
  }
}

function getInnerContainerStyle() {
  if (window.innerWidth < 400) {
    return {
      flexDirection: 'column',
      width: '100%'
    }
  }
  
  return {
    flexDirection: 'column',
    width: '80%',
    marginLeft: 30
  }
}

export {
  getContainerStyle,
  getInnerContainerStyle
}
