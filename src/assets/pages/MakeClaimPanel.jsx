import React, { useEffect } from 'react';
import '../styles/MakeClaimPanel.css';
import SVGArrowRight from '../images/icons/SVGArrowRight';
import { useNavigate, useParams } from 'react-router-dom';
import warningYellow from '../images/warning.png';
import asepPNG from '../images/asep.png';
import useComplaints from '../../hook/useComplaints';
import useNic from '../../hook/useNic';
import { useForm } from 'react-hook-form';

const MakeClaimPanel = () => {

    const { register, handleSubmit, reset, formState: {errors} } = useForm();
    const navigate = useNavigate();
    const { getTypesComplaints, allTypeComplaints, createComplaints } = useComplaints();
    const { getAllNICById, nicById } = useNic();
    const { id } = useParams();

    const backToClaim = () => {
        navigate(`/panel/${id}/claim`);
      }

    useEffect(() => {
        getTypesComplaints();
    }, [id]);

    useEffect(() => {
        if(id){
        getAllNICById(id);
        }
    }, [id]); 

    const submit = (data) => {
        data.nicCode = localStorage.getItem('nicCode');
        createComplaints(data, reset);
    };
    
    const toProfile = ( ) => {
        navigate(`/panel/${id}/profile`);
    };

    const name = localStorage.getItem('name');
      
  return (
    <section className='make__claim container'>
        <div className="make__claim__container">
            <div className="btn-back mb-3" onClick={backToClaim}>
                <SVGArrowRight />
                <span className='color-primary ms-2'>Volver</span>
            </div>
            <h5 className="title__panel mb-2">Hacer reclamo</h5>
            <h6 className='mb-3'>A continuación registre los datos de su reclamo</h6>
            <div className="make__claim__body">
                <div className="make__claim__body__content">
                    <div className="make__claim__form">
                        <ul className="make__claim__info mb-3 list-style-none">
                            <li>Nombre: <span className='fw-bold'>{name}</span></li>
                            <li>Número de cliente: <span className='fw-bold'>{nicById.contractDetailComercial?.nicCode}</span></li>
                            <li>Dirección: <span className='fw-bold'>{nicById.contractDetailComercial?.address}</span></li>
                            <li>Correo: <span className='fw-bold'>{nicById.contractDetailComercial?.email}</span></li>
                        </ul>
                        <div className="make__claim__warning">
                            <div className="make__claim__warning__content mb-2">
                                <img src={warningYellow} alt="warning" />
                                <p className='mb-0'>Por favor verificar si su información de contacto es correcta, sino actualicela para reclamos posteriores</p> 
                            </div>
                            <div className="make__claim__warning__btn mt-1">
                                <button className="btn btn-primary" onClick={toProfile}>Actualizar</button>
                            </div>
                        </div>
                        <form className="make__claim__create__form mb-2" onSubmit={handleSubmit(submit)}>
                            <div className="input__group">
                                <div className="claim__input">
                                    <label className='d-block is-required'>Télefono fijo</label>
                                    <input {...register('phoneNumber1', {
                                        required: 'Debes escribir en este campo', 
                                        minLength: {
                                        value: 7,
                                        message: 'Debe ingresar minimo 7 digitos'
                                        }, 
                                        message: 'Debes insertar tu numero telefonico'
                                        })} 
                                        className='w-100' type="number" placeholder='Escribe aquí'/>
                                    <small className='text-form' style={{color: 'red'}}>{errors.phoneNumber1?.message}</small>
                                </div>
                                <div className="claim__input">
                                    <label className='d-block is-required' htmlFor="smartphone">Celular</label>
                                    <input {...register('phoneNumber2', {
                                        required: 'Debes escribir en este campo', 
                                        minLength: {
                                        value: 8,
                                        message: 'Caracter minimo de 8 digitos'
                                        }, 
                                        message: 'Debes insertar tu numero celular'
                                    })} className='w-100' type="number" placeholder='Escribe aquí'/>
                                    <small className='text-form' style={{color: 'red'}}>{errors.phoneNumber2?.message}</small>
                                </div>
                            </div>
                            <div className="claim__select">
                                <label className='d-block is-required' htmlFor="claimType">Tipo de reclamo</label>
                                <select className='w-100' {...register('TypeComplaintCode', {
                                    validate: (value) => {
                                        if(value == 0) {return 'Debes seleccionar una provincia'};
                                    }
                                })}>
                                    <option value={0} placeholder='Escribe aquí'>Seleccionar</option>
                                {
                                    allTypeComplaints?.map(complaints => (
                                        <option key={complaints.name} value={complaints.complaintTypeCode}>
                                            {complaints.name}
                                        </option>
                                    ))
                                }
                                </select>
                                <small className='text-form' style={{color: 'red'}}>{errors.TypeComplaintCode?.message}</small>
                            </div>
                            <div className="claim__input">
                                <label className='d-block is-required' htmlFor="observation">Observación</label>
                                <textarea {...register('Observations', {
                                    required: 'Debe escribir en este campo',
                                    minLength: {
                                        required: 'Ingresar datos',
                                        value: 15,
                                        message: 'La observación debe superar los 15 caracteres',
                                        }
                                })} className='w-100' type="text" placeholder='Escribe aquí'></textarea>
                                <small className='text-form' style={{color: 'red'}} >{errors.Observations?.message}</small>
                            </div>
                            <div className="btn__send__claim">
                                <button type='submit' className='bt btn-primary'>Enviar reclamo</button>
                            </div>
                        </form>
                    </div>
                    <div className="make__claim__asep">
                        <img src={asepPNG} alt="asep image" />
                        <p>La Autoridad de los Servicios Públicos a través de la Resolución JD-101 de 27 de agosto de 1997, aprobó “El reglamento sobre los Deberes y Derechos de los Usuarios”. El Artículo No.22 del Capitulo 1. Derechos de los Usuarios, indica: <span className='fw-bold'>“Reclamar por cualquier deficiencia en la prestación del servicio o en cualquier otro aspecto de su relación con el prestador ante éste y recibir del mismo respuesta a su reclamación en un plazo no mayor de treinta (30) días calendario</span>, contados a partir de la fecha de presentación de la reclamación. La reclamación podrá ser presentada por el cliente o el usuario, según la naturaleza de la reclamación”.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default MakeClaimPanel;