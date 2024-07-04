import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { setIsLoading } from '../store/slice/isLoading.slice';
import { useDispatch } from 'react-redux';
import getConfig from '../assets/components/utils/getConfig';

const useCustomer = () => {

    const [ getAllUser, setGetAllUser] = useState([]);
    const [ getUserByIdState, setGetUserByIdState] = useState({});
    const [ getPagination, setGetPagination] = useState({});

    const dispatch = useDispatch();
    
    const GetAllUserCustomer = (itemPerPageState, pageNumberState, searchState, isSort) => {
        dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/management/GetAllCustomers?pageSize=${itemPerPageState}&pageNumber=${pageNumberState + 1}&type=${searchState?.searchOption || 0}&search=${searchState?.searchValue || "''"}&orderType=${isSort}`, getConfig())
          .then((res) => {
            setGetPagination(JSON.parse(res.headers['paginations']));
            setGetAllUser(res.data);
            setTimeout(() => {
              dispatch(setIsLoading(false));
            }, 1000);
          })
          .catch((err) => {
            dispatch(setIsLoading(false));
            // Manejo de errores, por ejemplo, deleteCredentials();
          });
      };
    
    const DeleteUserCustomer = (customerId) => {
        dispatch(setIsLoading(true));
        axios.delete(`${import.meta.env.VITE_APP_API_URL}/management/DeleteCustomer/${customerId}`, getConfig())
        .then((res) => {
            dispatch(setIsLoading(false));
            Swal.fire({
                icon: 'success',
                title: 'Usuario eliminado',
                text: 'El usuario ha sido eliminado con éxito',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
              })
               setTimeout(() => {
                 window.location.reload();
             }, 2001)
        })
        .catch((err) => {
            dispatch(setIsLoading(false));
            // deleteCredentials();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.res?.data.message || 'Algo salió mal',
              });
        })
    };

    const GetUserByIdCustomer = (id) => {
        dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/management/GetCustomerById/${id}`, getConfig())
        .then((res) => {
            dispatch(setIsLoading(false));
            setGetUserByIdState(res.data);
        })
        .catch((err) => {
            dispatch(setIsLoading(false));
            // deleteCredentials();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data.message || 'Algo salió mal',
              });
        })
    };
    
    return { GetAllUserCustomer, getAllUser, DeleteUserCustomer, GetUserByIdCustomer, getUserByIdState, getPagination}
}

export default useCustomer;