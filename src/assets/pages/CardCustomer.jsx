import React, { useEffect, useState } from 'react';
import '../styles/profileCard.css';
import usePayment from '../../hook/usePayment';
import { format } from 'date-fns';
import closedSvg from '../images/icons/icon _close circle.svg';
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';
import MethodPay from '../components/MethodPay';

const CardCustomer = () => {

  const { GetCardMasked, getCard, DeleteCardCustomer } = usePayment();
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false)
    window.location.reload();
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    GetCardMasked();
  },[]);
  
  const deleteCardHandler = (cardID, cardNUMBER) => {
    Swal.fire({
      title: "Eliminar tarjeta",
      html: `<p>¿Desea eliminar la tarjeta ${cardNUMBER} de su cuenta?</p>`,
      icon: "question",
      iconColor: 'var(--primary)',
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: 'Cancelar',
      cancelButtonColor: "var(--primary)",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteCardCustomer(cardID);
      }
    });
  };

  return (
    <>
    <section className='container card__customer'>
        <div className='px-3'>
          <div className='card-top'>
            <h5 className='pay__panel__title mb-0 title__panel'>Tarjetas</h5>
            <button className='btn btn-primary' onClick={handleShow}>Agregar tarjeta</button>
          </div>
            <div className='card__customer__body'>
              <p className='color-primary fw-bold'>Listado de tarjetas</p>
              <div className="card__body" style={{ gridTemplateColumns: getCard.length <= 3 ? 'repeat(auto-fit, minmax(250px, 300px))' : 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                  {
                    getCard?.map(card => (
                      <ul className="card mb-0 p-0" key={card.cardId} >
                        <div className='card-header text-end'>
                          <img className='cursor-pointer' src={closedSvg} onClick={()=> deleteCardHandler(card.cardId, card.cardNumber)}/>
                        </div>
                        <div className='py-2 px-3'>
                          <li className='mb-2'>Nombre del tarjeta habiente: <span className='fw-bold'>{card.cardName}</span></li>
                          <li className='mb-2'>Número de tarjeta: <span className='fw-bold'>{card.cardNumber}</span></li>
                          <li>Fecha de creación: <span className='fw-bold'>{format(new Date(card.createAt), 'dd/MM/yyyy')}</span></li>
                        </div>
                      </ul>
                    ))
                  }
              </div>
            </div>
        </div>
    </section>
    <Modal id='card__create' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Insertar nueva tarjeta</Modal.Title>
        </Modal.Header>
            <Modal.Body>
              <MethodPay />
            </Modal.Body>
            <Modal.Footer>
                <button type='button' className="btn btn-primary" onClick={handleClose}>Cerrar</button>
            </Modal.Footer>
      </Modal>
    </>
  )
}

export default CardCustomer;