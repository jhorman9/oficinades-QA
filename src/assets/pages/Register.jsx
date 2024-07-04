import React, { useEffect, useState } from 'react';
import '../styles/Register.css';
import { Link, useNavigate } from 'react-router-dom';
import { IconIDAAN } from '../components/IconIDAAN';
import useAuth from '../../hook/useAuth';
import { useForm } from 'react-hook-form';
import logo from '../images/logo.svg';
import ReCAPTCHA from 'react-google-recaptcha';
import Swal from 'sweetalert2';
import useProvince from '../../hook/useProvince';

export const Register = ( {props} ) => { 

    const [isInfo, setIsInfo] = useState(false);
    const { register, handleSubmit, reset, formState: {errors} } = useForm();
    const navigate = useNavigate();
    const { createUser } = useAuth();
    const { GetProvinces, provinces } = useProvince();

    useEffect(() => {
        GetProvinces();
    },[]);

    const submit = (data) => {

        if(data.Password === data.Password2){
            createUser(data, navigate, reset, isInfo);
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Las contraseñas no coinciden',
                confirmButtonColor: 'var(--primary)',
            })
        }
    };

    function onChange(value) {
        if(value){
          setIsInfo(true);
        }else{
            setIsInfo(false);
        }
      }
      
    
    
  return (
    <section className='form-login form-register'>
        <div>
            <IconIDAAN logo={logo}/>
            <div className='form-login__header__text form-register_header__title'>
                <h2>CREAR CUENTA DE USUARIO</h2>
            </div>
            <div className='form-content'>
                <div className='form-login_content'>
                    <form className='form-login_input' onSubmit={handleSubmit(submit)} >
                        <div className='form-login_input-text_content'>
                            <label htmlFor="" className='is-required'>Nombre del titular en la factura</label>
                            <div className='position-relative'>
                                <input {...register('Name', { 
                                    required: 'Debes introducir tu factura',
                                    pattern: {
                                        value: /^(\S+\s+){1,}\S+$/,  // Al menos una palabra para el nombre y una para el apellido
                                        message: 'Debes introducirlo en formato (Nombre Apellido)'
                                    }
                                     })} className='form-login_input-password' autoComplete='off' type='text' placeholder='Introduce el nombre' />
                                <p className='small__text'> Nombre que aparece en tu factura </p>
                                <small className='text-form' style={{color: 'red'}}>{errors.Name?.message}</small>
                                <div className='position-absolute'>
                                    <i className="fa-solid fa-file-invoice-dollar"></i>
                                </div>
                            </div>
                        </div>
                        <div className='form-login_input-text_content'>
                            <label htmlFor="" className='is-required'>Correo electrónico</label>
                            <div className='position-relative'>
                                <input {...register('Email', { required: 'Debes introducir tu correo' })} className='form-login_input-password' autoComplete='off' type='text' placeholder='Introduce tu correo' />
                                <small className='text-form' style={{color: 'red'}}>{errors.Email?.message}</small>
                            </div>
                        </div>
                        <div className="form__register__group">
                            <div className='form-login_input-password_content position-relative'>
                                <label htmlFor="" className='is-required'>Tipo de documento</label>
                                <div className='position-relative'>
                                    <select {...register('DocumentTypeId', { 
                                        validate: (value) => {
                                            if(value == 0) {return 'Debes seleccionar un tipo de documento'};
                                        }
                                     })} className='form-login_input-password'>
                                        <option selected disabled value={0}>Seleccionar</option>
                                        <option value='1'>Cédula</option>
                                        <option value='2'>Pasaporte</option>
                                        <option value='3'>Ruc</option>
                                        <option value='4'>Entidad Gubernamental</option>
                                    </select>
                                    <small className='text-form' style={{color: 'red'}}>{errors.DocumentTypeId?.message}</small>
                                </div>
                            </div>
                            <div className='form-login_input-password_content position-relative'>
                            <label htmlFor="" className='is-required'>Número de documento</label>
                            <div className='position-relative'>
                                <input {...register('DocumentNumber', { required: 'Este campo es requerido' })} className='form-login_input-password' autoComplete='off' type={'text'} placeholder='Introduce N° documento' />
                                <p className='small__text'> El número de cédula y RUC se deben ingresar con guiones </p>
                                <small className='text-form' style={{color: 'red'}}>{errors.DocumentNumber?.message}</small>
                            </div>
                            </div>
                        </div>
                        <div className="form__register__group">
                            <div className='form-login_input-password_content position-relative'>
                                <label htmlFor="">Teléfono</label>
                                <div className='position-relative'>
                                    <input {...register('PhoneNumber1', { required: 'Este campo es requerido', minLength: {value: 7, message: 'Minimo son 7 numeros'} })} className='form-login_input-password' pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" autoComplete='off' type="number" placeholder='Introduce N° Teléfono' />
                                    <small className='text-form' style={{color: 'red'}}>{errors.PhoneNumber1?.message}</small>

                                </div>
                            </div>
                            <div className='form-login_input-password_content position-relative'>
                            <label htmlFor="">Célular</label>
                            <div className='position-relative'>
                                <input {...register('PhoneNumber2', { required: 'Este campo es requerido', minLength: {value: 8, message: 'Minimo son 8 numeros'} })} className='form-login_input-password' autoComplete='off' type={'number'} placeholder='Introduce N° Celular'/>
                                <small className='text-form' style={{color: 'red'}}>{errors.PhoneNumber2?.message}</small>
                            </div>
                            </div>
                        </div>
                        <div className="form__register__group">
                            <div className='form-login_input-password_content position-relative'>
                                <label htmlFor="" className='is-required'>NIC</label>
                                <div className='position-relative'>
                                    <input {...register('NicCode', { required: 'Este campo es requerido', minLength: {value: 6, message: 'Minimo 6 caracteres'} , maxLength: {value: 8, message: 'Máximo 8 caracteres'} })} className='form-login_input-password' autoComplete='off' type={'text'} placeholder='Introduce tu NIC' />
                                    <p className='small__text'> El NIC debe tener 6 caracteres </p>
                                    <small className='text-form' style={{color: 'red'}}>{errors.NicCode?.message}</small>
                                </div>
                            </div>
                            <div className='form-login_input-password_content position-relative'>
                            <label htmlFor="" className='is-required'>Ruta</label>
                            <div className='position-relative'>
                                <input {...register('PathCode', { required: 'Este campo es requerido' })} className='form-login_input-password' autoComplete='off' type={'text'} placeholder='Introduce la ruta' />
                                <p className='small__text'> Ruta que aparece en su factura sin espacios </p>
                                <small className='text-form' style={{color: 'red'}}>{errors.PathCode?.message}</small>
                            </div>
                            </div>
                        </div>
                        <div className="form__register__group">
                            <div className='form-login_input-password_content position-relative'>
                                <label htmlFor="" className='is-required'>Finca / Folio Real</label>
                                <div className='position-relative'>
                                    <input {...register('FincaCode', { required: 'Este campo es requerido' })} className='form-login_input-password' autoComplete='off' type={'text'} placeholder='Introduce la finca y el folio' />
                                    <small className='text-form' style={{color: 'red'}}>{errors.FincaCode?.message}</small>
                                </div>
                            </div>
                            <div className='form-login_input-password_content position-relative'>
                                <label htmlFor="" className='is-required'>Provincia</label>
                                <div className='position-relative'>
                                    <select {...register('ProvinceId', { 
                                        validate: (value) => {
                                            if(value == 0) {return 'Debes seleccionar una provincia'};
                                        }})} 
                                            className='form-login_input-password'>
                                        <option selected disabled value={0}>Seleccione la provincia</option>
                                        {
                                            provinces.map((province) => (
                                                <option key={province.name} value={province.provinceId}>{province.name}</option>
                                            ))
                                        }
                                    </select>
                                    <small className='text-form' style={{color: 'red'}}>{errors.ProvinceId?.message}</small>
                                </div>
                            </div>
                        </div>
                        <div className="form__register__group">
                            <div className='form-login_input-password_content position-relative'>
                                <label htmlFor="" className='is-required'>Contraseña</label>
                                <div className='position-relative'>
                                <input
                                    {...register('Password', {
                                        required: 'Debes ingresar la contraseña',
                                        pattern: {
                                            value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[*.\-_¿?]).*$/,
                                            message: 'La contraseña debe tener entre 8 y 10 carácteres, contener letras mayusculas y minusculas, números y al menos uno de los carácteres especiales: * . - _ ¿ ?'
                                        },
                                        maxLength: {
                                        value: 10,
                                        message: 'La contraseña no debe superar los 10 caracteres',
                                        },
                                        minLength: {
                                        value: 8,
                                        message: 'La contraseña debe tener al menos 8 caracteres',
                                        },
                                    })}
                                    className='form-login_input-password'
                                    type={props.isInput? 'password' : 'text'}
                                    autoComplete='off'
                                    placeholder='Introduce tu contraseña'
                                    />                                    
                                    <div className='position-absolute' onClick={props.handleInput}>
                                        <img src={props.isInput? props.eyeOnSvg : props.eyeOffSvg}/>
                                    </div>
                                    <small className='text-form' style={{color: 'red'}}>{errors.Password?.message}</small>
                                </div>
                            </div>
                            <div className='form-login_input-password_content position-relative'>
                            <label htmlFor="" className='is-required'>Confirmar contraseña</label>
                            <div className='position-relative'>
                                <input type={props.isInput? 'password' : 'text'} {...register('Password2', { required: 'Debes ingresar la contraseña para validar' })} className='form-login_input-password' autoComplete='off'  placeholder='Confirmar contraseña' />
                                <small className='text-form' style={{color: 'red'}}>{errors.Password2?.message}</small>
                                <div className='position-absolute' onClick={props.handleInput}>
                                    <img src={props.isInput? props.eyeOnSvg : props.eyeOffSvg}/>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="form__terms-service">
                            <div className="form__terms-service__checkbox">
                                <input {...register('AcceptTerms', { required: 'Debes aceptar los términos y condiciones' })} type="checkbox" className='mt-0'/>
                                <span className="form__terms-service__checkbox-text">Acepto los <Link to={'https://www.idaan.gob.pa/appcliente/t%C3%A9rminos-de-aceptaci%C3%B3n'} target='_blank' className='mb-0'>Términos y Condiciones</Link></span><br />
                            </div>
                                <small className='text-form' style={{color: 'red'}}>{errors.AcceptTerms?.message}</small>
                            <div className="form__terms-service__checkbox">
                                <input {...register('NotificationByEmail')} type="checkbox" className='mt-0'/>
                                <span style={{color: 'red'}}></span>
                                <span className="form__terms-service__checkbox-text">Deseo recibir las facturas por correo electrónico</span><br />
                            </div>
                                <small className='text-form' style={{color: 'red'}}>{errors.NotificationByEmail?.message}</small>
                        </div>
                        <div className='captcha'>
                            <div>
                                <ReCAPTCHA
                                sitekey={import.meta.env.VITE_APP_GOOGLE_KEY}
                                onChange={onChange}
                                size='compact'
                                hl="es"
                                />
                            </div>
                        </div>                        
                        <div className="form__login__btns mt-4">
                            <Link className='btn-gray form-login_text-bottom_first text-decoration-underline' to={"/"}>Ya tengo una cuenta</Link>
                            <button type='submit' className='btn-primary form-login_text-bottom_second'>Crear cuenta</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
  )
}
