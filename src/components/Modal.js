import React from 'react'
import { useModal } from '../context/modal-context'

import '../styles/Modal.css'

function Modal() {
  const { open, modalData, setOpen } = useModal()

  return (
    open && modalData.actionOk && 
      <div className='modal-container'>
        <div className='modal-wrapper'>
          <div className='modal-header'>
            <h3>{modalData.info.title}</h3>
            <div className='hover-div red' onClick={() => setOpen(false)}>&times;</div>
          </div>
          <div className='modal-content'>
            {modalData.info.children}
          </div>
          <div className='modal-action-btn'>
            <button
              className='lite-btn'
              onClick={modalData.actionOk}
            >ok</button>
          </div>
        </div>
      </div>
  )
}

export default Modal
