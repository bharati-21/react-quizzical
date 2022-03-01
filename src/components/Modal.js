import React from 'react'

const Modal = ({toggleModal}) => {
  return (
    <div className="modal">
        <div className="modal-content">
            <p className="modal-text">Please answer all the question</p>
            <button onClick={toggleModal}>Close</button>
        </div>
    </div>
  )
}

export {Modal};