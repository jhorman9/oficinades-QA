import React, { useEffect } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { IconIDAAN } from '../components/IconIDAAN';
import logo from '../images/logo.svg'
import { useForm } from 'react-hook-form';
import useForgotPassword from '../../hook/useForgotPassword';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const ResetPassword = () => {

    const { register, handleSubmit, reset, formState: {errors} } = useForm();
    const { resetPasswordHook, isValidToken } = useForgotPassword();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");
    const email = searchParams.get("email");
    
    
    useEffect(() => {
        isValidToken(email, token);
    },[email, token])
    
    const isToken = useSelector(state => state.isToken);
    
    const submit = (data) => {
        data.NewPassword === data.password2 ? 
        resetPasswordHook(data, navigate, reset, email, token, isToken ):
        Swal.fire({ icon: 'error', title: 'Oops...',text: 'Las contraseñas no coinciden', confirmButtonColor: 'var(--primary)'})
    };

  return (
    <>
    {
            isToken ? (
                <section>
                    <div className='form-login form-register forgot-password'>
                        <IconIDAAN logo={logo}/>
                        <div className='form-login__header__text form-register_header__title'>
                            <h2>Cambiar contraseña</h2>
                        </div>
                        <div className='form-content'>
                            <form className='form-login_content' onSubmit={handleSubmit(submit)}>
                                <div className='form-login_input'>
                                    <div className='form-login_input-text_content'>
                                        <label htmlFor="" className='is-required'>Nueva contraseña</label>
                                        <div className='position-relative'>
                                            <input {...register('NewPassword', {
                                            required: 'Debes ingresar la contraseña',
                                            pattern: {
                                            value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[*.\-_¿?])[A-Za-z\d*.\-_¿?]{8,10}$/,
                                            message: "La contraseña debe tener entre 8 y 10 caracteres, contener letras, números y solo 4 caracteres especiales: * . - _ ¿ ?"
                                            },
                                            maxLength: {
                                            value: 10,
                                            message: 'La contraseña no debe superar los 10 caracteres',
                                            },
                                            minLength: {
                                            value: 8,
                                            message: 'La contraseña debe tener al menos 8 caracteres',
                                            },
                                        })} className='form-login_input-password' autoComplete='off' type='password' placeholder='Introduce contrasena'/>
                                        </div>
                                        <small className='text-form' style={{color: 'red'}}>{errors.NewPassword?.message}</small>
                                    </div>
                                    <div className='form-login_input-text_content'>
                                        <label htmlFor="" className='is-required'>Confirmar nueva contraseña</label>
                                        <div className='position-relative'>
                                            <input {...register('password2', { required: 'Debes ingresar la contraseña para validar'})} className='form-login_input-password' autoComplete='off' type='password' placeholder='Introduce contrasena'/>
                                        </div>
                                        <small className='text-form' style={{color: 'red'}}>{errors.password2?.message}</small>
                                    </div>
                                    <div className="form__login__btns mt-4">
                                        <Link className='btn-gray form-login_text-bottom_first cancel__forgot red' to={"/"}>Cancelar</Link>
                                        <button className='btn-primary form-login_text-bottom_second'>Recuperar contraseña</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            ) : (
                <section>
                    <button className='btn btn-primary m-2'><Link className='color-inherit text-decoration-none' to={'/'}>Volver al login</Link></button>
                </section>
            )
    }
    </>
  )
}

export default ResetPassword