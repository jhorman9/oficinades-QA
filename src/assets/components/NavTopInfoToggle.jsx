import React, { useEffect, useState } from 'react'
import iconNotifications from '../images/icons/icon _notification.svg';
import logoutSvg from '../images/icons/logout.svg';
import { Dropdown, DropdownButton, Nav } from 'react-bootstrap';
import '../styles/NavTopInfoToggle.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import deleteCredentials from './utils/deleteCredentials';
import abreviattedName from './utils/abreviattedName';
import { useDispatch, useSelector } from 'react-redux';
import useNotifications from '../../hook/useNotifications';
import * as signalR from '@microsoft/signalr';
import Swal from 'sweetalert2';
import useUsers from '../../hook/useUsers';
import { qtyNotificationState } from '../../store/slice/qtyNotification';

const NavTopInfoToggle = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const rol = useSelector(state => state.getRol);
    const { GetNotificationsByUser, notificationsCustomers } = useNotifications();
    const { GetUserByToken, getUserByToken } = useUsers();
    const [isChangeNotification, setIsChangeNotification] = useState(0);
    const dispatch = useDispatch();

    const { id, notificationID } = useParams();
    const handleLogout = () => {
        deleteCredentials();
        navigate('/');
    }

    const name = localStorage.getItem('name');
    if(name){
      abreviattedName(name);
    }

    useEffect(() => {
      rol == 'Customer' && (
        GetUserByToken()
      );
    },[]);

    let isReadFiltered = notificationsCustomers?.filter(notification => notification.isRead === false);

    useEffect(() => {
      if(rol == 'Customer') GetNotificationsByUser();
    },[location.pathname, isChangeNotification, notificationID]);

    useEffect(() => {
      if(isReadFiltered){
        dispatch(qtyNotificationState(isReadFiltered.length));
      }
    },[isChangeNotification, isReadFiltered, notificationsCustomers]);

    useEffect(() => {
      if(rol == 'Customer'){
        const connection = new signalR.HubConnectionBuilder()
          .withUrl(`http://oficinades.idaan.gob.pa:5001/changeNotification`)
          .configureLogging(signalR.LogLevel.Information)
          .build();
    
        connection.start().then(() => {
        });
    
        connection.on('BroadcasNotificationData', (message) => {
          if(message == getUserByToken.email || message == 'all'){
            setIsChangeNotification(prevCount => prevCount + 1);
            rol == 'Customer' && localStorage.setItem('qtyNotification', isChangeNotification);
          }
         });
    
        return () => {
          connection.stop().then(() => {
          });
        };
      }
    }, [isChangeNotification, getUserByToken]);

    useEffect(() => {
      if(isChangeNotification !==  0 && rol == 'Customer'){
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "info",
          iconColor: '#006491',
          title: "Te ha llegado una nueva notificación",
        });
      }
     },[isChangeNotification]);

     const handleNavigate = () => {
      if(id){
        navigate(`/panel/${id}/cards`);
      }
     };

  return (
        <nav className='nav__info__toggle'>
          {
            rol == 'Customer' ? (
            <Link to={id ? `panel/${id}/notification`: '/choose-nic'} className='nav-bar_icon__notification h-100'>
              <div className="icon__item">
                  <img src={iconNotifications} alt='Icono de notificación'/>
                  <p className="nav-bar__quantity mb-0">
                  <span className="nav-bar__quantity__number mb-0">{(isReadFiltered?.length)}</span>
                  </p>
              </div>
            </Link> 
            ):(
              null
            )
          }
          <Link>
            <DropdownButton
                key={'down-centered'}
                drop={'down-centered'}
                title={name ? localStorage.getItem('abreviation') : ''}
                className='nav__profile__user mb-0'>
              <Dropdown.Item as={Link} to={rol == 'Super' || rol == 'Admin' || rol == 'Assistant' ? `admin/profile` : (id ? `panel/${id}/profile` : null)}>Mis datos</Dropdown.Item>
              <Dropdown.Divider />
              {
                rol == 'Customer' && (
                  <>
                  <Dropdown.Item eventKey="2" onClick={handleNavigate}>
                    Mis tarjetas
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  </>
                )
              }
              <Dropdown.Item eventKey="3" className='dropRed' onClick={handleLogout}>
                <img src={logoutSvg} alt="Botón para cerrar sesión" className='me-2' />
                Cerrar sesión
              </Dropdown.Item>
            </DropdownButton>
          </Link> 
        </nav>
  )
}

export default NavTopInfoToggle;