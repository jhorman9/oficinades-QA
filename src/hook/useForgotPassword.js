import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import {setIsLoading} from "../store/slice/isLoading.slice";
import {setIsToken} from "../store/slice/isToken.slice";

const useForgotPassword = () => {
  
  const dispatch = useDispatch();
  const sendEmail = (data, reset, isInfo, navigate) => {

    if(isInfo){
      dispatch(setIsLoading(true));
      const url = `${import.meta.env.VITE_APP_API_URL}/Account/forgotPassword`;
      axios.post(url, data)
      .then((res) => {
        dispatch(setIsLoading(false))
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Hemos enviado un correo para cambiar su contraseña',
        })

        navigate('/');
        reset();
      })
      .catch((err) => {
        if(err.response?.data?.message == 'Email invalido, validar!') {
          Swal.fire({
            icon: 'error',
            title: 'Email inválido',
            text: 'El correo electrónico que ha ingresado es inválido. Por favor, proceda a validar la información proporcionada',
          })
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo salió mal',
          })
        }
          dispatch(setIsLoading(false));
      })
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Darle click al recapcha',
      })
    }
  }

  const isValidToken = (email, token) => {
    dispatch(setIsLoading(true))
    axios.post(`${import.meta.env.VITE_APP_API_URL}/Account/confirmPasswordReset`, { Email: email, Token:token })
    .then((res) => {
      dispatch(setIsToken(true))
      dispatch(setIsLoading(false))
    })
    .catch((err) =>{
      dispatch(setIsToken(false))
      dispatch(setIsLoading(false))
    })
  }

  const resetPasswordHook = (data, navigate, reset, email, token ) => {
    dispatch(setIsLoading(true));
    const { NewPassword } = data;
      axios.post(`${import.meta.env.VITE_APP_API_URL}/Account/changePassword`, { email, token, NewPassword })
      .then(res => {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña cambiada',
          text: 'Su contraseña se ha cambiado exitosamente',
        })
        reset();
        navigate('/');
        dispatch(setIsLoading(false))
      })
      .catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo salió mal',
          })
          dispatch(setIsLoading(false))
      });

  };

  return { sendEmail, isValidToken, resetPasswordHook };
}

export default useForgotPassword;