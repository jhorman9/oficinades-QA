import React from 'react'

const ModalButton = ({ handleShow, text }) => {
  return (
    <button onClick={handleShow} className='btn btn-primary'>{text}</button>
  )
}

export default ModalButton