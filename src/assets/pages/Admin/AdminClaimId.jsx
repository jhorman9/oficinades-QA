import React, { useEffect } from 'react'
import SVGArrowRight from '../../images/icons/SVGArrowRight';
import { useNavigate, useParams } from 'react-router-dom';
import useComplaints from '../../../hook/useComplaints';
import useComplaint from '../../../hook/useComplaint';

const AdminClaimId = () => {

  const navigate = useNavigate();

  const backToClaim = () => {
    navigate(`/admin/claims`);
  }
  const {claimId} = useParams();
  const { GetComplaintById, getComplaintByID } = useComplaint();
  
  useEffect(() =>{
    if (getComplaintByID?.createAt) {
      const parsedDate = parseISO(getComplaintByID.createAt);
      if (isValid(parsedDate)) {
        getComplaintByID.createAt = format(parsedDate, 'dd/MM/yyyy hh:mm:ss');
      }
    }

    if(claimId) {
      GetComplaintById(claimId);
    }
  }, []);

  console.log(getComplaintByID);

  return (
    <section className='claim__panel__chat container'>
      <div className="claim__panel__chat__container">
        <div className="btn-back mb-3" onClick={backToClaim}>
            <SVGArrowRight />
            <span className='color-primary ms-2'>Volver</span>
        </div>
        <div className="claim__title">
          <h5 className='title__panel mb-3'>RECLAMO #{getComplaintByID?.obsId}</h5>
        </div>
        <div className="claim__panel__chat__body">
          <div className="claim__panel__two">
            {/* <div className="chat__content">
              <h6 className='color-primary fw-bold'>Historial de reclamo</h6>
              <div className="claim__conversation">
                <div className="claim__conversation__item">
                  <div className="claim__photo">
                    <span>W</span>
                  </div>
                  <div className='claim__text'>
                    <p className='mb-0 fw-bold'>Williams Laforgia</p>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ex esse enim distinctio labore nostrum, ipsum est doloremque quam rerum praesentium ratione, ut natus porro alias, numquam cumque vero impedit excepturi illum sint voluptatum! Quam provident at, placeat sed deserunt inventore, corrupti earum labore, quis id explicabo laboriosam minima? Voluptatem, reiciendis.</p>
                  </div>
                </div>
                <div className="claim__conversation__item" style={{flexDirection: 'row-reverse'}}>
                  <div className="claim__photo">
                    <span>J</span>
                  </div>
                  <div className='claim__text'>
                    <p className='mb-0 fw-bold' style={{textAlign: 'end'}}>Jhorman Nieto P</p>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ex esse enim distinctio labore nostrum, ipsum est doloremque quam rerum praesentium ratione, ut natus porro alias, numquam cumque vero impedit excepturi illum sint voluptatum! Quam provident at, placeat sed deserunt inventore, corrupti earum labore, quis id explicabo laboriosam minima? Voluptatem, reiciendis.</p>
                  </div>
                </div>
                <div className="claim__input__chat mt-3">
                  <textarea></textarea>
                  <div className="absolute">
                    <SVGSend />
                  </div>
                </div>
              </div>
            </div> */}
            <div className="data__client__content">
              <div className="claim__data__client item-1">
                <h6 className='color-primary'><strong className='text-white'>Datos del cliente:</strong></h6>
                <ul className='list-style-none ps-0 mb-0'>
                  <li><strong>Nombre:</strong> {getComplaintByID?.customer.name}</li>
                  <li><strong>Número de cliente:</strong> {getComplaintByID?.customer.nicCode}</li>
                  <li><strong>Dirección:</strong> {getComplaintByID?.customer.address}</li>
                  <li><strong>Correo:</strong> {getComplaintByID?.customer.email}</li>
                  <li><strong>Teléfono fijo:</strong> {getComplaintByID?.customer.phoneNumber1}</li>
                  <li><strong>Celular:</strong> {getComplaintByID?.customer.phoneNumber2}</li>
                </ul>
              </div>
              <div className="claim__data__client item-2">
                <h6 className='color-primary'><strong>Datos del reclamo:</strong></h6>
                <ul className='list-style-none ps-0 mb-0'>
                  <li><strong>Estado:</strong> {getComplaintByID?.status}</li>
                  <li><strong>Fecha de registro:</strong> {getComplaintByID?.createAt}</li>
                  <li><strong>Tipo de reclamo:</strong> {getComplaintByID?.typeComplaint}</li>
                  <li><strong>Observación:</strong> {getComplaintByID?.observations}</li>
                  <li><strong>Respuesta:</strong> {getComplaintByID?.response}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminClaimId