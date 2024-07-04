import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoading } from '../store/slice/isLoading.slice';
import getConfig from '../assets/components/utils/getConfig';
import Swal from 'sweetalert2';
import deleteCredentials from '../assets/components/utils/deleteCredentials';

const useComplaints = () => {
    const dispatch = useDispatch();
    const [allTypeComplaints, setAllTypeComplaints] = useState([]);
    const [getAllComplaintById, setGetAllComplaintById] = useState([]);
    const [getAllComplaintsByObsId, setGetAllComplaintsByObsId] = useState([]);
    const rol = useSelector(state=> state?.getRol);

  const getTypesComplaints = () => {
    dispatch(setIsLoading(true));
    axios.get(`${import.meta.env.VITE_APP_API_URL}/complaint/GetTypesComplaints`, getConfig() )
    .then(res => {
        setAllTypeComplaints(res.data);
        dispatch(setIsLoading(false));
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Algo salió mal',
          });
          rol == 'Customer' && (
            deleteCredentials()
          )
        dispatch(setIsLoading(false));
    })

  };

  const createComplaints = (data, reset) => {
    dispatch(setIsLoading(true));
    axios.post(`${import.meta.env.VITE_APP_API_URL}/complaint/CreateComplaintByCustomer`, {complaint:data}, getConfig())
    .then(res => {
        Swal.fire({
            icon: 'success',
            title: 'Creado con éxito',
            text: 'Su reclamo ha sido creado con éxito',
          });
          dispatch(setIsLoading(false));
          reset();
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Algo salió mal',
          });
        if(error.response?.data.message == "CLIENTE TIENE ATENCIONES PENDIENTES POR EL MISMO MOTIVO"){
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'USTED YA TIENE ATENCIONES PENDIENTES POR EL MISMO MOTIVO',
          });
        }
        dispatch(setIsLoading(false));
    })
  };

  const getAllComplaintsByNic = (nic) => {
    dispatch(setIsLoading(true));
    axios.get(`${import.meta.env.VITE_APP_API_URL}/complaint/GetComplaints/${nic}`, getConfig())
    .then(res => {
        setGetAllComplaintById(res.data);
        dispatch(setIsLoading(false));
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Algo salió mal',
          });
        dispatch(setIsLoading(false));
        rol == 'Customer' && (
          deleteCredentials()
        )
    })
  };

  const getAllComplaintsByExternaId = (chatId) => {
    dispatch(setIsLoading(true));
    axios.get(`${import.meta.env.VITE_APP_API_URL}/complaint/GetComplaintsByExternalId/${chatId}`, getConfig())
    .then(res => {
      dispatch(setIsLoading(false));
      setGetAllComplaintsByObsId(res.data);
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Algo salió mal',
          });
          dispatch(setIsLoading(false));
          rol == 'Customer' && (
            deleteCredentials()
          )
        })
  };
  

  return { getTypesComplaints, allTypeComplaints, createComplaints, getAllComplaintsByNic, getAllComplaintById, getAllComplaintsByExternaId, getAllComplaintsByObsId }
    
}

export default useComplaints;