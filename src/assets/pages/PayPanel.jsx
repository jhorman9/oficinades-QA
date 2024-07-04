import React, { useEffect, useLayoutEffect, useState } from 'react';
import '../styles/PayPanel.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { Controller, useForm } from 'react-hook-form';
import { Modal } from 'react-bootstrap';
import PNGDanger from '../images/danger (1).png';
import useWindowDimensions from '../../hook/useWindowDimension';
import useNic from '../../hook/useNic';
import usePayment from '../../hook/usePayment';
import Swal from 'sweetalert2';
import MethodPay from '../components/MethodPay';

const PayPanel = () => {

  const [isInfo, setIsInfo] = useState(false);
  const [valueWater, setValueWater] = useState();
  const [valueSanitation, setValueSanitation] = useState();
  const [dataCreatePay, setDataCreatePay] = useState({});
  const [isBooleanButton, setIsBooleanButton] = useState(false);
  const [cardID, setCardID] = useState(null);
  const [cardSelected, setCardSelected] = useState({});
  const { control, setValue, register, handleSubmit, reset, formState: {errors} } = useForm();
  const { width } = useWindowDimensions();
  const { getAllNICById, nicById, balance, getBalance } = useNic();
  const { createPayment, paymentCode, GetCardMasked, getCard, GetCardToken, getCardToken }  = usePayment();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const nic = localStorage.getItem('nicCode');
  const name = localStorage.getItem('name');
  const { id } = useParams();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClose2 = () => {
    window.location.reload();
    setShow2(false)
  };
  const handleShow2 = () => {setShow2(true)};
  const navigate = useNavigate();

  function onChange(value) {
    if(value){
      setIsInfo(true);
    }else{
        setIsInfo(false);
    }
  }

  useEffect(() => {
    getAllNICById(id);
    getBalance(nic);
  },[]);

  useEffect(() => {
    GetCardMasked();
  },[nicById]);

  useEffect(() => {
    GetCardToken();
  },[]);

  const userAgent = window.navigator.userAgent;

  const submit = (data) => {
    data.nicCode = nicById.contractDetailSistem?.nicCode;
    data.userAgent = userAgent;

    if(data.total == undefined){
      (!isNaN(valueWater) ? data.total = Number(valueWater).toFixed(2) : data.total = 0.00)
    }
    if(data.totalSanitation == undefined){
      (!isNaN(valueSanitation) ? data.totalSanitation = Number(valueSanitation).toFixed(2) : data.totalSanitation = 0.00)
    }
    
    const sum = ((!isNaN(data.total) ? Number(data.total) : 0) + (!isNaN(data.totalSanitation) ? Number(data.totalSanitation) : 0)).toFixed(2);
    
    data.totalAmount = sum;
    
    data.paymentsDetailServices = [];

    if(Number(data.totalSanitation) > 0){
      data.paymentsDetailServices.push({ServiceId: 2, ServiceAmount: Number(data.totalSanitation).toFixed(2)})
    }

    if(data.total > 0){
      data.paymentsDetailServices.push({ServiceId: 1, ServiceAmount: Number(data.total).toFixed(2)})
    }

    data.paymentsDetailServices?.filter((value) => parseFloat(value.ServiceAmount) > 0);

    if(data.total > 0 || data.totalSanitation > 0) {
      if(isInfo){
        handleShow();        
       }else{
         Swal.fire({
           icon: 'error',
           title: 'Oops...',
           text: 'Falta completar el reCAPTCHA',
           confirmButtonColor: 'var(--primary)',
         });
       }
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Seleccionar el monto a pagar',
        text: 'Si su monto total es posterior a 0 el sistema no le permitirá realizar su pago',
        confirmButtonColor: 'var(--primary)',
      });
    }

    // if(data.total < balance.total && data.totalSanitation > 0){
    //   handleClose();
    //   return Swal.fire({
    //     icon: 'error',
    //     title: 'Error en selección de pago',
    //     text: 'Le recordamos que, para efectuar el pago del servicio de aseo, es necesario saldar cualquier deuda pendiente con el servicio de agua.',
    //   });
    // }
    
    delete data.isRead;
    data.clientToken = getCardToken;
    setDataCreatePay(data);
  };

  const createPay = () => {
    setIsBooleanButton(true);
    delete createPay.total;
    delete createPay.totalSanitation;
    createPayment(dataCreatePay, setIsBooleanButton, reset, setValueSanitation, setValueWater, handleClose, navigate, id);
  }

  useEffect(() => {
    const cardFiltered = getCard.find(card => card.cardId == cardID);
    setCardSelected(cardFiltered);
  },[cardID, getCard, cardSelected, valueSanitation, valueWater]);

  return (
    <>
    <section className='pay__panel container'>
      <div className="pay__panel__container">
        <h5 className='pay__panel__title mb-3 title__panel'>PAGO EN LINEA - NIC {nicById.contractDetailSistem?.nicCode}</h5>
        <form className="pay__panel__content" onSubmit={handleSubmit(submit)}>
          <div className="pay__panel__inputs__container">
            <div className="pay__panel__input">
              <div className='pay__panel__input__not__group'>
                <label htmlFor="">Nombre del cliente</label>
                <input className='pay__panel__item__input' id='name-client' value={name} disabled type='text' placeholder='Nombre cliente' title={name}/>
              </div>
              <div className='pay__panel__input__not__group'>
                <label htmlFor="" className='d-block'>Dirección</label>
                <input className='pay__panel__item__input w-100' value={nicById.contractDetailSistem?.address} disabled title={nicById.contractDetailSistem?.address} />
              </div>
              <div className='pay__panel__input__not__group'>
                <label htmlFor="">NIC</label>
                <input className='pay__panel__item__input' value={nicById.contractDetailSistem?.nicCode} disabled type='text' title={nicById.contractDetailSistem?.nicCode}/>
              </div>
              <div className='pay__panel__input__content'>
                <div className='pay__panel__input__not__group w-100'>
                  <label htmlFor="">Código de finca</label>
                  <input className='pay__panel__item__input' value={nicById.contractDetailSistem?.fincaCode} disabled type='text' title={nicById.contractDetailSistem?.fincaCode} />
                </div>
                <div className='pay__panel__input__not__group w-100'>
                  <label htmlFor="">Código de ruta</label>
                  <input className='pay__panel__item__input' value={nicById.contractDetailSistem?.pathCode} disabled type='text' title={nicById.contractDetailSistem?.pathCode} />
                </div>
              </div>
              <div className='mb-3 text-for-add-card'>
                <p className='mb-2 color-primary fw-bold' style={{fontSize: '14px'}}>Estimado Cliente, antes de proceder con su transacción, recuerde agregar una tarjeta válida.</p>
                <div className='d-flex justify-content-end'>
                  <button type='button' className='btn btn-primary' onClick={()=> handleShow2()}>Agregar tarjeta</button>
                </div>
              </div>
            <div className='pay__panel__input__content'>
              <div className='pay__panel__input__group w-100'>
                  <div className="label__between">
                    <label htmlFor="">Agua</label>
                    <strong>Total: B/{balance?.total}</strong>
                  </div>
                  <div className="position-relative">
                    <Controller
                      name="total"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            {...field}
                            className="pay__panel__item__input w-100"
                            autoComplete="off"
                            type="text"
                            placeholder="00.00"
                            value={valueWater}
                            onChange={(e)=> setValueWater(e.target.value)}
                          />
                          <small className='text-form' style={{ color: 'red' }}>{errors.total?.message}</small>
                          <div className="position-absolute" onClick={() => setValueWater(Number(balance?.total))}>
                            <small>Pagar total</small>
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className='pay__panel__input__group w-100'>
                  <div className="label__between">
                    <label htmlFor="">Aseo</label>
                    <strong>Total: B/{balance?.totalSanitation}</strong>
                  </div>
                  <div className="position-relative">
                    <Controller
                      name="totalSanitation"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            {...field}
                            className="pay__panel__item__input w-100"
                            autoComplete="off"
                            value={valueSanitation}
                            type="text"
                            placeholder="00.00"
                            onChange={(e) => setValueSanitation(e.target.value)}
                          />
                          <small className='text-form' style={{ color: 'red' }}>{errors.totalSanitation?.message}</small>
                          <div className="position-absolute" onClick={() => setValueSanitation(Number(balance?.totalSanitation))}>
                            <small>Pagar total</small>
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className='pay__panel__input__content'>
                <div className='pay__panel__item__input mb-2 w-100'>
                  <select className='w-100' style={{padding: '0 12px'}} {...register('cardOptionId', {
                    validate:(value) =>{
                      if(value == 0){
                        return 'Este campo es requerido';
                      }
                    }
                  })}
                  onChange={(e) => {setCardID(e.target.value)}}
                  >
                    <option value={0}>Seleccionar tarjeta</option>
                    {
                      getCard?.map(card => (
                        card.cardStatus == 'Active' ?
                        <option value={card.cardId} key={card.cardId}>{card.cardNumber}</option>
                        :
                        null
                      ))
                    }
                  </select>
                  <small className='text-form' style={{color: 'red'}}>{errors.cardOptionId?.message}</small>
                </div>
                <div className='pay__panel__item__input mb-2'>
                  <input {...register('CodeCvv', {
                    required: {
                      value: true,
                      message: 'Campo requerido',
                    },
                    minLength:{
                      value: 3,
                      message: 'La tarjeta lleva 3 numeraciones'
                    }
                  })} 
                  type="password" placeholder='CVC' className='w-100' maxLength={3}/>
                    <small className='text-form' style={{color: 'red'}}>{errors.CodeCvv?.message}</small>
                </div>
              </div>
            </div>
          </div>

          <div className="pay__panel__info">
            <h5 className='pay__panel__title mb-3 fw-bold'>Resumen de pago</h5>
            <div className="pay__panel__info__content">
              <ul className='list-unstyled'>
                <li>
                  <span>Agua</span>
                  <span>B/{(!isNaN(valueWater) ? Number(valueWater) : 0).toFixed(2)}</span>
                </li>
                <li>
                  <span>Aseo</span>
                  <span>B/{(!isNaN(valueSanitation) ? Number(valueSanitation) : 0).toFixed(2)}</span>
                </li>
                <li>
                  <span>Subtotal</span>
                  <span>B/{((!isNaN(valueWater) ? Number(valueWater) : 0) + (!isNaN(valueSanitation) ? Number(valueSanitation) : 0)).toFixed(2)}</span>
                </li>
                <li>
                  <strong>TOTAL</strong>
                  <strong>B/{((!isNaN(valueWater) ? Number(valueWater) : 0) + (!isNaN(valueSanitation) ? Number(valueSanitation) : 0)).toFixed(2)}</strong>
                </li>
              </ul>
              <div className="pay__panel__info__checklist">
                <div className="pay__info__terms mb-2">
                  <div className="pay__info__terms__content">
                    <input {...register('isRead', {
                      validate: (value) => {
                        if(value == false){
                          return 'Debe aceptar los terminos y condiciones';
                        }
                      }
                    })} type="checkbox" className='cursor-pointer'/>
                    <p className='mb-0'>He leido y acepto los <Link to='https://www.idaan.gob.pa/appcliente/t%C3%A9rminos-de-aceptaci%C3%B3n' target='_blank'>Términos y condiciones</Link> de este servicio</p>
                  </div>
                  <small className='text-form' style={{color: 'red'}}>{errors.isRead?.message}</small>
                </div>
                <div className="pay__info__captcha">
                <div>
                    <ReCAPTCHA
                    sitekey={import.meta.env.VITE_APP_GOOGLE_KEY}
                    onChange={onChange}
                    hl="es"
                    size={width <= 390 ? 'compact': 'normal'}
                    />
                </div>
                  <button type='submit' className="btn-primary btn__pay">Pagar</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
    <Modal className='modal__Add-ChooseNic' show={show} onHide={handleClose} id='modal-pay-customer'>
      <Modal.Header closeButton>
          <Modal.Title>Confirmación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul className='p-2 list-unstyled'>
          <li><span>Nombre del cliente:</span><span>{name}</span></li>
          <li><span>Dirección:</span><span><strong className='fw-bold'>{nicById.contractDetailSistem?.address}</strong></span></li>
          <li><span>Nombre de tarjetahabiente:</span><span className='fw-bold'>{cardSelected?.cardName}</span></li>
          <li><span>Número de tarjeta:</span><span className='fw-bold'>{cardSelected?.cardNumber}</span></li>
          <li><span>Número de cliente (NIC):</span><span><strong className="fw-bold">{dataCreatePay?.nicCode}</strong></span></li>
          <li><span>Codigo de finca:</span><span><strong className='fw-bold'>{nicById.contractDetailSistem?.fincaCode}</strong></span></li>
          <li><span>Codigo de ruta:</span><span><strong className='fw-bold'>{nicById.contractDetailSistem?.pathCode}</strong></span></li>
          <li><span>Saldo de agua:</span><span><strong className='fw-bold'>B/{dataCreatePay?.total}</strong></span></li>
          <li><span>Saldo de aseo:</span><span><strong className='fw-bold'>B/{dataCreatePay?.totalSanitation}</strong></span></li>
          <li><span>Subtotal:</span><span><strong className='fw-bold'>B/{dataCreatePay?.totalAmount}</strong></span></li>
          <li><span>Total:</span><span><strong className='fw-bold'>B/{dataCreatePay?.totalAmount}</strong></span></li>
        </ul>
        <div className="debt__text__yellow text__yellow">
          <img src={PNGDanger} style={{mixBlendMode: 'multiply'}}/>
          <p className='mx-auto mb-0'> Una copia del recibo de esta transacción será enviada al correo electrónico proporcionado</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary m-0" onClick={createPay} disabled={isBooleanButton}>{isBooleanButton == true ? 'Cargando...' : 'Confirmar'}</button>
      </Modal.Footer>
    </Modal>

    <Modal className='modal__Add-ChooseNic' show={show2} onHide={handleClose2} id='modal-card-customer'>
      <Modal.Header closeButton>
          <Modal.Title>Agregar tarjeta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MethodPay />
      </Modal.Body>
    </Modal>
            
  </>
  )
}

export default PayPanel