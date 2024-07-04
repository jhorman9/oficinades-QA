import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { setIsLoading } from '../store/slice/isLoading.slice';
import { useDispatch } from 'react-redux';
import getConfig from '../assets/components/utils/getConfig';

const useUsers = () => {

    const [ getAllUserAdministration, setGetAllUserAdministration] = useState([]);
    const [ getUserByIdState, setGetUserByIdState] = useState({});
    const [ getUserByToken, setGetUserByToken ] = useState([]);
    let [ getPagination, setGetPagination] = useState({});

    const dispatch = useDispatch();
    
    const GetAllUserAdmin = (setIsRefresh, itemPerPageState, pageNumberState, searchState, isSort) => {
        dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/management/GetAllUsers?pageSize=${itemPerPageState}&pageNumber=${pageNumberState + 1 || 1}${searchState && searchState.searchOption && searchState.searchValue ? `&type=${searchState.searchOption}&value=${searchState.searchValue}` : ''}&orderType=${isSort}`, getConfig())
        .then((res) => {
            setGetPagination(JSON.parse(res.headers['paginations']));
            setGetAllUserAdministration(res.data);
            setTimeout(() => {
                dispatch(setIsLoading(false));
            }, [1000])
        })
        .catch((err) => {
            dispatch(setIsLoading(false));
            // deleteCredentials();
        })
    };

    const CreateUserAdmin = (administrator, setIsRefresh, handleClose) => {
        dispatch(setIsLoading(true));
        axios.post(`${import.meta.env.VITE_APP_API_URL}/management/CreateUpdateUser`, {administrator: administrator}, getConfig())
        .then((res) => {
            dispatch(setIsLoading(false));
            setIsRefresh(true);
            handleClose();
            Swal.fire({
                icon: 'success',
                title: 'Usuario creado',
                text: 'El usuario ha sido creado con éxito',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
              })

        })
        .catch((err) => {
            dispatch(setIsLoading(false));
            // deleteCredentials();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data.message || 'Algo salió mal',
                confirmButtonColor: 'var(--primary)',
              });

              if(err.response?.status === 401){
                localStorage.clear();
                window.location.href = '/';
            }
        })
    };
    
    const DeleteUserAdmin = (administratorId) => {
        dispatch(setIsLoading(true));
        axios.delete(`${import.meta.env.VITE_APP_API_URL}/management/DeleteUser/${administratorId}`, getConfig())
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
                text: err.response?.data.message || 'Algo salió mal',
                confirmButtonColor: 'var(--primary)',
              });
        })
    };

    const UpdateUserAdmin = (administrator, handleClose) => {
        dispatch(setIsLoading(true));
        axios.post(`${import.meta.env.VITE_APP_API_URL}/management/CreateUpdateUser`, { administrator },  getConfig())
        .then((res) => {
            dispatch(setIsLoading(false));
            handleClose();
            Swal.fire({
                icon: 'success',
                title: 'Usuario actualizado',
                text: 'El usuario ha sido actualizado con éxito',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
              })
        })
        .catch((err) => {
            dispatch(setIsLoading(false));
            // deleteCredentials();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data.message || 'Algo salió mal',
                confirmButtonColor: 'var(--primary)',
              });
        })
    };

    const GetUserByIdAdmin = (id) => {
        dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/management/GetUserById/${id}`,  getConfig())
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
                confirmButtonColor: 'var(--primary)',
              });
        })
    };

    const GetUserByToken = () => {
        dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/customer/GetCurrentCustomer`, getConfig())
        .then((res) => {
            dispatch(setIsLoading(false));
            setGetUserByToken(res.data);
        })
        .catch((err) => {
            dispatch(setIsLoading(false));
        })
    };
    
    return { GetAllUserAdmin, getAllUserAdministration, CreateUserAdmin, DeleteUserAdmin, UpdateUserAdmin, GetUserByIdAdmin, getUserByIdState, getUserByToken, GetUserByToken, getPagination };
};

export default useUsers;