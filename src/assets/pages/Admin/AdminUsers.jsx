import React, { useEffect, useState } from 'react';
import useUsers from '../../../hook/useUsers';
import { format, isValid, parseISO } from 'date-fns';
import SVGedit from '../../images/icons/SVGedit';
import 'datatables.net-dt/css/jquery.dataTables.css'; // Importa el CSS si lo necesitas
import 'datatables.net-dt/css/jquery.dataTables.min.css'; // Importa el CSS si lo necesitas
import closeSVG from '../../images/icons/icon _close circle.svg';
import '../../styles/Admin/AdminUsers.css';
import UserCreateModal from '../../components/AdminComponents/UserCreateModal';
import { useForm } from 'react-hook-form';
import ModalButton from '../../components/ModalButton';
import Swal from 'sweetalert2';
import UserEditModal from '../../components/AdminComponents/UserEditModal';
import { useSelector } from 'react-redux';
import PaginateComponent from '../../components/PaginateComponent';
import GeneratorCSV from '../../components/GeneratorCSV';
import GeneratorExcel from '../../components/GeneratorExcel';

const AdminUsers = () => {

  const rol = useSelector(state => state.getRol);
  const {register, handleSubmit, reset, formState: { errors }} = useForm();
  const { GetAllUserAdmin, getAllUserAdministration, DeleteUserAdmin, GetUserByIdAdmin, getUserByIdState, getPagination} = useUsers();
  const [dataTableInstance, setDataTableInstance] = useState(null);
  const [show, setShow] = useState();
  const [show2, setShow2] = useState();
  const [itemPerPageState, setItemPerPageState] = useState(10);
  const [pageNumberState, setPageNumberState] = useState(0);
  const [searchState, setSearchState] = useState();
  const [isSort, setIsSort] = useState('desc');

  const [isRefresh, setIsRefresh] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };
  const handleClose2 = () => {
    setShow2(false);
  };
  const handleShow2 = () => {
    setShow2(true);
  };

  const roles = {
    'Assistant': 'ATENDEDOR',
    'Admin': 'ADMINISTRADOR',
    'Super': 'SUPER ADMINISTRADOR'
  };

  const status = {
    'Active': 'ACTIVO',
    'Suspended': 'SUSPENDIDO'
  }

  useEffect(() => {
    GetAllUserAdmin(setIsRefresh, itemPerPageState, pageNumberState, searchState, isSort);
  }, [show, show2, isRefresh, searchState, itemPerPageState, pageNumberState, isSort]);
  
  const seeMoreProvinces = (user) => {    
    Swal.fire({
      title: `Listado de provincias del usuario ${user.name}`,
      html: `<ul>${user.provinces?.map(province => `<li class='color-primary' key=${province.provinceId}>${province.name}</li>`).join('')}</ul>`,
      icon: "info"
    });
  };

  const handleDeleteUser = (userId) => {
    Swal.fire({
      title: "Eliminar usuario",
      html: `<p>Estás eliminando al usuario con el <span style="color: var(--primary);">ID ${userId}</span>, de forma permanente. <br /> <br /> <span class='fw-bold color-primary'>¿Deseas continuar?</span></p>`,
      icon: "question",
      iconColor: 'var(--primary)',
      showCancelButton: true,
      cancelButtonColor: "var(--primary)",
      confirmButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteUserAdmin(userId);        
      }
    });
  };

  const getUserByIdHandle = (id) =>{
    GetUserByIdAdmin(id);
  }

  const handlePageChange = selectedPage => {
    setPageNumberState(selectedPage.selected);
  };

  const searchUsers = (data) => {
    if(data.searchOption?.length <= 0){
      return Swal.fire({
        icon: 'error',
        title: 'Selecciona una opción',
        text: 'Debes seleccionar una opción en el filtrado de busqueda',
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
    "Limitante",
    "Rol",
    "Creado",
  ]
  
  const rowDetail = row => [
    row.administratorId,
    row.name,
    row.email,
    status[row.status],
    row.provinces.map(province => province.name).join(", ") || "GENERAL",
    roles[row.rol],
    format(parseISO(row.registerDate), 'dd/MM/yyyy'),
  ]

  return (
    <>
      {rol == 'Super' || rol == 'Admin' ? (
        <section className='usersAdmin'>
        <div className="usersAdmin__content container">
          <h5 className="title__panel mb-3">USUARIOS ADMIN</h5>
          <div className="usersAdmin__body">
            <div className="usersAdmin__btn-top">
              <h6 className="color-primary fw-bold">Usuarios</h6>
              <div className='notification__header__csv'>
                <div className='btn-generators'>
                  <GeneratorCSV data={getAllUserAdministration} name={"Administradores"} title={title} rowDetail={rowDetail}/>
                  <GeneratorExcel data={getAllUserAdministration} name={"Administradores"} titles={title} rowDetail={rowDetail}/>
                </div>
                {
                  rol == 'Super' ? (
                    <ModalButton handleShow={handleShow} text={'Crear usuarios'}/>
                  ) : (
                    null
                  )
                }
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
                  <select className='px-2' {...register('searchOption')}>
                    <option value="">Buscar por</option>
                    <option value="1">Nombre</option>
                    <option value="2">Correo</option>
                  </select>
                </div>
                <div className='d-flex gap-2 align-items-center'>                
                  <input className='px-2' type="text" placeholder='Buscar' {...register('searchValue')}/>
                </div>
                <div>
                  <button className="btn btn-primary">Buscar</button>
                </div>
              </div>
            </form>
          </div>
            {
              getAllUserAdministration.length <= 0 ? (
                <p>No hay usuarios</p>
              ) : (
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
                        <th>Limitante</th>
                        <th>Rol</th>
                        <th>Creado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getAllUserAdministration?.map((users, index) => (
                        <tr className={index % 2 === 0 ? 'odd' : 'even'} key={index}>
                          <th className='fw-normal'>{users.administratorId}</th>
                          <th className='fw-normal'>{users.name}</th>
                          <th className='fw-normal'>{users.email}</th>
                          <th className='fw-normal'>{status[users.status]}</th>
                          <th className='fw-normal'>{users.provinces.length > 0 ? (<><span>{users.provinces[0].name}</span> <br /> {users.provinces.length > 1 ? <small className='text-center cursor-pointer color-primary' title={users.provinces?.map(province => province.name)} onClick={() =>seeMoreProvinces(users)}>Ver más</small> : '' }</>): 'GENERAL'}</th>
                          <th className='fw-normal'>{roles[users.rol]}</th>
                          <th className='fw-normal'>{users.registerDate && isValid(parseISO(users.registerDate)) ? format(parseISO(users.registerDate), 'dd/MM/yyyy') : 'Invalid Date'}</th>
                          <th className='dtr-none'>
                            <span className='d-flex gap-3 '>
                              <span onClick={() => {
                                handleShow2(users.administratorId);
                                getUserByIdHandle(users.administratorId);
                                }}>
                                <SVGedit/>
                              </span>
                              <span className='cursor-pointer'>
                                <img className='delete' src={closeSVG} onClick={() => handleDeleteUser(users.administratorId)} alt="Eliminar" title='Eliminar'/>
                              </span>
                            </span>
                          </th>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>
              )
            }
          <div className='personalized-table-pagination'>
            <PaginateComponent paginationData={getPagination} handlePageChange={handlePageChange} />
          </div>
          </div>
        </div>
        {
          rol == 'Super' ? (
            <UserCreateModal  dataTableInstan={dataTableInstance} handleClose={handleClose} show={show} setIsRefresh={setIsRefresh}/>
          ) : (
            null
          )
        }
        <UserEditModal dataTableInstan={dataTableInstance} handleClose={handleClose2} show={show2} getUser={getUserByIdState} handleShow={handleShow2}/>
      </section>
      ) : (
        null
      )
    }
    </>
  );
}


export default AdminUsers;
