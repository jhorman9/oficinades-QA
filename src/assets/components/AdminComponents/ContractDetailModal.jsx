import React, { useEffect, useState } from 'react'
import { Form, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import useContractAdmin from '../../../hook/useContractAdmin';
import '../../styles/Admin/AdminUsers.css';
import { format, parseISO } from 'date-fns';


const ContractDetailModal = ({setShow, data, show, handleClose, nicById, setIsRefresh}) => {

    const  {ApprovedContract } = useContractAdmin();
    const [message, setMessage] = useState('');
    const [messageError, setMessageError] = useState('');

    const documentType2 = {
        1: 'CÉDULA',
        2: 'PASAPORTE',
        3: 'RUC',
        4: 'ENTIDAD GUBERNAMETAL'
    };

    useEffect(() => {
        if(message.length >= 4){
            setMessageError('');
        }
    },[messageError, message])

    const approvedClient = (nic) => {
        Swal.fire({
            title: "Aprobar NIC",
            html: `<p>Al aprobar el <span style="color: var(--primary);">NIC: ${nic}</span> autorizas al usuario a realizar las gestiones relacionadas al mismo. <br /> <br /> <span class='fw-bold color-primary'>¿Desea continuar?</span></p>`,
            icon: "question",
            iconColor: 'var(--primary)',
            showCancelButton: true,
            confirmButtonColor: "var(--primary)",
            cancelButtonColor: "#d33",
            confirmButtonText: "Aprobar",
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                const text = 'Approved'
                const client = {
                    nicCode: nic,
                    status: 2,
                }
                ApprovedContract(client, setIsRefresh, text, handleClose);
            }
          });
    };

    const RejectedClient = (nic) => {
        message.length > 3 ? 
        Swal.fire({
            title: "Rechazar NIC",
            html: `<p>Al rechazar el <span style="color: var(--primary);">NIC: ${nic}</span> el usuario no podrá realizar ninguna gestión relacionada al mismo. <br /> <br /> <span class='fw-bold color-primary'>¿Desea continuar?</span></p>`,
            icon: "question",
            iconColor: 'var(--primary)',
            showCancelButton: true,
            confirmButtonColor: "var(--primary)",
            cancelButtonColor: "#d33",
            confirmButtonText: "Rechazar",
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                const text = 'Rejected'
                const client = {
                    nicCode: nic,
                    status: 3,
                    comment: message
                }
                ApprovedContract(client, setIsRefresh, text, handleClose);
            }
          })
          :
          setMessageError('Debes enviar obligatoriamente el motivo de la cancelación');
    };

    handleClose = () =>{
        setShow(false);
        setMessage('');
        setMessageError('');
    }
    
  return (
    <Modal size='lg' centered id='user__detail' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Detalle del NIC</Modal.Title>
        </Modal.Header>
        <Form>
            <Modal.Body>
                <div className='table-responsive'>
                    <table className='w-100'>
                        <thead>
                            <th></th>
                            <th className='text-center'>Base de datos comercial</th>
                            <th className='text-center'>Registro del cliente</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='fw-bold'>NIC</td>
                                <td>{nicById.contractDetailComercial?.nicCode ? nicById.contractDetailComercial?.nicCode: 'NO DEFINIDO'}</td>
                                <td>{nicById.contractDetailSistem?.nicCode ? nicById.contractDetailSistem?.nicCode : 'NO DEFINIDO'}</td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Nombre</td>
                                <td>{nicById.contractDetailComercial?.name ? nicById.contractDetailComercial?.name : 'NO DEFINIDO'}</td>
                                <td>{nicById.contractDetailSistem?.name ? nicById.contractDetailSistem?.name : 'NO DEFINIDO'}</td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Correo</td>
                                <td>{nicById.contractDetailComercial?.email ? nicById.contractDetailComercial?.email : 'NO DEFINIDO'}</td>
                                <td>{nicById.contractDetailSistem?.email ? nicById.contractDetailSistem?.email : 'NO DEFINIDO'}</td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Teléfono</td>
                                <td>{nicById.contractDetailComercial?.phoneNumber1 ? nicById.contractDetailComercial?.phoneNumber1 : 'NO DEFINIDO'}</td>
                                <td>{nicById.contractDetailSistem?.phoneNumber1 ? nicById.contractDetailSistem?.phoneNumber1 : 'NO DEFINIDO'}</td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Dirección</td>
                                <td>{nicById.contractDetailComercial?.address ? nicById.contractDetailComercial?.address : 'NO DEFINIDO'}</td>
                                <td>{nicById.contractDetailSistem?.address ? nicById.contractDetailSistem?.address : 'NO DEFINIDO'}</td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Tipo de documento</td>
                                <td>{nicById.contractDetailComercial?.documentType ? documentType2[nicById.contractDetailComercial?.documentType] : 'NO DEFINIDO'}</td>
                                <td>{nicById.contractDetailSistem?.documentType ? documentType2[nicById.contractDetailSistem?.documentType] : 'NO DEFINIDO'}</td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Número de documento</td>
                                <td>{nicById.contractDetailComercial?.documentNumber ? nicById.contractDetailComercial?.documentNumber : 'NO DEFINIDO'}</td>
                                <td>{nicById.contractDetailSistem?.documentNumber ? nicById.contractDetailSistem?.documentNumber : 'NO DEFINIDO'}</td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Finca</td>
                                <td>{nicById.contractDetailComercial?.fincaCode ? nicById.contractDetailComercial?.fincaCode : 'NO DEFINIDO'}</td>
                                <td>{nicById.contractDetailSistem?.fincaCode ? nicById.contractDetailSistem?.fincaCode : 'NO DEFINIDO'}</td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Folio</td>
                                <td>{nicById.contractDetailComercial?.folioCode ? nicById.contractDetailComercial?.folioCode : 'NO DEFINIDO'}</td>
                                <td>{nicById.contractDetailSistem?.folioCode ? nicById.contractDetailSistem?.folioCode : 'NO DEFINIDO'}</td>
                            </tr>
                            <tr>
                                <td className='fw-bold'>Ruta</td>
                                <td>{nicById.contractDetailComercial?.pathCode ? nicById.contractDetailComercial?.pathCode : 'NO DEFINIDO'}</td>
                                <td>{nicById.contractDetailSistem?.pathCode ? nicById.contractDetailSistem?.pathCode : 'NO DEFINIDO'}</td>
                            </tr>
                            <br />
                        </tbody>
                    </table>
                    <table className='w-100'>
                        <thead>
                            <tr>
                                <th>Acción</th>
                                <th>Fecha de acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <td>{nicById.contractDetailSistem?.approverUser ? nicById.contractDetailSistem?.approverUser : 'NO DEFINIDO'}</td>
                            <td>{nicById.contractDetailSistem?.approvalDate ? format(parseISO(nicById.contractDetailSistem?.approvalDate), 'dd/MM/yyyy') : 'NO DEFINIDO'}</td>
                        </tbody>
                    </table>
                </div>
                <div className='contract-required mt-3'>
                    {
                        data == 'Rejected' ? (
                            <div className='text-center'>
                            <label className='mb-1 fw-bold'>Motivo de cancelación o rechazo</label>
                            <p className='mb-0'>{nicById.contractDetailSistem?.comment}</p>
                            </div>
                        ) : (
                            <div className='text-center'>
                            <label className='mb-1 fw-bold'>Motivo de cancelación o rechazo</label>
                            <textarea type="text" className='w-100' value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                            <p style={{color: 'red'}}>{messageError}</p>
                            </div>
                        )

                    }
                </div>
                <div className='mt-2 d-flex justify-content-between w-100'>
                    {
                        data != 'Rejected' && (
                            <>
                            <button className='btn btn-danger' onClick={(e) => { e.preventDefault(); RejectedClient(nicById.contractDetailSistem?.nicCode)}}>Rechazar</button>                            
                            </>
                        )
                    }
                    {
                    data == 'Pending' && (
                            <>
                                <button className='btn btn-secondary' onClick={(e) => { e.preventDefault(); approvedClient(nicById.contractDetailSistem?.nicCode)}}>Aprobar</button>
                            </>
                            )
                        }
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button type='button' className="btn btn-primary" onClick={() => handleClose()}>Cerrar</button>
            </Modal.Footer>
        </Form>
      </Modal>
  )
}

export default ContractDetailModal;