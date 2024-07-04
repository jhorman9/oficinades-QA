import React, { Fragment, useEffect, useRef, useState } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import '../../styles/Admin/AdminUsers.css';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import SVGArrowRight from '../../images/icons/SVGArrowRight';
import useComplaint from '../../../hook/useComplaint';
import PaginateComponent from '../../components/PaginateComponent';
import GeneratorCSV from '../../components/GeneratorCSV';
import GeneratorExcel from '../../components/GeneratorExcel';


const AdminClaim = () => {
  const {register, handleSubmit, reset, formState: { errors }} = useForm();
  const { GetAllComplaint, getAllComplaint, getPagination } = useComplaint();
  const [itemPerPageState, setItemPerPageState] = useState(10);
  const [pageNumberState, setPageNumberState] = useState(0);
  const [searchState, setSearchState] = useState();
  const [isSort, setIsSort] = useState('desc');  
  
  const status = {
    'Pending': 'EN TRÁMITE',
    'Finalized': 'FINALIZADA',
  }

  useEffect(() => {
    GetAllComplaint(itemPerPageState, pageNumberState, searchState, isSort);
  }, [itemPerPageState, pageNumberState, searchState, isSort]);

  const handlePageChange = selectedPage => {
    setPageNumberState(selectedPage.selected);
  };

  const searchUsers = (data) => {
    if(data.searchOption?.length <= 0){
      return Swal.fire({
        icon: 'error',
        title: 'Selecciona una opción',
        text: 'Debes seleccionar una opción en el filtrado de busqueda',
        confirmButtonColor: 'var(--primary)',
      })
    }
    setSearchState(data);
    setPageNumberState(0);
    getPagination.currentPage = 0;
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
      "Tipo de reclamo",
      "NIC",
      "Código",
      "Estatus",
      "Creado",
    ]
    
    const rowDetail = row => [
      row.complaintId,
      row.complaintTypeDescription,
      row.nicCode,
      row.obsId,
      status[row.status],
      format(parseISO(row.createAt), 'dd/MM/yyyy'),
    ]

    return (
    <section className='usersAdmin'>
      <div className="usersAdmin__content container">
        <h5 className="title__panel mb-3">RECLAMOS</h5>
        <div className="usersAdmin__body">
          <div className="usersAdmin__btn-top">
            <h6 className="color-primary fw-bold">Reclamos</h6> 
            <div className='btn-generators'>
              <GeneratorCSV data={getAllComplaint} name={"Reclamos"} title={title} rowDetail={rowDetail}/>
              <GeneratorExcel data={getAllComplaint} name={"Reclamos"} titles={title} rowDetail={rowDetail}/>
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
            <form onSubmit={handleSubmit(searchUsers)}>
              <div className='personalized-table-search'>
                <div className='d-flex align-items-center'>
                  <select className='px-2' {...register('searchOption')}>
                    <option value="0">Buscar por</option>
                    <option value="1">NIC</option>
                    <option value="2">Código</option>
                  </select>
                </div>
                <div className='d-flex gap-2 align-items-center'>                
                  <input className='px-2' type={"number"} placeholder='Buscar' {...register('searchValue')}/>
                </div>
                <div>
                  <button className="btn btn-primary">Buscar</button>
                </div>
              </div>
            </form>
          </div>
          {
            getAllComplaint.length <= 0 ? (
              <p>No hay reclamos</p>
            ) : (
              <>
              <div className='w-100 overflow-x-scroll'>
                <table className='display responsive w-100 pt-3 personalized-responsive personalized-table'>
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
                      <th>Tipo de reclamo</th>
                      <th>NIC</th>
                      <th>Código</th>
                      <th>Estatus</th>
                      <th>Creado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getAllComplaint?.map((complaint, index) => (
                      <tr className={index % 2 === 0 ? 'odd' : 'even'} key={index}>
                        <td className='fw-normal'>{complaint.complaintId}</td>
                        <td className='fw-normal'>{complaint.complaintTypeDescription}</td>
                        <td className='fw-normal'>{complaint.nicCode}</td>
                        <td className='fw-normal'>{complaint.obsId}</td>
                        <td className='fw-normal'>{status[complaint.status]}</td>
                        <td className='fw-normal'>{complaint.createAt && isValid(parseISO(complaint.createAt)) ? format(parseISO(complaint.createAt), 'dd/MM/yyyy') : 'Invalid Date'}</td>
                        <td className='fw-normal'>
                          <span className='d-flex gap-3 '>
                            <Link className='cursor-pointer text-decoration-none color-inherit' to={`${complaint.obsId}`}><SVGArrowRight /></Link>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
                <div className='personalized-table-pagination'>
                  <PaginateComponent paginationData={getPagination} handlePageChange={handlePageChange} />
                </div>
                </>
            )
          }
        </div>
      </div>
    </section>
  );
}


export default AdminClaim;
