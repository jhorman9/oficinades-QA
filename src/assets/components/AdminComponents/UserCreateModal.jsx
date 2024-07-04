import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import PasswordGenerator from './PasswordGenerator';
import ReactSelect from 'react-select';
import useProvince from '../../../hook/useProvince';
import useUsers from '../../../hook/useUsers';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const UserCreateModal = ({show, handleClose, dataTableInstance, setIsRefresh}) => {

    const {register, handleSubmit, reset, formState: { errors }, control, watch, setValue} = useForm();
    const { GetProvinces, provinces } = useProvince();
    const { CreateUserAdmin } = useUsers();
    const [valueProvinces, setValueProvinces] = useState(false);
    const [valueGenerator, setValueGenerator] = useState(false);
    const [provincesValue, setProvincesValue] = useState(null);
    const rol = useSelector(state => state.getRol);

    useEffect(() => {
        GetProvinces();
    },[show])
    
    const options = provinces?.map((provinceDetail) => ({
        label: provinceDetail.name,
        value: provinceDetail.provinceId
      }));

    const validatePasswordMatch = (value) => {
        const originalPassword = watch('password', '');
        if (!(value === originalPassword)) {
            return 'Las contraseñas no coinciden';
        }
    };

    useEffect(() => {
        setValue('name', '')
        setValue('email', '')
        setValue('administratorRol', '0')
        setValue('status', 1)
        setValue('password', '')
        setValue('confirmPassword', '')
        setValueProvinces(false);
        setValue('provinces', '')
        setValueGenerator(false)
    },[show])

    const createUserHandle = (data) => {
        delete data.confirmPassword;
        if(valueProvinces == true && provincesValue.length > 0) {
            data.provinces = provincesValue?.map(province => province.value);
        }else{
            data.provinces = null;
        }
        data.administratorId = null;
        CreateUserAdmin(data, setIsRefresh, handleClose);
    };

    const WarningHandler = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Estatus del usuario',
            text: 'El estatus inicial del usuario será Activo',
        })
    };

  return (
    <>
    {
        rol == 'Admin' || rol == 'Super' ? (
            <Modal id='user_create' className='modal__Add-ChooseNic modal__createUser' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Crear usuario</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(createUserHandle)}>
            <Modal.Body>
                <div className="modal__inputs__group">
                    <div className="modal__inputs__group__input">
                        <label className='is-required'>Nombre</label>
                        <input {...register('name', {
                            required: {
                                value: true,
                                message: 'Este campo es requerido'
                            },
                            pattern: {
                                value: /^[^\s]+\s[^\s]+$/,
                                message: 'Debes introducirlo en formato (Nombre Apellido)'
                            }
                            })} type="text" placeholder='Escribir nombre'/>
                        <small className='text-form' style={{ color: 'red' }}>{errors.name?.message}</small>
                    </div>
                    <div className="modal__inputs__group__input">
                        <label className='is-required'>Email</label>
                        <input {...register('email',{ required: 'Este campo es requerido' })} type="email" placeholder='Escribir email' />
                        <small className='text-form' style={{ color: 'red' }}>{errors.email?.message}</small>
                    </div>
                </div>
                <div className="modal__inputs__group">
                    <div className="modal__inputs__group__input">
                        <label className='is-required'>Roles</label>
                        <select defaultValue={0} {...register('administratorRol', {
                            validate: (value) => {
                                if(value == 0) {
                                    return 'Debes seleccionar una opción';
                                }
                            } 
                        })}>
                            <option value="0" disabled>Seleccionar un rol</option>
                            <option value="Admin">Administrador</option>
                            <option value="Assistant">Atendedor</option>
                        </select>
                        <small className='text-form' style={{ color: 'red' }}>{errors.administratorRol?.message}</small>
                    </div>
                    <div className="modal__inputs__group__input position-relative cursor-pointer">
                        <label className='is-required'>Estatus</label>
                        <select 
                        disabled 
                        {...register('status')}>
                            <option value="1">Activo</option>
                        </select>
                        <div className='position-absolute clic-to-disabled w-100 h-100 top-0 left-0' onClick={WarningHandler}>

                        </div>
                        <small className='text-form' style={{ color: 'red' }}>{errors.status?.message}</small>
                    </div>
                </div>
                <div className="modal__inputs__group">
                <div className="modal__inputs__group__input">
                <label className='is-required'>Contraseña</label>
                <input placeholder='Escribir contraseña'
                    {...register('password', {
                    required: {
                      value: true,
                      message: 'Este campo es requerido'  
                    },
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
                    })}
                    type="password"
                />
                <small className='text-form' style={{ color: 'red' }}>{errors.password?.message}</small>
                </div>

                <div className="modal__inputs__group__input">
                <label className='is-required'>Confirmar contraseña</label>
                <input placeholder='Confirmar contraseña'
                    {...register('confirmPassword', {
                    required: {
                        value: true,
                        message: 'Este campo es requerido'
                    },
                    validate: validatePasswordMatch
                    })}
                    type="password"
                />
                <small className='text-form' style={{ color: 'red' }}>{errors.confirmPassword?.message}</small>
                </div>
            </div>
                <div className="modal__inputs__group__input d-flex mb-2">
                    <input
                        type="checkbox"
                        id="provinceCheckbox"
                        onChange={(e) => setValueProvinces(e.target.checked)}
                        className='cursor-pointer'
                        style={{minHeight: 'inherit'}}
                        />
                        <label className='ms-2 cursor-pointer' htmlFor="provinceCheckbox">Seleccionar provincia</label>
                </div>
                {
                    valueProvinces && (
                        <div className="modal__inputs__group__input">
                        <Controller
                            name="provinces"
                            control={control}
                            render={({ field }) => (
                                <ReactSelect
                                {...field}
                                options={options}
                                isMulti
                                className="react-select-container"
                                classNamePrefix="react-select"
                                onChange={(selectedOptions) => {
                                    setProvincesValue(selectedOptions);
                                    field.onChange(selectedOptions);
                                }}
                                />
                            )}
                            />
                        </div>
                    )
                }
                <div className="modal__inputs__group__input d-flex mb-2">
                    <input
                        id='GeneratorPassword'
                        type="checkbox"
                        onChange={(e) => setValueGenerator(e.target.checked)}
                        className='cursor-pointer'
                        style={{minHeight: 'inherit'}}
                        />
                        <label className='ms-2 cursor-pointer' htmlFor='GeneratorPassword'>Generador de contraseña</label>
                </div>
                {
                    valueGenerator && (
                        <div className="modal__inputs__group__input">
                            <PasswordGenerator />
                        </div>
                    )
                }
            </Modal.Body>
            <Modal.Footer>
                <Button type='submit' className='m-0' variant="primary">Crear usuario</Button>
            </Modal.Footer>
        </Form>
      </Modal>
        ) : (
            null
        )
    }
      </>
  )
}

export default UserCreateModal;