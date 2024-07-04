import { format, isValid, parseISO } from 'date-fns';
import React, { useEffect } from 'react'
import useContractAdmin from '../../../hook/useContractAdmin';
import UserDetailModal from './userDetailModal';
import { useState } from 'react';
import closedSvg from '../../images/icons/icon _close circle.svg';
import Swal from 'sweetalert2';

const NicCodesBox = ({ nic, setIsRefresh }) => {

    const { getAllNICById, nicById, DeleteNicByAdmin } = useContractAdmin();
    const [show, setShow] = useState();
    const [getStatus, setGetStatus] = useState('');
    
    const handleClose = () => {
        setShow(false);
    };
        
    const handleShow = (id, status) => {
        getAllNICById(id, setIsRefresh);
        setShow(true);
        setGetStatus(status)
    };

    const status = {
        'Approval': 'Aprobado',
        'Rejected': 'Rechazado',
        'Pending': 'Pendiente'
    }

    const deleteNIC = (nic) => {
        Swal.fire({
          title: "Eliminar NIC",
          html: `<p>Estás eliminando el NIC <span style="color: var(--primary);">${nic}</span>, de forma permanente. <br /> <br /> <span class='fw-bold color-primary'>¿Desea continuar?</span></p>`,
          icon: "question",
          iconColor: 'var(--primary)',
          showCancelButton: true,
          cancelButtonColor: "var(--primary)",
          confirmButtonColor: "#d33",
          confirmButtonText: "Eliminar",
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            DeleteNicByAdmin(nic);   
          }
        });
      }
    
  return (
    <>
    <li className='nic__box cursor-pointer'>
        <div className='d-flex justify-content-between'>
            <div>
                <span>ID: </span>
                <span>{nic.contractId}</span>
            </div>
            <div onClick={(e) => {
                e.preventDefault();
                deleteNIC(nic.nicCode);
            }}
            >
                <img src={closedSvg} alt="Eliminar NIC" />
            </div>
        </div>
        <div onClick={()=>handleShow(nic.contractId, nic.status)}>
            <div>
                <span>NIC: </span>
                <span>{nic.nicCode}</span>
            </div>
            <div>
                <span>REGISTRO: </span>
                <span>{nic.registerDate && isValid(parseISO(nic.registerDate)) ? format(parseISO(nic.registerDate), 'dd/MM/yyyy') : 'Invalid Date'}</span>
            </div>
            <div>
                <span>STATUS: </span>
                <span className='fw-bold'>{status[nic.status]}</span>
            </div>
            <div className='cursor-pointer text-end'>
                <span className='color-primary'>Ver detalle</span>
            </div>
            <div className='d-flex justify-content-between'>
                {/* {
                    nic.status !== 'Pending' && (
                        <div className='d-flex justify-content-end'>
                            <button className='btn btn-danger mt-1' onClick={()=> approvedClient(nic.nicCode)}>Denegar</button>
                        </div>
                    )
                }
                {
                    nic.status !== 'Pending' && (
                        <div className='d-flex justify-content-end'>
                            <button className='btn btn-secondary mt-1' onClick={()=> approvedClient(nic.nicCode)}>Aprobar</button>
                        </div>
                    )
                } */}
            </div>
        </div>
    </li>
    <UserDetailModal nicById={nicById} data={getStatus} handleClose={handleClose} handleShow={handleShow} show={show} setIsRefresh={setIsRefresh} />
    </>
  )
}

export default NicCodesBox;