import React, { useEffect } from 'react';
import '../styles/profile.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useProfile from '../../hook/useProfile';
import Swal from 'sweetalert2';

const Profile = () => {

    const { register, handleSubmit, reset, formState: {errors}, setValue } = useForm();
    const {updateProfile, GetProfile, profileInfo, DeleteByProfileUser} = useProfile();
    const navigate = useNavigate();

    useEffect(() => {
        GetProfile();
    },[setValue]);

    useEffect(() =>{
        setValue('DocumentName', profileInfo.name);
        setValue('Email', profileInfo.email);
        setValue('DocumentTypeId', profileInfo.documentTypeId);
        setValue('DocumentNumber', profileInfo.documentNumber);
        setValue('DocumentTypeId', profileInfo.documentTypeId);
        setValue('PhoneNumber1', profileInfo.phoneNumber1);
        setValue('PhoneNumber2', profileInfo.phoneNumber2);
        setValue('NotificationByEmail', profileInfo.notificationByEmail);
    },[setValue, profileInfo]); 

    const submit = (data) => {
        if(data.NewPassword === data.Password2){
            delete data.Password2;
            updateProfile(data, reset);
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Las contraseñas no coinciden',
                confirmButtonColor: 'var(--primary)',
            })
        }
    };

    const cancelAccount = () => {
        Swal.fire({
            title: "Estás seguro/a?",
            text: 'Una vez que su cuenta haya sido eliminada, ya no tendrá acceso a la plataforma',
            icon: "question",
            iconColor: 'var(--primary)',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Eliminar",
            confirmButtonColor: '#d33',
            cancelButtonColor: 'var(--primary)',
          }).then((result) => {
            if (result.isConfirmed) {
              DeleteByProfileUser(navigate);
            }
          });
    }
    

  return (
    <section className='profile'>
        <div className="profile__content container">
            <div className=" mb-3 profile__btn__cancel">
                <h5 className='profile__title mb-0'>MIS DATOS</h5>
                <button className='btn btn-danger' onClick={() => cancelAccount()}>Cancelar cuenta</button>
            </div>
            <form onSubmit={handleSubmit(submit)}>
                <div className="form__content">
                    <div className="form__data">
                        <label htmlFor="" className='is-required'>Nombre de la factura</label>
                        <input {...register('DocumentName', { 
                            required: 'Este campo es requerido',
                            pattern: {
                                value: /^[^\s]+\s[^\s]+$/,
                                message: 'Debes introducirlo en formato (Nombre Apellido)'
                            }
                            })} type="text" />
                        <span style={{color: 'red'}}> {errors.DocumentName?.message} </span>

                        <label htmlFor="" className='is-required'>Correo electrónico</label>
                        <input {...register('Email', { required: 'Este campo es requerido',     
                        pattern: {
                            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: 'Por favor ingrese un correo electrónico válido'
                            } })} type="email" />
                        <span style={{color: 'red'}}> {errors.Email?.message} </span>

                        <div className="input__group">
                            <div className="input__group__item">
                                <label htmlFor="" className='is-required'>Tipo de documento</label>
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
                            <div className="input__group__item">
                                <label htmlFor="" className='is-required'>Número de documento</label>
                                <input className='mb-0' {...register('DocumentNumber', { required: 'Este campo es requerido' })} type="text" />
                                <p className='small__text mb-1 mt-1'> El número de cédula y RUC se deben ingresar con guiones </p>
                                <span style={{color: 'red'}}> {errors.DocumentNumber?.message} </span>
                            </div>
                        </div>

                        <div className="input__group">
                            <div className="input__group__item">
                                <label htmlFor="" className='is-required'>Teléfono</label>
                                <input {...register('PhoneNumber1', { 
                                    required: 'Este campo es requerido', 
                                    minLength: {value: 7, message: 'Minimo son 7 numeros'}
                                    })
                                    } type="text" />
                                <span style={{color: 'red'}}> {errors.PhoneNumber1?.message} </span>
                            </div>
                            <div className="input__group__item">
                                <label htmlFor="" className='is-required'>Célular</label>
                                <input {...register('PhoneNumber2', { required: 'Este campo es requerido', minLength: {value: 8, message: 'Minimo son 7 numeros'} })} type="text" />
                                <span style={{color: 'red'}}> {errors.PhoneNumber2?.message} </span>
                            </div>
                        </div>

                    </div>
                    <div className="form__password customer-profile">
                        <div className='mb-3'>
                            <h5 className='profile__title mb-0'>Cambiar contraseña</h5>
                            <p className='mb-0'>Actualiza tu contraseña aquí en cualquier momento</p>
                        </div>
                        <label htmlFor="">Nueva contraseña</label>
                        <input type="password" {...register('NewPassword', {
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[*.\-_¿?]).*$/,
                                message: 'La contraseña debe tener entre 8 y 10 carácteres, contener letras mayusculas y minusculas, números y al menos uno de los carácteres especiales: * . - _ ¿ ?'
                            },
                            maxLength: {
                                value: 10,
                                message: 'La contraseña no debe superar los 10 carácteres'
                            },
                            minLength: {
                                value: 8,
                                message: 'La contraseña debe tener al menos 8 carácteres'
                            }
                        })}/>
                        <label htmlFor="">Repetir contraseña</label>
                        <input type="password" {...register('Password2')}/>
                    </div>
                </div>

                <div className="terms mt-2">
                    <div className="notification d-flex align-items-center p-0">
                        <input id='receiveBill' {...register('NotificationByEmail')}  type="checkbox" className='w-fit-content h-fit-content mb-0 cursor-pointer'/>
                        <label htmlFor='receiveBill' className="form__terms-service__checkbox-text cursor-pointer">Sí, Deseo recibir las facturas por correo electrónico</label><br />
                    </div>
                </div>

                <div className="profile__btn__save">
                    <button type='submit' className='btn btn-primary mt-3'>Guardar cambios</button>
                </div>
            </form>

        </div>
    </section>
  )
}

export default Profile;