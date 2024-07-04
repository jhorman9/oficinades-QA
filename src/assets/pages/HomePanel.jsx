import React, { Children, useEffect, useState } from 'react';
import '../styles/HomePanel.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useNic from '../../hook/useNic';
import SVGFaucet from '../images/icons/SVGFaucet';
import SVGBash from '../images/icons/SVGBash';
import SVGClaim from '../images/icons/SVGClaim';
import SVGBill from '../images/icons/SVGBill';
import SVGDebFree from '../images/icons/SVGDebFree';
import DangerIMG from '../images/danger.png';
import PNGdrop from '../images/icono-gota.png';

const HomePanel = () => {

  const { getAllNICById, nicById, getBalance, balance } = useNic();
  const { isRefresh, setIsRefresh } = useState(false);

  const { id } = useParams();
  const name = localStorage.getItem('name');
  const nic = localStorage.getItem('nicCode');
  const navigate = useNavigate();

  useEffect(() => {
      getAllNICById(id, setIsRefresh);
  }, [id, isRefresh, nic]);
  
  useEffect(() => {
      getBalance(nic);
  }, [nicById, id, nic]);

  return (
    <section className='home__panel container section'>
      <div className="home__panel__container">
        <div className="home__panel__header pb-3">
          <div className="home__panel__header__info">
            <h3 className='mb-0'>Hola,</h3>
            <h2 className='home__panel__header__title fs-4 mb-1'>SR(A). {name}</h2>
            <p className='mb-0'>NIC: {nicById.contractDetailComercial?.nicCode}</p>
          </div>
          <div className="home__panel__header__info right">
            <p className='mb-0'>Dirección: {nicById.contractDetailComercial?.address}</p>
            <p className='mb-0'>Referencia: {nicById.contractDetailComercial?.reference}</p>
          </div>
        </div>
        <div className="separate"></div>
        <p className='color-primary text-center'>Le mostramos a continuación un resumen de su estado actual</p>
        {balance?.total > 0 || balance?.totalSanitation > 0 ? (<div className="home__text__danger mb-3"><p className=' mb-0 d-flex align-items-center justify-content-center text-center gap-2'> <img src={DangerIMG} alt="" /> Su cuenta con el NIC: {nicById.contractDetailComercial?.nicCode} tiene deuda pendiente con IDAAN</p></div>): ''}
        <div className="home__info__card pb-3">
          <div className='home__card__water position-relative'>
            <div className='card-body'>
              <div className="card__bottom">
                <h3 className='mb-0 fw-bold'>B./{Number.isInteger(Number(balance?.total)) ? `${Number(balance?.total)}.00` : balance?.total}</h3>
                <p className='mb-0'>Deuda IDAAN hasta la fecha</p>
                <div className='card__bottom-2'>
                  <div className='card__btn-action'>
                    <button className="btn btn-terciaire" onClick={()=> navigate(`/panel/${id}/pay`)}>Pagar deuda agua</button>
                    <SVGFaucet color='#fff'/>
                  </div>
                  <div className='home__card__pay-process bg-2'>
                    <p className='mb-0'>Pago por aplicar</p>
                    <span className='fs-5'>B/{Number.isInteger(Number(balance?.tempPaymentIdaan)) ? `${Number(balance?.tempPaymentIdaan)}.00` : balance?.tempPaymentIdaan}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className='home__card__drop'>
              <img src={PNGdrop} alt="" />
            </div> */}
          </div>
          <div className='home__card__water cleanliness position-relative'>
            <div className='card-body'>
              <div className="card__bottom">
                <h3 className='mb-0 fw-bold'>B./{Number.isInteger(Number(balance?.totalSanitation)) ? `${Number(balance?.totalSanitation)}.00` : balance?.totalSanitation}</h3>
                <p className='mb-0'>Deuda ASEO hasta la fecha</p>
                <div className='card__bottom-2'>
                  <div className='card__btn-action'>
                    <button className="btn btn-secondary" onClick={()=> navigate(`/panel/${id}/pay`)}>Pagar deuda aseo</button>
                    <SVGBash color='#fff'/>
                  </div>
                  <div className='home__card__pay-process'>
                    <p className='mb-0'>Pago por aplicar</p>
                    <span className='fs-5'>B/{Number.isInteger(Number(balance.tempPaymentAseo)) ? `${Number(balance.tempPaymentAseo)}.00` : balance.tempPaymentAseo}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className='home__card__drop'>
              <img src={PNGdrop} alt="" />
            </div> */}
          </div>
        </div>
        <div className="home__info__due mb-3">
          <div className="home__info__due__info">
            <div className="home__info__due__group mb-2">
              <p className='color-primary fw-bold mb-0'>Última facturación:</p>
              <p className='mb-0'>{balance?.lastInvoice}</p>
            </div>
            <div className="home__info__due__group">
              <p className='color-primary fw-bold mb-0'>Fecha de vencimiento:</p>
              <p className='mb-0'>{balance?.invoiceDueDate}</p>
            </div>
          </div>
          <div className="home__info__note">
            <p className='color-primary mb-0'><span className='fw-bold'>Nota:</span> La información de los saldos está actualizada hasta: {balance?.updated}. Una vez pasada su fecha de vencimiento su factura acumulará recargos por morosidad.</p>
          </div>
        </div>
        <div className="home__panel__claim__pay">
          <Link className="home__claim__content" to={`/panel/${id}/claim`}>
            <div className="home__claim__toggle">
              <div className="home__claim__icon">
                <SVGClaim Wid='35' Hei='35' Stroke='var(--secondary)' />
              </div>
              <div className="home__claim__info">
                <h5 className='color-primary fw-bold'>¿Necesitas hacer un reclamo?</h5>
              </div>
            </div>
            <div className="home__pay__toggle">
              <button className="btn btn-terciaire">Hacer reclamo</button>
            </div>
          </Link>
          <Link className="home__pay__content" to={`/panel/${id}/pay-history`}>
            <div className="home__claim__toggle">
              <div className="home__claim__icon">
                <SVGBill Wid='35' Hei='35'/>
              </div>
              <div className="home__claim__info">
                <h5 className='color-primary fw-bold'>Revise su historial de pago</h5>
              </div>
            </div>
            <div className="home__pay__toggle">
              <button className="btn btn-secondary color-primary">Historial de pago</button>
            </div>
          </Link>
          <Link className="home__debt-free" to={`/panel/${id}/debt-free`}>
            <div className="home__debt__content">
              <div className="home__debt__icon">
                <SVGDebFree Wid='35' Hei='35' Stroke={'var(--secondary)'}/>
              </div>
              <div className="home__debt__text">
                <h5 className='fw-bold color-primary'>Obtenga su paz y salvo</h5>
              </div>
              <div className="home__debt__toggle">
                <button className="btn btn-secondary">Paz y salvo</button>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HomePanel;