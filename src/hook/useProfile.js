import React, { useState } from 'react'
import { setIsLoading } from '../store/slice/isLoading.slice';
import axios from 'axios';
import getConfig from '../assets/components/utils/getConfig';
import Swal from 'sweetalert2';
import abreviattedName from '../assets/components/utils/abreviattedName';
import deleteCredentials from '../assets/components/utils/deleteCredentials';
import { useSelector } from 'react-redux';

const useProfile = () => {

    const [profileInfo, setProfileInfo] = useState({});
    const [profileAdminInfo, setProfileAdminInfo] = useState({});
    const rol = useSelector(state=> state?.getRol);
  
    const updateProfile = (data, reset) => {
        if(data.NewPassword === ''){
            data.NewPassword = null;
        }
        setIsLoading(true);
        axios.post(`${import.meta.env.VITE_APP_API_URL}/customer/UpdateCustomerProfile`, {Customer:data}, getConfig())
        .then(res => {
            Swal.fire({
                icon: 'success',
                title: 'Datos cambiados',
                text: 'Los datos han sido cambiados exitosamente',
                confirmButtonColor: 'var(--primary)',
              });
            abreviattedName(data.DocumentName);
            localStorage.setItem('name', data.DocumentName);
        })
        .catch(err => {
            if(err.response?.data.message == 'Ya existe una cuenta con ese correo electrónico!, validar') {
                Swal.fire({
                    icon: 'error',
                    title: 'Correo ya registrado',
                    text: 'Se ha detectado que ya existe una cuenta asociada a este correo electrónico. Por favor, proporcione un correo electrónico diferente',
                    confirmButtonColor: 'var(--primary)',
                  });
            }else{
                Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Algo salió mal',
                confirmButtonColor: 'var(--primary)',
              });
              rol == 'Customer' && (
                deleteCredentials()
              )
            }
        })
        .finally(setIsLoading(false))
    };

    const UpdateAdminProfile = (data) => {
        setIsLoading(true);
        axios.post(`${import.meta.env.VITE_APP_API_URL}/admins/UpdateCurrentAdministratorProfile`, {Administrator:data}, getConfig())
        .then(res => {
            Swal.fire({
                icon: 'success',
                title: 'Datos cambiados',
                text: 'Los datos han sido cambiados exitosamente',
                confirmButtonColor: 'var(--primary)',
              });
            abreviattedName(data.Name);
            localStorage.setItem('name', data.Name);
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Algo salió mal',
                confirmButtonColor: 'var(--primary)',
              });
              rol == 'Customer' && (
                deleteCredentials()
              )
        })
        .finally(setIsLoading(false))
    };

    const GetProfile = () => {
        setIsLoading(true);
        axios.get(`${import.meta.env.VITE_APP_API_URL}/customer/GetCurrentCustomer`, getConfig())
        .then(res => {
            setProfileInfo(res.data)
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Algo salió mal',
                confirmButtonColor: 'var(--primary)',
              });
        })
        .finally(setIsLoading(false))
    };

    const GetProfileAdmin = () => {
        setIsLoading(true);
        axios.get(`${import.meta.env.VITE_APP_API_URL}/management/GetCurrentUser`, getConfig())
        .then(res => {
            setProfileAdminInfo(res.data)
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Algo salió mal',
                confirmButtonColor: 'var(--primary)',
              });
        })
        .finally(setIsLoading(false))
    };

    const DeleteByProfileUser = () => {
        setIsLoading(true);
        axios.delete(`${import.meta.env.VITE_APP_API_URL}/customer/DeleteCurrentCustomer`, getConfig())
        .then(res => {
            Swal.fire({
                icon: 'success',
                title: 'Usuario eliminado',
                text: 'Usuario eliminado exitosamente',
                confirmButtonColor: 'var(--primary)',
              });
            localStorage.clear();
            navigate('/');
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data.message || err.response?.data || 'Algo salió mal',
                confirmButtonColor: 'var(--primary)',
              });
        })
        .finally(setIsLoading(false))
    };

    return { updateProfile, GetProfile, GetProfileAdmin, profileInfo, profileAdminInfo, UpdateAdminProfile, DeleteByProfileUser };

}

export default useProfile