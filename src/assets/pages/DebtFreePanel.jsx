import React, { useEffect, useRef, useState } from 'react';
import '../styles/ClaimPanel.css';
import '../styles/DebtFree.css';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';
import '../styles/payPanel.css';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import { Button, Form, Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import useCertificate from '../../hook/useCertificate';
import SVGDownloadPDF from '../images/icons/SVGDownloadPDF';
import Swal from 'sweetalert2';
import closeSVG from '../images/icons/icon _close circle.svg';
import { SVGWarning } from '../images/icons/SVGWarning';
import PNGWarning from '../images/danger (1).png';


const DebtFreePanel = () => {

  const { register, handleSubmit, reset, formState: {errors} } = useForm();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const nic = localStorage.getItem('nicCode');
  const navigate = useNavigate();
  
  const { GetAllCertificateByNicCode, allCertificate, CreateCertificateH, GetCertificateByRequestId, DeleteCertificate } = useCertificate();
  const tableRef = useRef(null);
  const [tableInitialized, setTableInitialized] = useState(false);
  
  useEffect(() => {
    GetAllCertificateByNicCode(nic, navigate); 
  }, [])

  useEffect(() => {
    if (!tableInitialized) {
      const table = $(tableRef.current).DataTable({
        responsive: true,
        info: false,
        language: {
          url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        columnDefs: [
          { targets: 0, orderable: true }, 
          { targets: '_all', orderable: false },
          { responsivePriority: 1, targets: 0 },
          { responsivePriority: 2, targets: -1 }
        ],
      });
      setTableInitialized(true);
    }
    
    return () => {
      if (tableInitialized) {
        const table = $(tableRef.current).DataTable();
        table.destroy();
        setTableInitialized(false);
      }
    };
    
  }, [allCertificate, tableInitialized]);

  const createCertificate = (data) => {
    Swal.fire({
      title: 'Estas segur(a)/o?',
      text: 'El costo correspondiente a la solicitud de un paz y salvo es de B/1. el mismo será cobrado en la factura del servicio.',
      showDenyButton: true,
      confirmButtonText: 'Si, estoy segur(a)/o',
    }).then((result) => {
      if (result.isConfirmed) {
        data.NicCode = nic;
        if(data.DocumentData.length == 0) data.DocumentData = null
        CreateCertificateH(data, reset, nic);
        setShow(false);
      }else if(result.isDenied){
        setShow(false);
        reset();
      }
    })
  };

  const handleDownloadClick = (data) => {
    data ? GetCertificateByRequestId(data) : null;
  };
  
  const handleDeleteCertificate = (id) => {
    Swal.fire({
      icon: 'question',
      iconColor: 'var(--primary)',
      title: 'Eliminar paz y salvo',
      text: `Una vez que se elimine el documento de paz y salvo con el ID ${id}, perderá la capacidad de descargar los documentos de paz y salvo aprobados.`,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonColor: "var(--primary)",
      confirmButtonColor: "#d33",
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteCertificate(nic,id)
      }
    })
  }

  const statusMap = {
    'Pending': 'REGISTRO EN PROCESO',
    'Revision': 'REGISTRO PREAPROBADO',
    'Approval': 'REGISTRO APROBADO',
    'Rejected': 'REGISTRO DENEGADO',
  };
  const statusMap2 = {
    'Pending': 'EN ESPERA DE EMISIÓN',
    'Enabled': 'PAZ Y SALVO EMITIDO',
    'Disabled': 'Restricción (Inactivo / Sin Suministro)',
    'Expired': 'PAZ Y SALVO EXPIRADO',
  };
    
  return (
    <section className=' debt__panel claim__panel container'>
    <div className="claim__panel__container">
      <div className="claim__panel__title__top">
        <h5 className='mb-3 fw-bold title__panel'>PAZ Y SALVO</h5>
      </div>
      <div className="debt__top__text mb-3">
        <SVGWarning/>
        <p className='color-primary mb-0'>Le informamos que si usted no es el titular de la cuenta, debe adjuntar a la solicitud copia de cédula del solicitante. De otro modo, su solicitud será denegada.
        <strong> IMPORTANTE:</strong> Si hubo un cambio de dueño de la propiedad este cambio debe ser notificado al IDAAN, para la correcta emisión del Paz y Salvo. <br /><Link className='fw-bold' style={{color: 'rgba(28, 155, 210, 1)'}} to={'https://www.idaan.gob.pa/idaan-programademejora-preguntasfrecuentes/#1462478273361-b9da23f8-886f'} target='_blank'>Saber más.</Link></p>
      </div>
      <div className="table__claim">
        <div className="title__button">
          <h6 className='color-primary fw-bold'>Historial de paz y salvo</h6>
          <div className="table__claim__button__header mb-2">
            <button className="btn btn-primary" onClick={handleShow}>Solicitar paz y salvo</button>
          </div>
        </div>
        {
          allCertificate?.length > 0 ? (
          <table ref={tableRef} className='display responsive w-100'>
            <thead>
              <tr className='table__bill__header'>
                <th>Número de solicitud</th>
                <th>Fecha de registro</th>
                <th>Finca/tomo/folio</th>
                <th>Fecha de proceso</th>
                <th>Estado de registro</th>
                <th>Estado de paz y salvo</th>
                <th>Cantidad de paz y salvo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {
                allCertificate?.map((certificate) =>(
                  <tr key={certificate?.requestId}>
                    <td>{certificate?.requestId}</td>
                    <td>{certificate?.createAt}</td>
                    <td>{certificate?.pathCode}</td>
                    <td>{certificate?.approverDate}</td>
                    <td>{statusMap2[certificate?.statusCertificate]}</td>
                    <th className='fw-normal'>{statusMap[certificate?.status]}</th>
                      <th className='fw-normal'>
                        {
                          certificate.statusCertificate == 'Enabled' && certificate.status == 'Approval'  ? (
                            <div className="content__table">
                              <div>{certificate?.quantity}</div>
                              <div className='cursor-pointer' onClick={() => certificate.statusCertificate == 'Enabled' && certificate.status == 'Approval' ? handleDownloadClick(certificate.requestId) : null}>
                                <SVGDownloadPDF />
                              </div>
                            </div>
                          ) : null
                        } 
                      </th>
                    <th className='text-center'><img className='cursor-pointer' src={closeSVG} onClick={() => handleDeleteCertificate(certificate.requestId)}/></th>
                  </tr>
                ))
              }
            </tbody>
          </table>
          ) : (
            <p className='pt-4 text-center'>No hay historial de paz y salvo</p>
          )
        }
      </div>
    </div>
    <Modal className='modal__Add-ChooseNic debt__modal' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Solicitar paz y salvo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="debt__text__yellow mb-3">
            <img src={PNGWarning} alt="" />
            <p className=''>Le informamos que si usted no es el titular de la cuenta, debe adjuntar a la solicitud copia de cédula del solicitante. De otro modo, su solicitud será denegada. <br /> <strong>IMPORTANTE:</strong> Si hubo un cambio de dueño de la propiedad este cambio debe ser notificado al IDAAN, para la correcta emisión del Paz y Salvo, <Link target='_blank' to={'https://www.idaan.gob.pa/idaan-programademejora-preguntasfrecuentes/#1462478273361-b9da23f8-886f'}>Saber más...</Link></p>
          </div>
            {/* <p className='mb-3 color-primary'><strong>IMPORTANTE:</strong>El costo correspondiente a la solicitud de un paz y salvo es de B/1. </p> */}
            <Form onSubmit={handleSubmit(createCertificate)}>
                <div className="modal__inputs__group">
                    <div className="modal__inputs__group__input">
                        <label className='is-required'>Tomo</label>
                        <input {...register('TomoCode', {required: 'Este campo no debe estar vacio'})} type="text" className="form-control" placeholder="Escribe aquí" />
                        <small className='text-form' style={{color: 'red'}}>{errors.TomoCode?.message}</small>
                    </div>
                    <div className="modal__inputs__group__input">
                        <label className='is-required'>Folio</label>
                        <input {...register('FolioCode', {required: 'Este campo no debe estar vacio'})} type="text" className="form-control" placeholder="Escribe aquí" />
                        <small className='text-form' style={{color: 'red'}}>{errors.FolioCode?.message}</small>
                    </div>
                </div>
                <div className="modal__inputs__group">
                  <div className="modal__inputs__group__input">
                    <label className='is-required'>Finca</label>
                    <input {...register('FincaCode', {required: 'Este campo no debe estar vacio'})} type="text" className="form-control" placeholder="Escribe aquí" />
                    <small className='text-form' style={{color: 'red'}}>{errors.FincaCode?.message}</small>
                  </div>
                  <div className="modal__inputs__group__input">
                    <label className='is-required'>Cantidad de paz y salvo</label>
                    <input {...register('Quantity', {
                      required: 'Este campo no debe estar vacio', 
                      max: {
                       value: 50,
                       message: 'La cantidad maxima es de 50 certificados' 
                      }
                      })} type="number" className="form-control" placeholder="Escribe aquí" />
                    <small className='text-form' style={{color: 'red'}}>{errors.Quantity?.message}</small>
                  </div>
                </div>
                <div className="modal__inputs__group__input">
                <input {...register('DocumentData', {
                          validate: {
                            validateSize: (value) => {
                              if (value[0]) {
                                const size = value[0].size;
                                const sizeInKilobytes = size / 1024;
                                const sizeInMegabytes = sizeInKilobytes / 1024;
                                const sizeInMbRounded = sizeInMegabytes.toFixed(2);
                                if (sizeInMbRounded > 2) {
                                  return 'El archivo que estás intentando adjuntar supera los 2MB máximos permitidos, disminuye el peso del archivo e intenta de nuevo.';
                                }
                              }
                            },
                            validateFileType: (value) => {
                              if (value[0] && !['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value[0].type)) {
                                return 'Solo se permite formato PDF, DOC y DOCX';
                              }
                            },
                          },
                        })}
                        type="file"
                        className="form-control"
                        placeholder="Escribe aquí"
                      />
                    <label className="form-text mt-2">Cargar documentación necesaria (pdf, doc, docx) 2MB Max.</label><br />
                    <small className='text-form' style={{color: 'red'}}>{errors.DocumentData?.message}</small>
                  </div>
                <div className="placeButton mt-4">
                    <Button type='submit' variant="primary">Solicitar</Button>
                </div>
            </Form>
        </Modal.Body>
    </Modal>
  </section>
  )
}

export default DebtFreePanel;