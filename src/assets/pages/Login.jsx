import React, { useEffect, useState } from 'react';
import eyeOnSvg from '../images/icons/eye-show.svg';
import eyeOffSvg from '../images/icons/eye-off.svg';
import EmailSvg from '../images/icons/email.svg';
import logoWhite from '../images/logo.svg';
import '../styles/Login.css';
import { Link } from 'react-router-dom';
import { IconIDAAN } from '../components/IconIDAAN';
import { useNavigate } from "react-router-dom";
import useAuth from '../../hook/useAuth';
import { useForm } from 'react-hook-form';
import verifyEmailHook from '../../hook/verifyEmailHook';
import { useSelector } from 'react-redux';

const Login = ({ handleInput, isInput }) => {

    const isAuthenticated = localStorage.getItem('token') !== null && localStorage.getItem('name') !== null && localStorage.getItem('abreviation') !== null;
    const rol = useSelector(state => state.getRol);
    const { register, handleSubmit, reset, formState: {errors} } = useForm();
    const navigate = useNavigate();
    const { loginUser } = useAuth();

    const { resendEmail } = verifyEmailHook();

    const submit = (data) => {
        loginUser(data, navigate, reset, resendEmail);
      };

    useEffect(() => {
        if(isAuthenticated && rol == 'Customer'){
            navigate('/choose-nic');
        }

        if(isAuthenticated && rol == 'Super'){
            navigate('/admin/home');
        }

        if(isAuthenticated && rol == 'Admin'){
            navigate('/admin/home');
        }

        if(isAuthenticated && rol == 'Assistant'){
            navigate('/admin/home');
        }
    }, [rol, isAuthenticated]);

    return (
        <div className='form-login'>
            <IconIDAAN logo={logoWhite}/>
            <div className='form-content'>
                <div className='form-login_content'>
                    <div className='form-login_header-text'>
                        <h2>Cuenta de usuario</h2>
                    </div>
                    <form onSubmit={handleSubmit(submit)} className='form-login_input'>
                        <div className='form-login_input-text_content'>
                            <label htmlFor="" className='is-required'>Correo electrónico</label>
                            <div className='position-relative'>
                                <input {...register('email', {required: 'Debes de ingresar tu correo'})} className='form-login_input-password' type='email' placeholder='Introduce tu correo'/>
                                <div className='position-absolute'>
                                    <img src={EmailSvg}/>
                                </div>
                                <small className='text-form' style={{color: 'red'}}>{errors.email?.message}</small>
                            </div>
                        </div>
                        <div className='form-login_input-password_content position-relative'>
                            <label htmlFor="" className='is-required'>Contraseña</label>
                            <div className='position-relative'>
                                <input {...register('password', {
                                        required: 'Debes ingresar tu contraseña',
                                    })}  className='form-login_input-password' type={isInput? 'password' : 'text'} placeholder='Introduce tu contraseña'/>
                                <div className='position-absolute'>
                                    <img onClick={handleInput} src={isInput? eyeOnSvg : eyeOffSvg}/>
                                </div>
                                <small className='text-form' style={{color: 'red'}}>{errors.password?.message}</small>
                            </div>
                        </div>
                        <div className='form-login_text-bottom_content'>

                            <div className='form-login_text-bottom w-100'>
                                <Link to={"/forgot-password"}>Olvidé mi contraseña</Link>
                            </div>
                            <div className='form-login_text-bottom right w-100 color-primary fw-bold'>
                                <Link to={"/forgot-password"}>Pagar como invitado</Link>
                            </div>
                        </div>
                        <div className="form__login__btns">
                            <Link className='btn-gray form-login_text-bottom_first' to={"/register"}>Crear una cuenta</Link>
                            <button className='btn-primary form-login_text-bottom_second'>Iniciar sesión</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;