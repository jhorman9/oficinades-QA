import React, { useEffect, useRef } from 'react';
import '../styles/payCompleted.css';
import SVGDownload from '../images/icons/SVGDownload';
import SVGDone from '../images/icons/SVGDone';
import PayIcon from '../images/payIcon.png';
import usePayment from '../../hook/usePayment';
import { useNavigate, useParams } from 'react-router-dom';
import SVGDenied from '../images/icons/SVGDenied';
import SVGPending from '../images/icons/SVGPending';
import { useReactToPrint } from 'react-to-print';
import LOGOIDAAN from '../images/bg-idaan-bill-2.png';

const PayCompletedPanel = () => {

    const { payID } = useParams();
    const { GetPaymentStatus, dataPayment } = usePayment();
    const navigate = useNavigate();
    const safeDate = false;
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Recibo de pago',
        pageStyle: `
        @page {
            size: A4;
            padding-top: 5mm;
            padding-left: 5mm;
            padding-right: 5mm;
            padding-bottom: 5mm;
        }
        `,
    });

   useEffect(() => {
    GetPaymentStatus(payID, navigate, safeDate);
   },[safeDate, payID]);

    const statusPays = {
        'REJECTED': '#cd0f24',
        'APPROVED': '#65E362',
        'PENDING': '#ff8212'
    }

    const statusImage = {
        'REJECTED': <SVGDenied />,
        'APPROVED': <SVGDone />,
        'PENDING': <SVGPending />
    }

    const estiloDiv = {
        display: 'flex',
        width: '100%',
        height: 'fit-content',
        gap: '14px',
        alignItems: 'center',
        boxShadow: '0 0 7px #00000030',
        padding: '28px',
        borderRadius: '14px',
        backgroundColor: 'var(--secondaryS)',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `10px solid ${statusPays[dataPayment?.status]}`
    };

    const styleImage = {
        position: 'absolute',
        top: '0',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1'
    }

    const textToTranslate = {
        'Approved': 'Su pago fue aprobado exitosamente',
        'Decline - Contact your Bank':'Declinado, contacte a su banco',
        'Insufficient funds': 'Fondo insuficiente',
        'Card blocked  or cancelled by your Bank': 'Tarjeta bloqueada o cancelado por su banco',
        'Declined, previous lost/stolen': 'Rechazada, tarjeta perdida/robada'
    }

  return (
    <section className='pay__completed container'>
        <div className="pay__completed__content">
            <h5 className='pay__completed__title mb-3 title__panel'>RECIBO DE PAGO</h5>
            <div className="pay__completed__body">
                <div className="pay__completed__left" ref={componentRef}>
                    <div className="pay__completed__top__content mb-3" style={estiloDiv}>
                        <div className="pay__completed__top__img">
                            {statusImage[dataPayment && dataPayment.status]}
                        </div>
                        <div className="pay__completed__text">
                            <h6 className='mb-0'>{dataPayment && dataPayment.status == 'REJECTED' ? 'Pago rechazado' : dataPayment && dataPayment.status == 'APPROVED' ? 'Gracias por su pago' : null}</h6>
                            <p className='mb-0'>{dataPayment && textToTranslate[dataPayment.message]}</p>
                        </div>
                    </div>
                    <div className="pay__completed__list position-relative" style={{width:'100%'}}>
                        <ul className='list-unstyled' style={{zIndex: '2', position: 'relative'}}>
                            <li>
                                <span>Número de autorización:</span>
                                <span>{dataPayment && dataPayment.autorizathion}</span>
                            </li>
                            <li>
                                <span>Número de transacción:</span>
                                <span>{dataPayment && dataPayment.transactionId}</span>
                            </li>
                            <li>
                                <span>Nombre del cliente:</span>
                                <span>{dataPayment && localStorage.getItem('name')}</span>
                            </li>
                            <li>
                                <span>Número de cliente (NIC):</span>
                                <span>{dataPayment && dataPayment.nicCode}</span>
                            </li>
                            <li>
                                <span>Fecha de la transacción:</span>
                                <span>{dataPayment && dataPayment.dateOfPayment}</span>
                            </li>
                            <li>
                                <span>Número de tarjeta:</span>
                                <span>{dataPayment && dataPayment.cardNumber}</span>
                            </li>
                            <li>
                                <strong>Monto pagado:</strong>
                                <strong>${dataPayment && dataPayment.status == 'REJECTED' ? 0 : dataPayment?.amount}</strong>
                            </li>
                        </ul>
                        <div className='pay__completed__logo' style={styleImage}>
                            <img src={LOGOIDAAN} alt="" style={{mixBlendMode: 'darken'}}/>
                        </div>
                    </div>
                </div>
                <div className="pay__completed__right">
                    <div className="pay__completed__right__content">
                        <img src={PayIcon} alt="" />
                        { 
                        dataPayment && dataPayment.status == 'APPROVED' || dataPayment && dataPayment.status == 'PENDING'? 
                        <button className="btn btn-primary" onClick={handlePrint}><SVGDownload />Descargar recibo</button>                            
                        : 
                        null
                        }
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default PayCompletedPanel;