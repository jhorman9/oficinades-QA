import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import useCertificate from '../../hook/useCertificate';
import SVGArrowRight from '../images/icons/SVGArrowRight';
import '../styles/certificate-verification.css';
import SVGWarning2 from '../images/icons/SVGWarning2';
import water from '../images/gota-agua.jpg';

const CertificateVerification = () => {

   const {tokenId} = useParams();
   const { GetValidateCertificate, responseCertificate } = useCertificate();

   useEffect(() => {
    GetValidateCertificate(tokenId)
   },[])

   const statusName = {
    'Pending': 'EN ESPERA DE EMISIÓN',
    'Enabled': 'PAZ Y SALVO EMITIDO',
    'Disabled': 'Restricción (Inactivo / Sin Suministro)',
    'Expired': 'PAZ Y SALVO EXPIRADO',
    'Valid': 'Valido'
  };

  return (
    <section className='certificate__verification container'>
      <div className="certificate__verification__content">
        <h6 className='back mb-3 color-primary fw-bold cursor-pointer'><Link to={'/'} target='_blank'><SVGArrowRight />Ir a inicio</Link></h6>
        <div className="certificate__verification__top mb-3">
          <img src={water} alt="icono de agua" />
          <strong className='color-primary fw-bold'>STATUS: {statusName[responseCertificate?.status]}</strong>
        </div>
        <div className="certificate__verification__body">
          <ul className='list-unstyled w-100 mb-0'>
            <div className='list-item'>
              <li className='color-primary'>
                <strong>Dirección:</strong><br />
                {responseCertificate?.address}
              </li>
              <li className='color-primary'>
                <strong>Provincia:</strong><br />
                {responseCertificate?.province}
              </li>
            </div>
            <div className='list-item'>
              <li className='color-primary'>
                <strong>Nombre de la factura:</strong><br />
                {responseCertificate?.name}
              </li>
              <li className='color-primary'>
                <strong>Número de NIC:</strong><br />
                {responseCertificate?.nicCode}
              </li>
            </div>
            <div className='list-item'>
              <li className='color-primary'>
                <strong>Número de folio:</strong><br />
                {responseCertificate?.folioCode}
              </li>
              <li className='color-primary'>
                <strong>Número de tomo:</strong><br />
                {responseCertificate?.tomoCode}
              </li>
            </div>
            <div className='list-item'>
              <li className='color-primary'>
                <strong>Número de dispositivo:</strong><br />
                {responseCertificate?.deviceNumber}
              </li>
              <li className='color-primary'>
                <strong>Número de finca:</strong><br />
                {responseCertificate?.fincaCode}
              </li>
            </div>
            <div className='list-item'>
              <li className='color-primary'>
                <strong>Tipo de documento:</strong><br />
                {responseCertificate?.documentType}
              </li>
              <li className='color-primary'>
                <strong>Número de documento:</strong><br />
                {responseCertificate?.documentNumber}
              </li>
            </div>
            <div className='list-item'>
              <li className='color-primary'>
                <strong>Fecha de emisión:</strong><br />
                {responseCertificate?.emiterDate}
              </li>
              <li className='color-primary'>
                <strong>Fecha de vencimiento:</strong><br />
                {responseCertificate?.dueDate}
              </li>
            </div>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default CertificateVerification;