import axios from 'axios';
import React from 'react';
import Swal from 'sweetalert2';
import { setIsLoading } from '../store/slice/isLoading.slice';
import { useDispatch } from 'react-redux';
import { getRol } from '../store/slice/rol.slice';
import abreviattedName from '../assets/components/utils/abreviattedName';
import deleteCredentials from '../assets/components/utils/deleteCredentials';

const useAuth = () => {
    
    const dispatch = useDispatch();

    const createUser = (data, navigate, reset, isInfo) => {
        delete data.Password2;
        dispatch(setIsLoading(true));
        if (isInfo) {
          axios.post(`${import.meta.env.VITE_APP_API_URL}/Account/Register`, data)
            .then((res) => {
              navigate('/');
              Swal.fire({
                icon: 'success',
                title: 'Registro existoso',
                text: 'Su registro se ha completado con éxito. En breve, recibirá un correo con un enlace de confirmación. Por favor, haga clic en el enlace para verificar y confirmar su cuenta.',
              });
            })
            .catch((error) => {
              if(error.response?.data.message == 'Ya hay una cuenta registrada con este correo electronico'){
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Ya hay una cuenta registrada con este correo electronico',
                });
              }else if(error.response?.data.message.includes('ya fue registrado previamente para otro usuario, validar')){
                Swal.fire({
                  icon: 'error',
                  title: 'Contrato NIC no disponible',
                  text: 'El contrato NIC que ha proporcionado ya ha sido registrado para otro usuario',
                });
              }
              else{
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Algo salió mal',
                });
              }
            })
            .finally(() => {
              dispatch(setIsLoading(false));
            });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Falta completar el reCAPTCHA',
          });
          dispatch(setIsLoading(false));
        }
      };

    const loginUser = (data, navigate, reset, resendEmail) => {
      dispatch(setIsLoading(true));
        axios.post(`${import.meta.env.VITE_APP_API_URL}/Account/login`, data)
        .then((res) => {
            dispatch(setIsLoading(true));
            dispatch(getRol(res.data.userRol));
            localStorage.setItem("token", res.data.token);
            localStorage.setItem('name', res.data.displayName);
            abreviattedName(res.data.displayName);
            if(res.data.userRol === 'Customer'){
              navigate('/choose-nic');
            }

            if(res.data.userRol === 'Super' || res.data.userRol === 'Admin' || res.data.userRol === 'Assistant'){
              navigate('/admin/home');
            }
            reset();
        })
        .catch((error) => {
            if(error.response?.status === 401){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Credenciales incorrectas',
                  })
            }else if(error.response?.data?.message == 'El correo electrónico no ha sido confirmado') {
              Swal.fire({
                title: 'Correo no confirmado',
                text: 'Su correo electrónico no ha sido confirmado desea enviar la confirmación?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Obtener Confirmación',
              }).then((result) => {
                if (result.isConfirmed) {
                  resendEmail(data.email);
                }
              })
            }else if(error.response?.data?.message == 'Email y/o contraseña inválidos'){
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Email y/o contraseña inválidos',
            })
            }else if(error.response?.data?.message.includes('Por su seguridad hemos enviado un correo a su dirección')){
              Swal.fire({
                icon: 'info',
                iconColor: '#006491',
                title: 'Hemos enviado un correo',
                text: 'Por su seguridad hemos enviado un correo a su correo electronico para su confirmación',
            })
            }else{
              deleteCredentials();
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal',
                })
            }
        })
        .finally(() => {
            dispatch(setIsLoading(false));
          });    
        };

    const isAuth = (token) => {

    }
    

    return {createUser, loginUser, isAuth};
};

export default useAuth;