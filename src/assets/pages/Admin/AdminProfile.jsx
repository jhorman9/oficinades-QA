import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import useProfile from '../../../hook/useProfile';
import Swal from 'sweetalert2';

const AdminProfile = () => {

    const { register, handleSubmit, reset, formState: {errors}, setValue } = useForm();
    const { GetProfileAdmin, profileAdminInfo, UpdateAdminProfile } = useProfile();

    const roles = {
        'Super': 'Super Administrador',
        'Admin': 'Administrador',
        'Assistant': 'Atendedor'
    }

    useEffect(() => {
        GetProfileAdmin();
    },[setValue]);

    useEffect(() =>{
        setValue('Name', profileAdminInfo.name);
        setValue('Email', profileAdminInfo.email);
        setValue('Rol', roles[profileAdminInfo.rol]);
        setValue('Password', '');
        setValue('Password2', '');
    },[setValue, profileAdminInfo]); 

    const submit = (data) => {
        if(data.Password === data.Password2){
            delete data.Email;
            delete data.Rol;
            delete data.Password2;
            UpdateAdminProfile(data);
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Las contraseñas no coinciden',
            })
        }
    }

  return (
    <section className='profile'>
        <div className="profile__content container">
            <div className=" mb-3 profile__btn__cancel">
                <h5 className='profile__title mb-0'>MIS DATOS</h5>
            </div>
            <form onSubmit={handleSubmit(submit)}>
                <div className="form__content">
                    <div className="form__data">
                        <div className="mb-2">
                            <label htmlFor="" className='is-required'>Nombre y apellido</label>
                            <input {...register('Name', { 
                                required: 'Este campo es requerido',
                                pattern: {
                                    value: /^[^\s]+\s[^\s]+$/,
                                    message: 'Debes introducirlo en formato (Nombre Apellido)'
                                }
                                })} type="text" placeholder='Escribe aquí'/>
                            <small style={{color: 'red'}}> {errors.Name?.message} </small>
                        </div>

                        <div className="mb-2">
                            <label htmlFor="" className='is-required'>Correo electrónico</label>
                            <input {...register('Email', { required: 'Este campo es requerido' })} type="email" placeholder='Escribe aquí' disabled/>
                            <small style={{color: 'red'}}> {errors.Email?.message} </small>
                        </div>

                        <div className="mb-2">
                            <label htmlFor="" className='is-required'>Rol</label>
                            <input {...register('Rol')} type="text" placeholder='Escribe aquí' disabled/>
                        </div>

                        <div className="mb-2">
                            <label htmlFor="" className='is-required'>Provincia</label>
                            <p className='mb-0 imitated-input' style={{color: 'rgb(84, 84, 84)'}}>{profileAdminInfo.provinces?.length > 0 ? profileAdminInfo?.provinces.map(province => province) : 'General'}</p>
                        </div>
                    </div>
                    <div className="form__password w-100">
                        <div className='mb-3'>
                            <h5 className='profile__title mb-0'>Cambiar contraseña</h5>
                            <p className='mb-0'>Actualiza tu contraseña aquí en cualquier momento</p>
                        </div>
                        <div className='mb-2'>
                            <label htmlFor="">Nueva contraseña</label>
                            <input type="password" {...register('Password', {
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
                            })} placeholder='Escribe aquí'/>
                            <small style={{color: 'red'}}> {errors.Password?.message} </small>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="">Repetir contraseña</label>
                            <input type="password" {...register('Password2')} placeholder='Escribe aquí'/>
                        </div>
                    </div>
                </div>

                <div className="profile__btn__save">
                    <button className='btn btn-primary mt-3'>Guardar cambios</button>
                </div>
            </form>

        </div>
    </section>
  )
}

export default AdminProfile