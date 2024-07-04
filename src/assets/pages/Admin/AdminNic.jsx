import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { format, isValid, parseISO } from 'date-fns';
import closeSVG from '../../images/icons/icon _close circle.svg';
import useContractAdmin from '../../../hook/useContractAdmin';
import useProvince from '../../../hook/useProvince';
import SVGArrowRight from '../../images/icons/SVGArrowRight';
import useNic from '../../../hook/useNic';
import ContractDetailModal from '../../components/AdminComponents/ContractDetailModal';
import PaginateComponent from '../../components/PaginateComponent';
import GeneratorCSV from '../../components/GeneratorCSV';
import GeneratorExcel from '../../components/GeneratorExcel';
import '../../styles/Admin/AdminNic.css';

const AdminNic = () => {
    const {register, handleSubmit, reset, formState: { errors }, setValue, watch} = useForm();
    const { getAllNICById, nicById } = useNic();
    const { GetContractByStatusNicAndProvince, contractByStatusAndProvince, ApprovedContract, DeleteNicByAdmin, getPagination } = useContractAdmin();
    const [dataTableInstance, setDataTableInstance] = useState(null);
    const [statusNIC, setStatusNIC] = useState('');
    const [isRefresh, setIsRefresh] = useState(false);
    const [show, setShow] = useState();
    const { GetProvinces, provinces } = useProvince();
    const [statusState, setStatusState] = useState(0);
    const [provinceState, setProvinceState] = useState(0);
    const [itemPerPageState, setItemPerPageState] = useState(10);
    const [pageNumberState, setPageNumberState] = useState(0);
    const [valueFiltered, setValueFiltered] = useState(0);
    const [isSort, setIsSort] = useState('desc');
    const [valueTypeEmailOrNic, setValueTypeEmailOrNic] = useState('0');
    const [valueEmailOrNic, setValueEmailOrNic] = useState('');

    const handleClose = () => {
      setShow(false);
    };
    const handleShow = (id) => {
      setShow(true);
      getAllNICById(id, setIsRefresh);
    };
  
    const statusMap = {
      'Pending': 'Pendiente',       
      'Approval': 'Aprobado', 
      'Rejected': 'Rechazado', 
    }

    useEffect(()=> {
      GetProvinces();
    }, []);
  
    useEffect(() => {
      GetContractByStatusNicAndProvince(itemPerPageState, pageNumberState, statusState, provinceState, isSort, valueTypeEmailOrNic, valueEmailOrNic);
    }, [isRefresh, show, itemPerPageState, pageNumberState, statusState, provinceState, isSort, valueTypeEmailOrNic, valueEmailOrNic]);

    const filterData = (data) => {
      setStatusState(data.status);
      setProvinceState(data.province);
      setValueEmailOrNic(data.Search);
      setValueTypeEmailOrNic(data.TypeFilter);
      setPageNumberState(0);
      getPagination.currentPage = 0;
    };

    const deleteNIC = (nic) => {
      Swal.fire({
        title: "Eliminar NIC",
        html: `<p>Estás eliminando el NIC <span style="color: var(--primary);">${nic}</span>, de forma permanente. <br /> <br /> <span class='fw-bold color-primary'>¿Deseas continuar?</span></p>`,
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
      "Email",
      "Estatus",
      "Provincia",
      "NIC",
      "Finca",
      "Rutas",
      "Creado",
      "Última acción",
      "Fecha acción",
    ]
    
    const rowDetail = row => [
      row.contractId,
      row.customerName,
      row.customerEmail,
      statusMap[row.statusName],
      row.province,
      row.nicCode,
      row.fincaCode,
      row.pathCode,
      row.createAt && isValid(parseISO(row.createAt)) ? format(parseISO(row.createAt), 'dd/MM/yyyy') : 'Invalid Date',
      row.approverUser,
      row.approvalDate && isValid(parseISO(row.approvalDate)) ? format(parseISO(row.approvalDate), 'dd/MM/yyyy') : ''
    ]

    return (
      <>
      <section className='usersAdmin'>
        <div className="usersAdmin__content container">
          <h5 className="title__panel mb-3">GESTIÓN DE NIC</h5>
          <div className="usersAdmin__body">
            <div className="usersAdmin__btn-top">
                <h6 className="color-primary fw-bold">NIC</h6>
                <div className='btn-generators'>
                  <GeneratorCSV data={contractByStatusAndProvince} name={"Gestión de NIC"} title={title} rowDetail={rowDetail}/>
                  <GeneratorExcel data={contractByStatusAndProvince} name={"Gestión de NIC"} titles={title} rowDetail={rowDetail}/>
              </div>
            </div>
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
              <form onSubmit={handleSubmit(filterData)} className='personalized-form'>
                <div className='d-flex gap-2 flex-column flex-md-row flex-lg-row personalized-form_content'>
                  <select 
                    {...register('status')}>
                    <option value="0">Todos los estatus</option>
                    <option value="1">Pendiente</option>
                    <option value="2">Aprobados</option>
                    <option value="3">Rechazados</option>
                  </select>
                  <select
                    {...register('province')}
                  >
                    <option value="0">Todas las provincias</option>
                    {provinces?.map((province) => (
                      <option key={province.provinceId} value={province.provinceId}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  <select 
                    {...register('TypeFilter')}
                    value={valueFiltered} 
                    onChange={(e) => {setValueFiltered(e.target.value)}}
                  >
                    <option value="0">Todos</option>
                    <option value="1">Filtrar por NIC</option>
                    <option value="2">Filtrar por correo</option>
                  </select>
                  {
                    (valueFiltered === '1' || valueFiltered === '2') && (
                      <>
                        <input 
                          type="text" 
                          placeholder={valueFiltered === '1' ? 'Escribir NIC' : 'Escribir Correo'} 
                          {...register('Search', {
                            required: valueFiltered === '1' || valueFiltered === '2' ? true : false
                          })} 
                        />
                        {errors.Search && <p>{errors.Search.message}</p>}
                      </>
                    )
                  }
                <button className='ms-0 btn btn-secondary mt-lg-0 mt-md-0 mt-2'>Filtrar</button>
                </div>
              </form>
            </div>
            {
              contractByStatusAndProvince.length > 0 ? (
                <>
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
                      <th>Email</th>
                      <th>Estatus</th>
                      <th>Provincia</th>
                      <th>NIC</th>
                      <th>Creado</th>
                      <th>Última acción</th>
                      <th>Fecha acción</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractByStatusAndProvince?.map((contract, index) => (
                    <tr className={index % 2 === 0 ? 'odd' : 'even'} key={index}>
                      <th className='fw-normal'>{contract.contractId}</th>
                        <th className='fw-normal'>{contract.customerName}</th>
                        <th className='fw-normal'>{contract.customerEmail}</th>
                        <th className='fw-normal'>{statusMap[contract.statusName]}</th>
                        <th className='fw-normal'>{contract.province}</th>
                        <th className='fw-normal'>{contract.nicCode}</th>
                        <th className='fw-normal'>{contract.createAt && isValid(parseISO(contract.createAt)) ? format(parseISO(contract.createAt), 'dd/MM/yyyy') : 'Invalid Date'}</th>
                        <th className='fw-normal'>{contract.approverUser}</th>
                        <th className='fw-normal'>{contract.approvalDate && isValid(parseISO(contract.approvalDate)) ? format(parseISO(contract.approvalDate), 'dd/MM/yyyy') : ''}</th>
                        <th className='fw-normal'>
                          {
                            // contract.statusName == "Approval" || contract.statusName == "Rejected"  ? (    
                              // null
                            // ) : (
                            <span className='d-flex gap-3'>
                              <span className='cursor-pointer text-center' onClick={() => {handleShow(contract.contractId); setStatusNIC(contract.statusName)}} alt="Abrir" title='Abrir'>
                                <SVGArrowRight />
                              </span>
                              <span className='cursor-pointer' onClick={()=> deleteNIC(contract.nicCode)}>
                                <img src={closeSVG} alt="Borrar NIC" />
                              </span>
                            </span>
                            // )
                          }
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                <div className='personalized-table-pagination'>
                  <PaginateComponent paginationData={getPagination} handlePageChange={handlePageChange} />
                </div>
                </>
              ) : (
                <p className='text-center mt-3 mb-0'>No hay contratos</p>
              )
            }
          </div>
        </div>
      </section>
      <ContractDetailModal setShow={setShow} data={statusNIC} dataTableInstan={dataTableInstance} handleClose={handleClose} show={show} nicById={nicById} setIsRefresh={setIsRefresh}/>
      </>
    );
  }

export default AdminNic