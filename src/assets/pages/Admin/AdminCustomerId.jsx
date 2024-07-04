import React, { useEffect, useState } from 'react'
import SVGArrowRight from '../../images/icons/SVGArrowRight';
import { useNavigate, useParams } from 'react-router-dom';
import useFormattedDate from '../../components/useFormattedDate';
import useCustomer from '../../../hook/useCustomer';
import '../../styles/Admin/AdminCustomer.css';
import Swal from 'sweetalert2';
import NicCodesBox from '../../components/AdminComponents/NicCodesBox';

const AdminCustomerId = () => {

  const { GetUserByIdCustomer, getUserByIdState, DeleteUserCustomer } =  useCustomer();
  const [isRefresh, setIsRefresh] = useState(false);

  const { customerId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    GetUserByIdCustomer(customerId);
  },[customerId, isRefresh])

  const backToClaim = () => {
    navigate(`/admin/customer`);
  }

  const abreviattedName = () => {
    if(getUserByIdState){
        const nameSplitted = getUserByIdState.name?.split(' ');
        const nameAbreviatted = nameSplitted?.[0][0];
        const cocatName = nameAbreviatted;
        return cocatName;
    }
  }

  const handleDeleteUser = (user) => {
    Swal.fire({
      title: "Eliminar cliente",
      html: `<p>Desea eliminar al usuario <span style="color: var(--primary);">${user.name}</span>? <br /> <br /> <span class='fw-bold color-primary'>¿Desea continuar?</span></p>`,
      icon: "question",
      iconColor: 'var(--primary)',
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText:'Cancelar',
      cancelButtonColor: "var(--primary)",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteUserCustomer(user.customerId);
        navigate('/admin/customer');
      }
    });
  };

  return (
    <section className='admin__customer notification container'>
    <div className="notification__content">
      <div className="btn-back mb-3" onClick={backToClaim}>
          <SVGArrowRight />
          <span className='color-primary ms-2'>Volver</span>
      </div>
    </div>
    <div className='admin__customer__container'>
        <div className='customer__profile'>
            <div className="custom__profile__header">
                <div className="customer__name__image">
                    <div className='customer__rounded__letter'>
                        <p className='mb-0'>{abreviattedName()}</p>
                    </div>
                    <div className='customer__name'>
                        <h5 className='mb-1'>{getUserByIdState.name}</h5>
                        <div className='d-flex align-items-center gap-1'>
                            <div className='isActived-rounded' style={getUserByIdState?.status === 'Active' ? {background: 'green'} : getUserByIdState?.status === 'Pending' ? {background: 'yellow'} : {background: 'red'}}></div>
                            <p className='mb-0' style={getUserByIdState?.status == 'Active' ? { color: 'green' } : getUserByIdState?.status === 'Pending' ? {color: 'yellow'} : {color: 'red'}}>{getUserByIdState?.status == 'Active' ? 'Habilitado' : getUserByIdState?.status === 'Pending' ? 'Pendiente' : 'Deshabilitado' }</p>
                        </div>
                    </div>
                </div>
                <div className='customer__date__register'>
                    <p className='mb-0'>{useFormattedDate(getUserByIdState.registerDate)}</p>
                    <button className='btn btn-danger' onClick={() => handleDeleteUser(getUserByIdState)}>Eliminar usuario</button>
                </div>
            </div>
            <div className="customer__body">
                <div>
                    <div className='customer__contract'>
                        <ul style={{ gridTemplateColumns: getUserByIdState.nicCodes?.length <= 3 ? 'repeat(3, 275px)' : 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                            {
                                getUserByIdState.nicCodes?.map((nic, index) => (
                                    <NicCodesBox key={index} nic={nic} setIsRefresh={setIsRefresh}/>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </section>
  )
} 

export default AdminCustomerId;