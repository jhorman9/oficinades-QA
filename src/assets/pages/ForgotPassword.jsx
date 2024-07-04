import React, { useState } from 'react'
import { IconIDAAN } from '../components/IconIDAAN'
import CaptchaCode from '../components/CaptchaCode'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../images/logo.svg'
import '../styles/forgotPassword.css'
import { useForm } from 'react-hook-form'
import useForgotPassword from '../../hook/useForgotPassword'
import ReCAPTCHA from 'react-google-recaptcha'

const ForgetPassword = ( ) => {

    const [isInfo, setIsInfo] = useState(false);
    const { register, handleSubmit, reset, formState: {errors} } = useForm();

    const { sendEmail } = useForgotPassword();
    const navigate = useNavigate();

    const submit = (data) => {
           sendEmail(data, reset, isInfo, navigate);
      };

    function onChange(value) {
        if(value){
          setIsInfo(true);
        }else{
            setIsInfo(false);
        }
      }

  return (
    <section>
        <div className='form-login form-register forgot-password'>
            <IconIDAAN logo={logo}/>
            <div className='form-login__header__text form-register_header__title'>
                <h2>OLVIDÉ MI CONTRASEÑA</h2>
            </div>
            <div className='form-content'>
                <form className='form-login_content' onSubmit={handleSubmit(submit)}>
                    <div className='form-login_input'>
                        <div className='form-login_input-text_content'>
                            <label htmlFor="" className='is-required'>Correo electrónico</label>
                            <div className='position-relative'>
                                <input {...register('email', { required: 'Debes introducir tu correo electronico' })} className='form-login_input-password' autoComplete='off' type='text' placeholder='Introduce tu correo'/>
                                <small className='text-form' style={{color: 'red'}}>{errors.email?.message}</small>
                            </div>
                        </div>
                        <div className='captcha'>
                            <div>
                                <ReCAPTCHA
                                sitekey={import.meta.env.VITE_APP_GOOGLE_KEY}
                                onChange={onChange}
                                hl="es"
                                />
                            </div>
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
  )
}

export default ForgetPassword;