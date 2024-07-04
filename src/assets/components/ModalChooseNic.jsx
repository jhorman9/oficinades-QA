import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import NICExample from '../images/NIC-example.png';
import { useForm } from 'react-hook-form';
import useNic from '../../hook/useNic';
import useProvince from '../../hook/useProvince';

const ModalChooseNic = ({ handleClose, show }) => {

    const { register, handleSubmit, reset, formState: {errors} } = useForm();

    const { createNic } = useNic();
    const { GetProvinces, provinces } = useProvince();

    useEffect(() => {
        GetProvinces();
    },[]);

    const submit = (data) => {
        createNic(data, reset);
    };
    
  return (
    <Modal className='modal__Add-ChooseNic' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Agregar NIC</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(submit)}>
            <Modal.Body>
                <p>Si usted posee más de un contrato puede agregarlos a continuación con su número de NIC y RUTA, esto le permitirá consultar su última factura, ver últimos pagos y últimas facturas de sus cuentas relacionadas.</p>
                <p>Los datos requeridos los puede obtener de su factura:</p>
                <img className='w-100' src={NICExample} alt="Ejemplo de numeros de NIC" />
                    <div className="modal__inputs__group">
                        <div className="modal__inputs__group__input">
                            <label className='is-required'>NIC</label>
                            <input {...register('NicCode', {required: 'Este campo no puede estar vacio',minLength: {value: 6, message: 'Minimo 6 caracteres'} , maxLength: {value: 8, message: 'Máximo 8 caracteres'}})} type="number" className="form-control" placeholder="Escribe aquí" />
                            <small className='text-form' style={{color: 'red'}}>{errors.NicCode?.message}</small>
                        </div>
                        <div className="modal__inputs__group__input">
                            <label className='is-required'>Ruta</label>
                            <input {...register('PathCode', {required: 'Este campo no puede estar vacio'})} type="text" className="form-control" placeholder="Escribe aquí" />
                            <small className='text-form' style={{color: 'red'}}>{errors.PathCode?.message}</small>
                        </div>
                    </div>
                    <div className="modal__inputs__group">
                        <div className="modal__inputs__group__input">
                            <label className='is-required'>Finca / Folio Real</label>
                            <input {...register('FincaCode', {required: 'Este campo no puede estar vacio'})} type="text" className="form-control" placeholder="Escribe aquí" />
                            <small className='text-form' style={{color: 'red'}}>{errors.FincaCode?.message}</small>
                        </div>
                        <div className="modal__inputs__group__input">
                            <label className='is-required'>Provincia</label>
                            <Form.Select aria-label="Default select example" style={{marginBottom: '14px'}} {...register('ProvinceId', {
                                validate: (value) => {
                                    if(value == 0) {return 'Debes seleccionar una provincia'};
                                }
                            })}>
                                <option value='0'>Seleccione aquí</option>
                                {provinces?.map((province) => (
                                    <option key={province.provinceId} value={province.provinceId}>
                                        {province.name}
                                    </option>
                                    ))}
                            </Form.Select>
                            <small className='text-form' style={{color: 'red'}}>{errors.ProvinceId?.message}</small>

                        </div>
                    </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className='m-0' type='submit' variant="primary">Crear NIC</Button>
            </Modal.Footer>
        </Form>
    </Modal>
  )
}

export default ModalChooseNic;