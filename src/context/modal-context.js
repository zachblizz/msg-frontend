import React from 'react'

const ModalContext = React.createContext()

function ModalProvider({children}) {
  const [open, setOpen] = React.useState(false)
  const [modalData, setModalData] = React.useState({})

  return (
    <ModalContext.Provider value={{open, setOpen, modalData, setModalData}}>
      {children}
    </ModalContext.Provider>
  )
}

function useModal() {
  const context = React.useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

export { ModalProvider, useModal }
