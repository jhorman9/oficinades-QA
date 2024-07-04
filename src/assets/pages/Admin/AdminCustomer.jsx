import React, { useEffect, useRef, useState } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import 'datatables.net-dt/css/jquery.dataTables.css'; // Importa el CSS si lo necesitas
import 'datatables.net-dt/css/jquery.dataTables.min.css'; // Importa el CSS si lo necesitas
import closeSVG from '../../images/icons/icon _close circle.svg';
import '../../styles/Admin/AdminUsers.css';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useCustomer from '../../../hook/useCustomer';
import { Link } from 'react-router-dom';
import SVGArrowRight from '../../images/icons/SVGArrowRight';
import PaginateComponent from '../../components/PaginateComponent';
import { useSelector } from 'react-redux';
import GeneratorCSV from '../../components/GeneratorCSV';
import GeneratorExcel from '../../components/GeneratorExcel';

const AdminCustomer = () => {
  const {register, handleSubmit, reset, formState: { errors }} = useForm();
  const { GetAllUserCustomer, getAllUser, DeleteUserCustomer, getPagination } = useCustomer();
  const [itemPerPageState, setItemPerPageState] = useState(10);
  const [pageNumberState, setPageNumberState] = useState(0);
  const [searchState, setSearchState] = useState();
  const [isNic, setIsNic] = useState(false);
  const [isSort, setIsSort] = useState('desc');
  const rol = useSelector(state => state.getRol);

  const status = {
    'Active': 'ACTIVO',
    'Suspended': 'SUSPENDIDO'
  }

  useEffect(() => {
    GetAllUserCustomer(itemPerPageState, pageNumberState, searchState, isSort);
  }, [itemPerPageState, pageNumberState, searchState, isSort]);

  const seeMoreContracts = (user) => {    
    Swal.fire({
      title: `Listado de NIC ${user.name}`,
      html: `<ul>${user.contracts?.map(contract => `<li class='color-primary' key=${contract}>${contract}</li>`).join('')}</ul>`,
      icon: "info",
      confirmButtonColor: 'var(--primary)',
    });
  };

  const handleDeleteUser = (user) => {
    Swal.fire({
      title: "Eliminar cliente",
      html: `<p>Desea eliminar al usuario <span style="color: var(--primary);">${user.name}</span>, <br />con el <span style="color: var(--primary);">ID: ${user.customerId}</span>? <br /> <br /> <span class='fw-bold color-primary'>¿Desea continuar?</span></p>`,
      icon: "question",
      iconColor: 'var(--primary)',
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "var(--primary)",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteUserCustomer(user.customerId);        
      }
    });
  };

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
    "Nombre",
    "Email",
    "Estatus",
    "Contratos",
    "Creado",
  ]
  
  const rowDetail = row => [
    row.customerId,
    row.name,
    row.email,
    status[row.status],
    row.contracts.map(contract => contract).join(", "),
    format(parseISO(row.registerDate), 'dd/MM/yyyy'),
  ]

  return (
    <section className='usersAdmin'>
      <div className="usersAdmin__content container">
        <h5 className="title__panel mb-3">USUARIOS ADMIN</h5>
        <div className="usersAdmin__body personalized-responsive">
            <div className="usersAdmin__btn-top">
              <h6 className="color-primary fw-bold mb-3">Usuarios</h6> 
              <div className='btn-generators'>
                <GeneratorCSV data={getAllUser} name={"Clientes"} title={title} rowDetail={rowDetail}/>
                <GeneratorExcel data={getAllUser} name={"Clientes"} titles={title} rowDetail={rowDetail}/>
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
                  {/* {
                    getPagination.length > 0 && (
                      <button type='button' className='btn btn-primary me-2'>Reiniciar</button>
                    )
                  } */}
                  <select className='px-2' {...register('searchOption')} onChange={(e)=> setIsNic(e.target.value)}>
                    <option value="">Buscar por</option>
                    <option value="1">Nombre</option>
                    <option value="2">Correo</option>
                    <option value="3">N&ordm; Documento</option>
                    <option value="4">NIC</option>
                  </select>
                </div>
                <div className='d-flex gap-2 align-items-center'>                
                  <input className='px-2' type={isNic == 4 ? "number" : "text"} placeholder='Buscar' {...register('searchValue')}/>
                </div>
                <div>
                  <button className="btn btn-primary">Buscar</button>
                </div>
              </div>
            </form>
          </div>
          {
            getAllUser.length <= 0 ? (
              <p>No hay usuarios</p>
            ) : (
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
                      <th>NIC</th>
                      <th>Creado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getAllUser?.map((users, index) => (
                      <tr className={index % 2 === 0 ? 'odd' : 'even'} key={index}>
                        <td className='fw-normal'>{users.customerId}</td>
                        <td className='fw-normal'>{users.name}</td>
                        <td className='fw-normal'>{users.email}</td>
                        <td className='fw-normal'>{status[users.status]}</td>
                        <td className='fw-normal'>{users.contracts?.length > 0 ? (<><span>{users.contracts[0]}</span> <br /> {users.contracts.length > 1 ? <small className='text-center cursor-pointer color-primary' title={users.contracts?.map(contract => contract)} onClick={() =>seeMoreContracts(users)}>Ver más</small> : '' }</>): null}</td>
                        <td className='fw-normal'>{users.registerDate && isValid(parseISO(users.registerDate)) ? format(parseISO(users.registerDate), 'dd/MM/yyyy') : 'Invalid Date'}</td>
                        <td className='fw-normal'>
                          <span className='d-flex gap-3 '>
                            {
                               rol == 'Super' || rol == 'Admin' ? (
                              <span className='cursor-pointer'>
                                <img className='delete' src={closeSVG} onClick={() => handleDeleteUser(users)} alt="Eliminar" title='Eliminar'/>
                              </span>
                              ) : (
                                null
                              )
                            }
                            <Link className='cursor-pointer text-decoration-none color-inherit' to={`${users.customerId}`}><SVGArrowRight /></Link>
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


export default AdminCustomer;
