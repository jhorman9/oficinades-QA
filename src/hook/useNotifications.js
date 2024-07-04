import React, { useState } from 'react'
import getConfig from '../assets/components/utils/getConfig';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoading } from '../store/slice/isLoading.slice';
import Swal from 'sweetalert2';
import deleteCredentials from '../assets/components/utils/deleteCredentials';

const useNotifications = () => {

    const [notificationsCustomers, setNotificationsCustomers] = useState();
    const [notificationById, setNotificationById] = useState();
    const [getNotificationAdmin, setGetNotificationAdmin] = useState();
    const [getNotificationByIdStateAdmin, setGetNotificationByIdStateAdmin] = useState();
    const [getCustomersNotifications, setCustomersNotifications] = useState([]);
    let [isChanged, setIsChanged] = useState(0);
    const rol = useSelector(state=> state?.getRol);
    const [ getPagination, setGetPagination] = useState({});

    const dispatch = useDispatch();
    
    const GetNotificationsByUser = () => {
        dispatch(setIsLoading(true));
          axios.get(`${import.meta.env.VITE_APP_API_URL}/notification/GetNotificationsByUser`, getConfig())
          .then((res) => {
              setNotificationsCustomers(res.data);
              dispatch(setIsLoading(false))
          })
          .catch((err) => {
              dispatch(setIsLoading(false));
              rol == 'Customer' && (
                deleteCredentials()
              )
          })
      }

    const GetNotificationById = (notificationID) => {
        dispatch(setIsLoading(true));
          axios.get(`${import.meta.env.VITE_APP_API_URL}/notification/GetNotification/${notificationID}`, getConfig())
          .then((res) => {
              dispatch(setIsLoading(false))
              setNotificationById(res.data);
              res.data.isRead = false;
          })
          .catch((err) => {
              dispatch(setIsLoading(false));
              rol == 'Customer' && (
                deleteCredentials()
              )
          })
      }

      const DeleteUserNotification = (id) => {
        dispatch(setIsLoading(true));
          axios.delete(`${import.meta.env.VITE_APP_API_URL}/notification/DeleteUserNotification/${id}`, getConfig())
          .then((res) => {
              Swal.fire({
                  icon: 'success',
                  title: 'Notificación eliminada',
                  text: 'La notificación ha sido eliminada con éxito',
                  timer: 2000,
                  timerProgressBar: true,
                  showConfirmButton: false,
                })
                dispatch(setIsLoading(false));
                setTimeout(() => {
                    window.location.reload();
                }, 2001)
          })
          .catch((err) => {
              dispatch(setIsLoading(false));
              rol == 'Customer' && (
                deleteCredentials()
              )
          })
      }

      //To admin

      const CreateNotificationAdmin = (data) => {
        dispatch(setIsLoading(true));
        const formData = new FormData();

        formData.append('ToAllBase', data.ToAllBase);
        formData.append('Subject', data.Subject);
        formData.append('ContentBody', data.ContentBody);
      
        if (data.DocumentsDatas && Array.isArray(data.DocumentsDatas)) {
          for (const file of data.DocumentsDatas) {
            formData.append('DocumentsDatas', file);
          }
        }
      
        if (data.ToUsers && Array.isArray(data.ToUsers)) {
          for (const user of data.ToUsers) {
            formData.append('ToUsers', user);
          }
        }
      
        axios({
          method: 'post',
          url: `${import.meta.env.VITE_APP_API_URL}/notification/CreateNotification`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
          .then((res) => {
            Swal.fire({
              icon: 'success',
              title: 'Notificación creada',
              text: 'La notificación se encuentra en estatus En Edición, una vez esté lista para enviar cambia el estatus a Aprobado.',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
            })
            dispatch(setIsLoading(false));
            setTimeout(() => {
              window.location.reload();
            }, 2001);
          })
          .catch(err => {
            dispatch(setIsLoading(false));
          });
      }

      const updateNotificationAdmin = (data, handleClose2) => {
        
        dispatch(setIsLoading(true));
        const formData = new FormData();
      
        if (data.ToUsers && Array.isArray(data.ToUsers)) {
          for (const user of data.ToUsers) {
            formData.append('ToUsers', user);
          }
        }

        formData.append('ToAllBase', data.ToAllBase);
        formData.append('Subject', data.Subject);
        formData.append('ContentBody', data.ContentBody);

        if (data.DocumentsDatas && Array.isArray(data.DocumentsDatas)) {
          for (const file of data.DocumentsDatas) {
            formData.append('DocumentsDatas', file);
          }
        }

        if (data.DocumentsDatasDelete && Array.isArray(data.DocumentsDatasDelete)) {
          for (const toDelete of data.DocumentsDatasDelete) {
            formData.append('DocumentsDatasDelete', toDelete);
          }
        }

        formData.append('NotificationId', data.NotificationId);
      
        axios({
          method: 'post',
          url: `${import.meta.env.VITE_APP_API_URL}/notification/UpdateNotification`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
          .then((res) => {
            handleClose2();
            Swal.fire({
              icon: 'success',
              title: 'Cambios guardados',
              text: 'La notificación ha sido actualizada con éxito',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
            })
            dispatch(setIsLoading(false));
          })
          .catch(error => {
            dispatch(setIsLoading(false));
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data.message || error.response?.data || 'Algo salió mal',
                confirmButtonColor: 'var(--primary)',
            });
          });
      }

      const GetNotificationAdmin = (pageNumberState, itemPerPageState, searchState, isSort) => {
        dispatch(setIsLoading(true));
          axios.get(`${import.meta.env.VITE_APP_API_URL}/notification/GetNotifications?pageSize=${itemPerPageState}&pageNumber=${pageNumberState + 1}&typeNotification=${searchState?.searchOption || 0}&toNotification=${searchState?.searchValue || ''}&orderType=${isSort}`, getConfig())
          .then((res) => {
            setGetPagination(JSON.parse(res.headers['paginations']));
              setGetNotificationAdmin(res.data);
              setTimeout(() => {
                dispatch(setIsLoading(false));
            }, [1000])
          })
          .catch((error) => {
              dispatch(setIsLoading(false));
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data.message || error.response?.data || 'Algo salió mal',
                confirmButtonColor: 'var(--primary)',
              });
          })
      }
    
      const DeleteNotificationAdmin = (id) => {
        dispatch(setIsLoading(true));
          axios.delete(`${import.meta.env.VITE_APP_API_URL}/notification/DeleteNotification/${id}`, getConfig())
          .then((res) => {
              Swal.fire({
                  icon: 'success',
                  title: 'Notificación eliminada',
                  text: 'La notificación ha sido eliminada con éxito',
                  timer: 2000,
                  timerProgressBar: true,
                  showConfirmButton: false,
                })
                dispatch(setIsLoading(false));
                setTimeout(() => {
                    window.location.reload();
                }, 2001)
          })
          .catch((error) => {
              dispatch(setIsLoading(false));
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data.message || error.response?.data || 'Algo salió mal',
                confirmButtonColor: 'var(--primary)',
              });
          })
      }

      const GetNotificationByIdAdmin = (id) => {
        dispatch(setIsLoading(true));
          axios.get(`${import.meta.env.VITE_APP_API_URL}/notification/GetNotification/${id}`, getConfig())
          .then((res) => {
            setGetNotificationByIdStateAdmin(res.data);
            dispatch(setIsLoading(false));
          })
          .catch((error) => {
              dispatch(setIsLoading(false));
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data.message || error.response?.data || 'Algo salió mal',
                confirmButtonColor: 'var(--primary)',
              });
          })
      }

      const GetCustomerForNotification = async (word) => {
        dispatch(setIsLoading(true));
        try {
          const result = await axios.get(`${import.meta.env.VITE_APP_API_URL}/notification/GetCustomerForNotification/${word}`, getConfig());
          dispatch(setIsLoading(false));
          return result.data;
        } catch (error) {
          dispatch(setIsLoading(false));
          rol == 'Customer' && (
            deleteCredentials()
          )
        }
      };

      const EnableNotificationAdmin = (data) => {
        dispatch(setIsLoading(true));
          axios.post(`${import.meta.env.VITE_APP_API_URL}/notification/SendNotification`, {NotificationId: data}, getConfig())
          .then((res) => {
            dispatch(setIsLoading(false));
            setIsChanged(++isChanged);
          })
          .catch((err) => {
              dispatch(setIsLoading(false));
              // deleteCredentials();
          })
      }


      return { 
        GetNotificationsByUser, notificationsCustomers, 
        GetNotificationById, notificationById, 
        DeleteUserNotification, CreateNotificationAdmin, 
        GetNotificationAdmin, getNotificationAdmin, 
        DeleteNotificationAdmin, GetNotificationByIdAdmin, 
        getNotificationByIdStateAdmin, getCustomersNotifications, 
        notificationsCustomers, GetCustomerForNotification, updateNotificationAdmin,
        EnableNotificationAdmin, isChanged, getPagination
      };

}

export default useNotifications;