import React from 'react';
import { Card } from 'react-bootstrap';

const CardHome = ({ svg, data, datas,name }) => {

  return (
    <Card className='card__nic'>
        <div className='card-body' >
            <div className="choose__group">
                <div className='bg__money'>
                    {svg}
                </div>
                <h4 className='mb-0'>{name}</h4>
            </div> 
            <div className="text__group">
                <p className='mb-0 text__principal'>{!data ? 'Mes corriente' : 'Fecha' }:</p>
                <p className='mb-0 fw-bold'>{datas}</p>
            </div>
            <div className="text__group">
                <p className='mb-0 text__principal'>{!data ? 'Total' : 'Fecha de vencimiento' }:</p>
                <p className='mb-0 fw-bold'></p>
            </div>
        </div>
    </Card>
  )
}

export default CardHome;