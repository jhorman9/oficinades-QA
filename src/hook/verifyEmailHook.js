import axios from "axios";
import React from 'react'
import { useDispatch } from "react-redux";
import { setIsLoading } from "../store/slice/isLoading.slice";
import Swal from "sweetalert2";
import { useState } from "react";

const verifyEmailHook = () => {

    const [isVerified, setIsVerified] = useState();

    const dispatch = useDispatch();

    const validateEmail = (token, email, navigate) => {

        dispatch(setIsLoading(true));
            axios.post(`${import.meta.env.VITE_APP_API_URL}/Account/verifyEmail`, { token, email } )
            .then((res) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Correo verificado exitosamente',
                    confirmButtonColor: 'var(--primary)',
                });
                navigate('/');
                setIsVerified(true);    
            })
            .catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: err.response?.data.message || 'Algo salio mal',
                    confirmButtonColor: 'var(--primary)',
                });
                setIsVerified(false);
            })
            .finally(() => {
                dispatch(setIsLoading(false));
            })
        }

    const resendEmail = (email) => {

        dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/Account/resendEmailConfirmationLink/?email=${email}`)
        .then((res) => {
            Swal.fire({
                icon: 'success',
                title: 'Correo enviado',
                text: 'Hemos enviado un correo de confirmacion de su direccion de correo electronico, por favor verifique en su bandeja y siga los paso indicado en el mismo',
                confirmButtonColor: 'var(--primary)',
            });
        })
        .catch((err) => {
            Swal.fire({
                icon: 'error',
                title: 'Token expirado',
                confirmButtonColor: 'var(--primary)',
                });
        })
        .finally(() => {
            dispatch(setIsLoading(false));
        })

    }

    return { validateEmail, resendEmail, isVerified };

}

export default verifyEmailHook;