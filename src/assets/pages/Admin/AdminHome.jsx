import React, { useEffect, useState } from 'react'
import userRegisterPNG from '../../images/dashboard/Dashboard de pagos iconos-03.png';
import paymentReceivedPNG from '../../images/dashboard/Dashboard de pagos iconos-04.png';
import debtfreePNG from '../../images/dashboard/Dashboard de pagos iconos-07.png';
import customerPNG from '../../images/dashboard/Dashboard de pagos iconos-08.png';
import claimReceivedPNG from '../../images/dashboard/Dashboard de pagos iconos-09.png';
import nicPNG from '../../images/dashboard/Dashboard de pagos iconos-10.png';
import useDashboard from '../../../hook/useDashboard';
import { useForm } from 'react-hook-form';
import '../../styles/Admin/dashboard.css';

const AdminHome = () => {

  const {register, handleSubmit, reset, formState: { errors }, setValue} = useForm();
  const { GetAllDataDashboard, allDashboard } = useDashboard();
  const [ data, setData] = useState();
  const [statusSee, setStatusSee] = useState(0);

  const today = new Date();

  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate();

  const date = {
    start: `${year}-${month}-${day}`,
    end: `${year}-${month}-${day}`,
  }

  useEffect(() => {
    GetAllDataDashboard(data ? data : date, statusSee);
  },[statusSee, data]);

  const filterData = (data) => {
    setStatusSee(1);
    setData(data);
  };

  return (
    <section className='admin__home container'>
      <div className='d-lg-flex d-md-flx d-block mx-3' style={statusSee == 0 ? {justifyContent: 'end'} : {justifyContent: 'space-between'}}>
        {
          statusSee == 1 ? (
            <button className='btn btn-primary mb-2' onClick={() => {setStatusSee(0); setValue('start', ''); setValue('end', '');}}>Reiniciar</button>            
          ) : (
            null
          )
          }
        <form onSubmit={handleSubmit(filterData)} className='mb-2 d-flex flex-column flex-md-row flex-lg-row align-items-lg-center align-items-md-center align-items-start justify-content-end'>
          <div className='d-flex gap-2 flex-column flex-md-row flex-lg-row'>
            <input type="date" {...register('start')}/>
            <input type="date" {...register('end')}/>
          </div>
          <button className='ms-lg-2 ms-md-2 ms-0 btn btn-secondary mt-lg-0 mt-md-0 mt-2'>Filtrar</button>
        </form>
      </div>
      <div className='admin__home__container'>
        {/* <div className='daily__payments card item2 card'>
          <p className='top mb-0 text-center'>Pagos diarios</p>
          <div className='daily__payments__body p-2'>
          <img className='w-100' src={paymentDailyPNG} alt="" />
          <di className='text-center'>
          <span className='value__text'>1000</span>
          </di>
          </div>
        </div> */}
        {/* <div className='payments__received item3 card'>
          <p className='top mb-0 text-center'>Pagos recibidos</p>
          <div className='payments__received__body'>
            <img className='w-100' src={paymentReceivedPNG} alt="" />
            <div className='text-center'>
            <span className='value__text'>1000</span>
            </div>
          </div>
          </div>
          <div className='last__payments item4 card'>
          <p className='top mb-0 text-center'>Ultimos pagos</p>
          <div className='last__payments__body'>
          <img className='w-100' src={lastpaymentsPNG} alt="" />
          <div className='text-center'>
          <span className='value__text'>1000</span>
          </div>
          </div>
        </div> */}
        <div className='claims__received item5 card'>
          <p className='top mb-0 text-center'>Reclamos recibidos</p>
          <div className='claims__received__body p-2'>
            <div className='text-center'>
              <span className='title__text'>Total</span> <br />
              <span className='value__text'>{allDashboard && ( allDashboard.reduce((sum, dashboard) => sum + dashboard.complaintsQuantity, 0))}</span>
            </div>
            <img className='w-100' src={claimReceivedPNG} alt="" />
          </div>
        </div>
        <div className='certificated item6 card'>
          <p className='top mb-0 text-center'>Pagos</p>
          <div className='certificated__body p-2'>
            <img className='w-100' src={paymentReceivedPNG} alt="" />
            <div className='text-center'>
              <span className='title__text'>Cantidad</span> <br />
              <span className='value__text'>
                {allDashboard && ( allDashboard.reduce((sum, dashboard) => sum + dashboard.quantityPaymentOnline, 0))}
              </span>
            </div>
            <div className='text-center'>
              <span className='title__text'>Monto</span> <br />
              <span className='value__text'>
                B/{allDashboard && (allDashboard.reduce((sum, dashboard) => sum + dashboard.amountPaymentOnline, 0).toFixed(2))}
              </span>
            </div>
          </div>
        </div>
        <div className='customers item7 card'>
          <p className='top mb-0 text-center'>Clientes</p>
          <div className='customers__body p-2'>
            <img className='w-100' src={customerPNG} alt="" />
            <div className='text-center'>
              <span className='title__text'>Total</span> <br />
              <span className='value__text'>{allDashboard && ( allDashboard.reduce((sum, dashboard) => sum + dashboard.customersQuantity, 0))}</span>
            </div>
          </div>
        </div>
        <div className='users__registers item1 card'>
          <p className='mb-0 top text-center'>Usuarios</p>
          <div className=''>
            <div className='p-2 user__content__body'>
            <img className='w-100' src={userRegisterPNG} alt="" />
              <div className='text-center'>
                <span className='title__text'>Total</span> <br />
                <span className='value__text'>{(allDashboard.reduce((sum, dashboard) => sum + dashboard.usersDisabled, 0) + allDashboard.reduce((sum, dashboard) => sum + dashboard.usersActive, 0))}</span>
              </div>
              <div className='text-center'>
                <span className='title__text'>Activos</span><br />
                <span className='value__text'>{allDashboard && ( allDashboard.reduce((sum, dashboard) => sum + dashboard.usersActive, 0))}</span>
              </div>
              <div className='text-center'>
                <span className='title__text'>Inactivos</span><br />
                <span className='value__text'>{allDashboard && ( allDashboard.reduce((sum, dashboard) => sum + dashboard.usersDisabled, 0))}</span>
              </div>
            </div>
          </div>
        </div>
        <div className='debt__free item8 card'>
          <p className='top mb-0 text-center'>Paz y salvo</p>
          <div className='debt__free__body text-center p-2'>
            <div className='debt__free__body2'>
              <div className='w-100'>
                <span className='title__text'>Aprobados</span><br />
                <span className='value__text'>{allDashboard && ( allDashboard.reduce((sum, dashboard) => sum + dashboard.requestsAproved, 0))}</span>
              </div>
              <div className='w-100'>
                <span className='title__text'>Pre-Aprobados</span><br />
                <span className='value__text'>{allDashboard && ( allDashboard.reduce((sum, dashboard) => sum + dashboard.requestsPreAproved, 0))}</span>
              </div>
              <div className='w-100'>
                <span className='title__text'>Pendientes</span><br />
                <span className='value__text'>{allDashboard && ( allDashboard.reduce((sum, dashboard) => sum + dashboard.requestsPending, 0))}</span>
              </div>
              <div className='w-100'>
                <span className='title__text' style={{color: 'red'}}>Rechazados</span><br />
                <span className='value__text' style={{color: 'red'}}>{allDashboard && ( allDashboard.reduce((sum, dashboard) => sum + dashboard.requestsRejected, 0))}</span>
              </div>
            </div>
            <img className='w-100' src={debtfreePNG} alt="" />
          </div>
        </div>
        <div className='nic item9 card'>
          <p className='top mb-0 text-center'>NIC</p>
          <div className='nic__body text-center p-2'>
            <img className='w-100' src={nicPNG} alt="" />
            <div>
              <span className='title__text'>Aprobados</span><br />
              <span className='value__text'>{allDashboard && ( allDashboard.reduce((sum, dashboard) => sum + dashboard.contractsAproved, 0))}</span>
            </div>
            <div>
              <span className='title__text' style={{color: 'red'}}>Rechazados</span><br />
              <span className='value__text' style={{color: 'red'}}>{allDashboard && ( allDashboard.reduce((sum, dashboard) => sum + dashboard.contractsRejected, 0))}</span>
            </div>
            <div>
              <span className='title__text'>Pendiente</span><br />
              <span className='value__text'>{allDashboard && ( allDashboard.reduce((sum, dashboard) => sum + dashboard.contractsPending, 0))}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminHome