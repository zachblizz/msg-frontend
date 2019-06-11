import React from 'react'
import moment from 'moment'

const formatDate = strDate => {
  if (strDate) {
    const date = new Date(strDate)
    return moment(date).format('MMM, DD HH:mm:ss')
  }
}

function DateTimeFluent() {
  const [dateTime, setDateTime] = React.useState(new Date())

  React.useEffect(() => {
    const intervalId = setInterval(() => setDateTime(new Date()), 1000)
    return () => clearInterval(intervalId)
  }, [])

  return <div>{formatDate(dateTime)}</div>
}

export default DateTimeFluent
