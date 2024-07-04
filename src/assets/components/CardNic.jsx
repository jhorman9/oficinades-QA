import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/CardNic.css';

const CardNic = ({ closedSvg, info, moneySvg, handleNicDelete }) => {

    const navigate = useNavigate();

    const goToId = (info) => {
        localStorage.setItem('nicCode', info.nicCode);
        navigate(`/panel/${info.contractId}/home`);
    }

  return (
    <Card className='card__nic' style={info.status == 'Pending' ? { filter: 'opacity(0.6)' } : { filter: 'opacity(1)' }}>
        <div className='card-header choose__btn__closed__header'>
            <p className='mb-0'>{info.status === 'Pending' ? 'Pendiente' : ''}</p>
            <img className='cursor-pointer' src={closedSvg} alt="botón para cerrar" onClick={()=> handleNicDelete(info.nicCode)}/>
        </div>
        <div className='card-body' onClick={() => info.status == 'Approval' ? goToId(info) : null}>
            <div className="choose__group">
                <div className='bg__money'>
                    {<img src={moneySvg} alt="" />}
                </div>
                <h4 className='mb-0'>NIC: {info.nicCode}</h4>
            </div> 
            <div className="text__group">
                <p className='mb-0 text__principal'>Mes corriente:</p>
                <p className='mb-0 fw-bold'>{info.currentBalance}</p>
            </div>
            <div className="text__group">
                <p className='mb-0 text__principal'>Total: </p>
                <p className='mb-0 fw-bold'>{info.totalBalance}</p>
            </div>
        </div>
    </Card>
  )
}

export default CardNic;