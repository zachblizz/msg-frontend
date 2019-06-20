import colors from './colors'

function getContainerStyle(theme) {
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
    margin: '0 auto',
    marginTop: 150,
    display: 'flex',
    ...colors[theme]
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
    background: '#f6f8fc',
    width: '80%'
  }
}

export {
  getContainerStyle,
  getInnerContainerStyle
}
