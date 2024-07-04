import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import useProvince from '../../../hook/useProvince';
import useUsers from '../../../hook/useUsers';
import PasswordGenerator from './PasswordGenerator';
import ReactSelect from 'react-select';

const UserEditModal = ({ show, handleClose, getUser, handleShow }) => {

    const {register, handleSubmit, reset, formState: { errors }, control, watch, setValue} = useForm();
    const { GetProvinces, provinces } = useProvince();
    const { UpdateUserAdmin } = useUsers();
    const [valueProvinces, setValueProvinces] = useState(true);
    const [valueGenerator, setValueGenerator] = useState(false);
    const [provincesValue, setProvincesValue] = useState(null);

    const status = {
        'Active': 'false',
        'Suspended': 'true',
        }
    
    useEffect(() => {
        GetProvinces();
    },[]);
    
    useEffect(() => {
        setValue('administratorId', getUser.administratorId);
        setValue('name', getUser.name);
        setValue('email', getUser.email); 
        setValue('administratorRol', getUser.rol);
        setValue('disabled', status[getUser.status]);
        setValue('password', '');
        setValue('confirmPassword', '');
        setValue('provinces', getUser.provinces?.map(provinceValue => ({
            label: provinceValue.name,
            value: provinceValue.provinceId
        })));
        setProvincesValue(getUser.provinces);
        const provincesWatch = watch('provinces')?.length;
        if(provincesWatch > 0){
            setValueProvinces(true);
        }else{
            setValueProvinces(false);
        }
    },[show, handleShow, getUser.status, setValue]);
        
    const options = provinces?.map((provinceDetail) => ({
        label: provinceDetail.name,
        value: provinceDetail.provinceId
    }));
    
    const updateUserHandle = (data) => {
        delete data.confirmPassword;
        if(valueProvinces == true && provincesValue.length > 0) {
            data.provinces = provincesValue?.map(province => province.provinceId || province.value);
        }else{
            data.provinces = null;
        }
        data.disabled = data.disabled === 'true';
        UpdateUserAdmin(data, handleClose);
    };

    const validatePasswordMatch = (value) => {
        const originalPassword = watch('password', '');
        if (!(value === originalPassword)) {
            return 'Las contraseñas no coinciden';
        }
    };

  return (
    <Modal id='user_edit' className='modal__Add-ChooseNic modal__editUser' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Editar usuario</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(updateUserHandle)}>
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
                    <div className="modal__inputs__group__input">
                        <label className='is-required'>Estatus</label>
                        <select 
                        {...register('disabled')}>
                            <option value='false'>Activo</option>
                            <option value='true'>Deshabilitado</option>  
                        </select>
                        <small className='text-form' style={{ color: 'red' }}>{errors.status?.message}</small>
                    </div>
                </div>
                <div className="modal__inputs__group">
                <div className="modal__inputs__group__input">
                <label className=''>Contraseña</label>
                <input placeholder='Escribir contraseña'
                    {...register('password', {
                    pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[*.\-_¿\?])[A-Za-z\d*.\-_¿?]{8,10}$/,
                        message: 'La contraseña debe tener entre 8 y 10 carácteres, contener letras, números y al menos uno de los carácteres especiales: * . - _ ¿ ?'
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
                <label className=''>Confirmar contraseña</label>
                <input placeholder='Confirmar contraseña'
                    {...register('confirmPassword', {
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
                        checked={valueProvinces}
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
                <Button type='submit' className='m-0' variant="primary">Guardar cambios</Button>
            </Modal.Footer>
        </Form>
      </Modal>
  )
}

export default UserEditModal