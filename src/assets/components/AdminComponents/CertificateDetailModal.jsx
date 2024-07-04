import React, { useEffect, useRef, useState } from 'react'
import { Form, Modal } from 'react-bootstrap';
import useProvince from '../../../hook/useProvince';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import useContractAdmin from '../../../hook/useContractAdmin';
import useCertificateAdmin from '../../../hook/useCertificateAdmin';
import PdfIcon from '../../images/icons/icon-pdf.svg';
import FileComponent from '../FileComponent';
import { format, formatISO, parseISO } from 'date-fns';

const CertificateDetailModal = ({certificateByID, data, show, handleClose, nicById, setIsRefresh, isRefresh, idRequest}) => {

    const [message, setMessage] = useState('');
    const [message2, setMessage2] = useState('');
    const [messageError, setMessageError] = useState('');
    const { ApprovedCertificateAdmin, GetCertificateDetailByRequestId } = useCertificateAdmin();
    const rol = useSelector(state => state.getRol);

    const documentType = {
        "1": 'CÉDULA',
        "2": 'PASAPORTE',
        "3": 'RUC',
        "4": 'ENTIDAD GUBERNAMETAL'
    };

    const documentType2 = {
        1: 'CÉDULA',
        2: 'PASAPORTE',
        3: 'RUC',
        4: 'ENTIDAD GUBERNAMETAL'
    };

    const state = {
        'Pending': 'Pendiente',       
        'Approval': 'Aprobado', 
        'Rejected': 'Rechazado',
        'Revision': 'Pre-aprobado'
    }

    if(message == 'Seleccione una opción'){
        setMessage('');
    }

    const approvedCertificate = (id) => {
        Swal.fire({
            title: "Aprobar paz y salvo",
            html: `<p>Deseas aprobar al número de solicitud <span style="color: var(--primary);">${id}</span>?</p>`,
            icon: "question",
            iconColor: 'var(--primary)',
            showCancelButton: true,
            confirmButtonColor: "var(--primary)",
            cancelButtonColor: "#d33",
            confirmButtonText: "Aprobar",
            cancelButtonText:'Cancelar',
          }).then((result) => {
            if (result.isConfirmed) {
                const certificate = {
                    CertificateId: id,
                    Status: 'APROBADA',
                    Comments: message.length > 0 ? message : message2
                }
                ApprovedCertificateAdmin(certificate, setIsRefresh, handleClose);
            }
          })
    };

    const preApprovedCertificate = (id) => {
        Swal.fire({
            title: "Pre-aprobar paz y salvo",
            html: `<p>Deseas pre-aprobar al número de solicitud <span style="color: var(--primary);">${id}</span>?</p>`,
            icon: "question",
            iconColor: 'var(--primary)',
            showCancelButton: true,
            confirmButtonColor: "var(--primary)",
            cancelButtonColor: "#d33",
            confirmButtonText: "Pre-aprobar",
            cancelButtonText:'Cancelar',
          }).then((result) => {
            if (result.isConfirmed) {
                const certificate = {
                    CertificateId: id,
                    Status: 'PREAPROBADA',
                    Comments: message?.length > 0 ? message : message2
                }
                ApprovedCertificateAdmin(certificate, setIsRefresh, handleClose);
                handleClose();
            }
          })
    };

    const RejectedCertificate = (id) => {
        message.length > 1 || message2.length > 3 ? 
        Swal.fire({
            title: "Rechazar paz y salvo",
            html: `<p>Deseas rechazar al número de solicitud <span style="color: var(--primary);">${id}</span>?</p>`,
            icon: "question",
            iconColor: 'var(--primary)',
            showCancelButton: true,
            cancelButtonColor: "var(--primary)",
            confirmButtonColor: "#d33",
            cancelButtonText:'Cancelar',
            confirmButtonText: "Rechazar"
          }).then((result) => {
            if (result.isConfirmed) {
                const certificate = {
                    CertificateId: id,
                    Status: 'NEGADA',
                    Comments: message.length > 0 ? message : message2
                }
                ApprovedCertificateAdmin(certificate, setIsRefresh, handleClose);
            }
          })
          :
          setMessageError('Debes enviar obligatoriamente el motivo de la cancelación');
    };

    useEffect(() => {
        if(show == false){
            setMessage('');
            setMessage2('');
        }
    },[show]);
    
    useEffect(() => {
        if(message.length > 0  || message2.length > 0){
            setMessageError('');
        }
    },[message, message2]);
    
    const handleClickFile = () => {
        const fileTypes = {
            '.pdf': 'application/pdf',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.txt': 'text/plain',
            '.mp4': 'video/mp4',
            '.avi': 'video/x-msvideo',
            '.zip': 'application/zip',
            '.rar': 'application/x-rar-compressed',
            '.xls': 'application/vnd.ms-excel',
            '.ppt': 'application/vnd.ms-powerpoint',
            '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          };
    
        const b64toBlob = (b64Data) => {
            const byteCharacters = atob(b64Data);
            const byteNumbers = new Array(byteCharacters.length);
    
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
    
            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type: fileTypes[certificateByID.fileExtension] });
    
          };
          if(certificateByID) {
              const blob = b64toBlob(certificateByID.fileData);
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = certificateByID?.fileName;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
          }
    }
    
  return (
    <Modal size='lg' centered id='user__detail' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Detalle del certificado</Modal.Title>
        </Modal.Header>
            <Modal.Body>
                <div className='d-flex gap-2 flex-column flex-lg-row'>
                <table className='w-100'>
                        <thead>
                            <th className='text-center'>Base de datos comercial</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>NIC: </span>{certificateByID?.comercialDetails.nicCode}</td>
                            </tr>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>Propietario: </span>{certificateByID?.comercialDetails.name}</td>
                            </tr>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>Finca/Tomo/Folio: </span>{certificateByID?.comercialDetails.fincaCode}/{certificateByID?.comercialDetails.tomoCode}/{certificateByID?.comercialDetails.folioCode}</td>
                            </tr>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>Distrito: </span>{certificateByID?.comercialDetails.distrite}</td>
                            </tr>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>Corregimiento: </span>{certificateByID?.comercialDetails.corregimiento}</td>
                            </tr>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>Barrio: </span>{certificateByID?.comercialDetails.town}</td>
                            </tr>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>Dirección: </span>{certificateByID?.comercialDetails.address}</td>
                            </tr>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>ID: </span>{certificateByID?.comercialDetails.rucCode}</td>
                            </tr>
                            <tr>
                                <td className='fw-normal'><span style={certificateByID?.comercialDetails.statusContrat.includes('SIN') ? {color: 'green'} : {color: 'red'}}>{certificateByID?.comercialDetails.statusContrat}</span></td>
                            </tr>
                        </tbody>
                    </table>
                    <table className='w-100'>
                        <thead>
                            <th className='text-center'>Datos de la propiedad</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>NIC: </span>{certificateByID?.propertyDetails.nicCode}</td>
                            </tr>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>Propietario: </span>{certificateByID?.propertyDetails.name}</td>
                            </tr>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>Finca/Tomo/Folio: </span>{certificateByID?.propertyDetails.fincaCode}/{certificateByID?.propertyDetails.tomoCode}/{certificateByID?.propertyDetails.folioCode}</td>
                            </tr>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>Provincia: </span>{certificateByID?.propertyDetails.province}</td>
                            </tr>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>Fecha de registro: </span>{certificateByID?.propertyDetails.createAt && format(parseISO(certificateByID?.propertyDetails.createAt), 'dd/MM/yyyy hh:mm:ss a')}</td>                            
                            </tr>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>Estado: </span>{state[certificateByID?.propertyDetails.requestStatus]}</td>
                            </tr>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>Fecha de proceso: </span>{certificateByID?.propertyDetails.approverDate && format(parseISO(certificateByID?.propertyDetails.approverDate), 'dd/MM/yyyy hh:mm:ss a')}</td>
                            </tr>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>N&ordm; de solicitud: </span>{certificateByID?.propertyDetails.requestId}</td>
                            </tr>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>N&ordm; de paz y salvo solicitado: </span>{certificateByID?.propertyDetails.quantity}</td>
                            </tr>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>Acción de pre-aprobación: </span>{certificateByID?.propertyDetails.userAttendent}</td>
                            </tr>
                            <tr>
                                <td className='fw-normal'><span className='fw-bold'>Acción de {certificateByID?.propertyDetails.requestStatus == 'Rejected' ? 'rechazo' : 'aprobación'}: </span>{certificateByID?.propertyDetails.userAproved}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {
                    certificateByID?.propertyDetails.requestStatus == 'Rejected' || certificateByID?.propertyDetails.requestStatus == 'Approval'  ? (
                        null 
                    ):(
                        <>
                    <div className='mt-2'>
                        <label className='fw-bold'>Observaciones</label>
                        {
                            message2?.length < 1 && (
                                <>
                                    <select className='w-100' onChange={(e) => setMessage(e.target.value)}>
                                    <option selected>
                                        Seleccione una opción
                                    </option>
                                    <option>
                                        Usted presenta una deuda con IDAAN
                                    </option>
                                    <option>
                                        Su finca se encuentra deshabilitada, por favor apersonarse a IDAAN con la escritura de la propiedad
                                    </option>
                                    <option>
                                        Los datos proporcionados en su solicitud no concuerdan con nuestro sistema
                                    </option>
                                    <option>
                                        Usted necesita adjuntar una autorización para la solicitud
                                    </option>
                                </select>
                            
                                </>
                            )
                        }
                    </div>
                    {
                        message?.length >= 1 || message2?.length >= 1  ? (
                            null
                            ) : ( 
                            <h6 className='text-center mt-2'>O</h6>
                        )
                    }
                    {
                        message?.length < 1 && (
                            <div>
                                <textarea type="text" className='w-100' value={message2} onChange={(e) => setMessage2(e.target.value)}></textarea>
                            </div>
                        )
                    }
                        </>
                    )
                }
                {
                    certificateByID?.fileData && certificateByID?.fileName && certificateByID?.fileExtension && (
                    <div className='certificate__file mt-2 w-fit-content'>
                        <label className='fw-bold d-block'>DOCUMENTO ADJUNTO</label>
                        <img src={PdfIcon} alt="" onClick={() => handleClickFile()} width={50}/>
                    </div>
                    )
                }
                    <p style={{color: 'red'}}>{messageError}</p>
                    <div className='mt-2 d-flex justify-content-between 2-100'>
                        {
                            certificateByID?.propertyDetails.requestStatus == 'Pending' || certificateByID?.propertyDetails.requestStatus == 'Revision'  ? (
                                <button className='btn btn-danger' onClick={(e) => { e.preventDefault(); RejectedCertificate(certificateByID?.propertyDetails.requestId)}}>Rechazar</button>
                            ) : (
                                null
                            )
                        }
                        <div className='d-flex gap-2'>
                            {
                                certificateByID?.propertyDetails.requestStatus == 'Pending'  ? (
                                    <button className='btn btn-secondary' onClick={(e) => { e.preventDefault(); preApprovedCertificate(certificateByID?.propertyDetails.requestId)}}>Pre-aprobar</button>
                                ) : (
                                    null
                                )
                            }
                            {
                                certificateByID?.propertyDetails.requestStatus == 'Revision' && (rol == 'Super' || rol == 'Admin')  ? (
                                    <button className='btn btn-secondary' onClick={(e) => { e.preventDefault(); approvedCertificate(certificateByID?.propertyDetails.requestId)}}>Aprobar</button>
                                ) : (
                                    null
                                )
                            }
                        </div>
                    </div>
            </Modal.Body>
            <Modal.Footer>
                <button type='button' className="btn btn-primary" onClick={() => handleClose()}>Cerrar</button>
            </Modal.Footer>
      </Modal>
  )
}

export default CertificateDetailModal;