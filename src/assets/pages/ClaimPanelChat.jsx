import React, { useEffect } from 'react';
import '../styles/ClaimPanelChat.css';
import SVGArrowRight from '../images/icons/SVGArrowRight';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/ClaimPanelChat.css';
import useComplaints from '../../hook/useComplaints';
import { isValid, parseISO, format } from 'date-fns';


const ClaimPanelChat = () => {

  const {id, chatId} = useParams();
  const navigate = useNavigate();
  const { getAllComplaintsByExternaId, getAllComplaintsByObsId } = useComplaints();

  const backToClaim = () => {
    navigate(`/panel/${id}/claim`);
  }
  
  useEffect(() =>{
    if (getAllComplaintsByObsId.createAt) {
      const parsedDate = parseISO(getAllComplaintsByObsId.createAt);
      if (isValid(parsedDate)) {
        getAllComplaintsByObsId.createAt = format(parsedDate, 'dd/MM/yyyy hh:mm:ss');
      }
    }

    if(chatId) {
      getAllComplaintsByExternaId(chatId);
    }
  }, []);

  return (
    <section className='claim__panel__chat container'>
      <div className="claim__panel__chat__container">
        <div className="btn-back mb-3" onClick={backToClaim}>
            <SVGArrowRight />
            <span className='color-primary ms-2'>Volver</span>
        </div>
        <div className="claim__title">
          <h5 className='title__panel mb-3'>RECLAMO #{getAllComplaintsByObsId.obsId}</h5>
        </div>
        <div className="claim__panel__chat__body">
          <div className="claim__panel__two">
            <div className="data__client__content">
              <div className="claim__data__client item-1">
                <h6 className='color-primary'><strong className='text-white'>Datos del cliente:</strong></h6>
                <ul className='list-style-none ps-0 mb-0'>
                  <li><strong>Nombre:</strong> {getAllComplaintsByObsId.customer?.name}</li>
                  <li><strong>Número de cliente:</strong> {getAllComplaintsByObsId.customer?.nicCode}</li>
                  <li><strong>Dirección:</strong> {getAllComplaintsByObsId.customer?.address}</li>
                  <li><strong>Correo:</strong> {getAllComplaintsByObsId.customer?.email}</li>
                  <li><strong>Teléfono fijo:</strong> {getAllComplaintsByObsId.customer?.phoneNumber1}</li>
                  <li><strong>Celular:</strong> {getAllComplaintsByObsId.customer?.phoneNumber2}</li>
                </ul>
              </div>
              <div className="claim__data__client item-2">
                <h6 className='color-primary'><strong>Datos del reclamo:</strong></h6>
                <ul className='list-style-none ps-0 mb-0'>
                  <li><strong>Estado:</strong> {getAllComplaintsByObsId.status}</li>
                  <li><strong>Fecha de registro:</strong> {getAllComplaintsByObsId.createAt}</li>
                  <li><strong>Tipo de reclamo:</strong> {getAllComplaintsByObsId.typeComplaint}</li>
                  <li><strong>Observación:</strong> {getAllComplaintsByObsId.observations}</li>
                  <li><strong>Respuesta:</strong> {getAllComplaintsByObsId.response}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ClaimPanelChat;