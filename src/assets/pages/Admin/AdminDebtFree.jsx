import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { format, isValid, parseISO } from 'date-fns';
import useProvince from '../../../hook/useProvince';
import useCertificateAdmin from '../../../hook/useCertificateAdmin';
import '../../styles/Admin/AdminDebtFree.css';
import SVGArrow from '../../images/icons/SVGArrowRight';
import CertificateDetailModal from '../../components/AdminComponents/CertificateDetailModal';
import PaginateComponent from '../../components/PaginateComponent';
import GeneratorCSV from '../../components/GeneratorCSV';
import GeneratorExcel from '../../components/GeneratorExcel';
import Swal from 'sweetalert2';

export const AdminDebtFree = () => {

  const {register, handleSubmit} = useForm();
  const { GetAllCertificate, allCertificate, GetCertificateDetailByRequestId, certificateByID, getPagination } = useCertificateAdmin();
  const [isRefresh, setIsRefresh] = useState(false);
  const { GetProvinces, provinces } = useProvince();
  const [show, setShow] = useState();
  const [idRequest, setIdRequest] = useState(null);
  const [statusState, setStatusState] = useState(0);
  const [provinceState, setProvinceState] = useState(0);
  const [valueSearch, setvalueSearch] = useState('');
  const [itemPerPageState, setItemPerPageState] = useState(10);
  const [pageNumberState, setPageNumberState] = useState(0);
  const [typeOfSearhState, setTypeOfSearhState] = useState(0);
  const [isSort, setIsSort] = useState('desc');
  
    const handleClose = () => {
        setShow(false);
    };
    const handleShow = (id) => {
        setIdRequest(id);
        GetCertificateDetailByRequestId(id, setIsRefresh);
        setShow(true);
    };

  const statusMap = {
    'Pending': 'Pendiente',       
    'Approval': 'Aprobado', 
    'Rejected': 'Rechazado',
    'Revision': 'Pre-aprobado'
  }

  const statusMap2 = {
    'Enabled': 'Paz y salvo emitido',       
    'Disabled': 'Restricción(Inactivo / Suministro)', 
    'Pending': 'En espera de emisión', 
    'Expired': 'Expirado'
  }

  useEffect(()=> {
    GetProvinces();
  }, []);
    
  useEffect(() => {
    GetAllCertificate(statusState, provinceState, valueSearch, typeOfSearhState, pageNumberState, itemPerPageState, isSort);
  }, [statusState, provinceState, valueSearch, pageNumberState, itemPerPageState, isSort, show]);

  const filterData = (data) => {
    setTypeOfSearhState(data.Type);
    setStatusState(data.status);
    setProvinceState(data.province);
    setPageNumberState(0);
    getPagination.currentPage = 0;
    if(typeOfSearhState == 0){
      setvalueSearch('');
    }else{
      setvalueSearch(data.SearchValue);
    }
  };

  const handlePageChange = selectedPage => {
    setPageNumberState(selectedPage.selected);
  };

  const sortHandler = () => {
    if(isSort == 'asc'){
      setIsSort('desc');
    }else{
      setIsSort('asc');
    }
  };

  const title = [
    "ID",
    "Nombre",
    "Provincia",
    "NIC",
    "Ruta",
    "Cantidad",
    "N de certificado",
    "Estatus",
    "Última acción",
    "Estatus de certificado",
    "Fecha de gestión",
    "Creado"
  ]
  
  const rowDetail = row => [
    row.requestId,
    row.name,
    row.province,
    row.nicCode,
    row.pathCode,
    row.quantity,
    row.certificateNumbers?.map(certificate => certificate).join(', '),
    statusMap[row.status],
    row.status == 'Revision' ? row.userAttendent : row.status == 'Approval' ? row.userAproved : row.status == 'Rejected' ? row.userAproved : row.status == 'Pending' ? 'Pendiente' : null,
    statusMap2[row.statusCertificate],
    row.approverDate,
    row.createAt,
  ]

  const modalCertificate = (id) =>{
    Swal.fire({
      icon: 'info',
      html: `<ul>${id?.map(i => `<li class='color-primary' key=${i}>${i}</li>`).join('')}</ul>`,
      title: 'Detalle del código de certificado',
    });
  }
  
  return (
    <>
    <section className='usersAdmin admin__debt__free'>
      <div className="usersAdmin__content container">
        <h5 className="title__panel mb-3">PAZ Y SALVO</h5>
        <div className="usersAdmin__body">
          <div className="usersAdmin__btn-top">
            <h6 className="color-primary fw-bold">NIC</h6>
            <div className='btn-generators'>
              <GeneratorCSV data={allCertificate} name={"Paz y salvo"} title={title} rowDetail={rowDetail}/>
              <GeneratorExcel data={allCertificate} name={"Paz y salvo"} titles={title} rowDetail={rowDetail}/>
            </div>
          </div>
          <div>
            <div className="personalized-header">
              <div className='d-flex gap-2 align-items-center'>
                <label htmlFor="">Mostrar</label>
                <select className='personalized-see' onChange={(e) => setItemPerPageState(e.target.value)} value={itemPerPageState}>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="250">250</option>
                  <option value="500">500</option>
                </select>
                <label htmlFor="">Registro</label>
              </div>
              <form onSubmit={handleSubmit(filterData)} className='personalized-form d-flex flex-column flex-lg-row align-items-lg-center align-items-md-center'>
                <div className='d-flex gap-2 flex-column flex-lg-row mb-lg-0 mb-2 personalized-form_content'>
                  {/* {
                    (statusDebt !== '0' || provinceDebt !== '0') ? (
                      <button type='button' className='btn btn-primary' onClick={resetSection}>Reiniciar</button>
                    ) : (
                      null
                    )
                  } */}
                  <select 
                    {...register('status')}>
                    <option value="0">Todos los estatus</option>
                    <option value="1">Pendientes</option>
                    <option value="2">Aprobados</option>
                    <option value="3">Pre-aprobados</option>
                    <option value="4">Rechazados</option>
                  </select>
                  <select {...register('province')}>
                      <option value="0">Todas las provincias</option>
                      {provinces?.map((province) => (
                        <option key={province.provinceId} value={province.provinceId}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  <select {...register('Type')} onChange={(e) => setTypeOfSearhState(e.target.value)}>
                    <option value="0">Buscar por</option>
                    <option value="1">Código</option>
                    <option value="2">NIC</option>
                  </select>
                  {typeOfSearhState == 1 || typeOfSearhState == 2 ? (
                    <input {...register('SearchValue', {
                      required: typeOfSearhState == 1 || typeOfSearhState == 2 ? true : false
                    })} type='text' placeholder={typeOfSearhState === 1 ? 'Escribe el NIC' : 'Escribe el código'}/>
                  ) : (
                    null             
                  )}
                <button className='btn btn-secondary'>Filtrar</button>
                </div>
              </form>
            </div>
          </div>
          {
            allCertificate.length > 0 ? (
              <div className='w-100 overflow-x-scroll'>
                <table className='display responsive w-100 pt-3 personalized-table'>
                  <thead>
                    <tr className='table__userAdmin__header'>
                      <th className='sort__header' onClick={sortHandler}>
                        <div className='sort__personalized'>
                          <span>ID</span>
                          <div className='sort__personalized__container'>
                            <div className={`sort__item ${isSort == 'asc' ? 'opacity_sort' : ''}`}>▲</div>
                            <div className={`sort__item ${isSort == 'desc' ? 'opacity_sort' : ''}`}>▼</div>
                          </div>
                        </div>
                      </th>                       
                      <th>Nombre</th>
                      <th>Provincia</th>
                      <th>NIC</th>
                      <th>Ruta</th>
                      <th>Cantidad</th>
                      <th>N&ordm; de certificado</th>
                      <th>Estatus</th>
                      <th>Última acción</th>
                      <th>Estatus de certificado</th>
                      <th>Fecha de gestión</th>
                      <th>Creado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCertificate?.map((certificate, index) => (
                      <tr className={index % 2 === 0 ? 'odd' : 'even'} key={index}>
                        <td className='fw-normal'>{certificate.requestId}</td>
                        <td className='fw-normal'>{certificate.name}</td>
                        <td className='fw-normal'>{certificate.province}</td>
                        <td className='fw-normal'>{certificate.nicCode}</td>
                        <td className='fw-normal'>{certificate.pathCode}</td>
                        <td className='fw-normal'>{certificate.quantity}</td>
                        <td className='fw-normal'>{certificate.certificateNumbers?.length > 1 ? certificate.certificateNumbers[0] : certificate.certificateNumbers} <br /> <span onClick={certificate.certificateNumbers?.length > 1 ? ()=> modalCertificate(certificate.certificateNumbers) : null}>{certificate.certificateNumbers?.length > 1 ? <small className='color-primary cursor-pointer text-center'>Ver más</small> : null}</span></td>
                        <td className='fw-normal'>{statusMap[certificate.status]}</td> 
                        <td className='fw-normal'>{certificate.status == 'Revision' ? certificate.userAttendent : certificate.status == 'Approval' ? certificate.userAproved : certificate.status == 'Rejected' ? certificate.userAproved : certificate.status == 'Pending' ? 'Pendiente' : null }</td>
                        <td className='fw-normal'>{statusMap2[certificate.statusCertificate]}</td>
                        <td className='fw-normal'>{certificate.approverDate}</td>
                        <td className='fw-normal'>{certificate.createAt}</td>
                        <td className='dtr-none'>
                          <span className='d-flex gap-3 cursor-pointer' onClick={()=> handleShow(certificate.requestId)}>
                            <SVGArrow />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            ) : (
              <p className=' mt-3 mb-0'>No hay paz y salvo</p>
            )
          }
        <div className='personalized-table-pagination'>
          <PaginateComponent paginationData={getPagination} handlePageChange={handlePageChange} />
        </div>
        </div>
      </div>
    </section>
    <CertificateDetailModal certificateByID={certificateByID} handleClose={handleClose} show={show} setIsRefresh={setIsRefresh} isRefresh={isRefresh} idRequest={idRequest} />
    </>
  );
}