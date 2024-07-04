import axios from 'axios';
import React, { useState } from 'react'
import { setIsLoading } from '../store/slice/isLoading.slice';
import getConfig from '../assets/components/utils/getConfig';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import deleteCredentials from '../assets/components/utils/deleteCredentials';
import abreviattedName from '../assets/components/utils/abreviattedName';

const usePayment = () => {

    const [paymentByNic, setPaymentByNic] = useState([]);
    const [invoiceByNic, setInvoiceByNic] = useState([]);
    const [paymentCode, setPaymentCode] = useState({});
    const [dataPayment, setDataPayment] = useState();
    const [getCard, setGetCard] = useState([]);
    const [getCardToken, setGetCardToken] = useState('');
    const [getInvoice, setGetInvoice] = useState([]);
    const dispatch = useDispatch();
    const rol = useSelector(state => state.getRol);

    const textToTranslate = {
        'Decline - Contact your Bank':'Declinado, contacte a su banco',
        'Insufficient funds': 'Fondo insuficiente',
        'Card blocked  or cancelled by your Bank': 'Tarjeta bloqueada o cancelado por su banco',
        'Declined, previous lost/stolen': 'Rechazada, tarjeta perdida/robada'
    }

    const getPaymentByNic = (nic) => {
        dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/contract/GetLastPayments/${nic}`, getConfig())
        .then(res => {
            setPaymentByNic(res.data);
            dispatch(setIsLoading(false));
        })
        .catch(err => {
            setPaymentByNic([]);
            dispatch(setIsLoading(false));
            if(rol == 'Customer'){
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Algo salió mal',
                  });
            }
        })
    };

    const getLastInvoiceByNic = (nic) => {
        dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/contract/GetLastInvoices/${nic}`, getConfig())
        .then(res => {
            setInvoiceByNic(res.data)
            dispatch(setIsLoading(false));
        })
        .catch(err => {
            dispatch(setIsLoading(false));
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Algo salió mal',
              });
        })
    };

    const createPayment = (paymentRequest, setIsBooleanButton, reset, setValueSanitation, setValueWater, handleClose, navigate, id) => {
        dispatch(setIsLoading(true));
        axios.post(`${import.meta.env.VITE_APP_API_URL}/payment/Create`, {paymentRequest}, getConfig())
        .then(res => {
            handleClose();
            setValueSanitation('');
            setValueWater('');
            setIsBooleanButton(false);
            reset();
            setPaymentCode(res.data);
            if(res.data.message == 'APPROVED'){
                navigate(`/panel/${id}/pay-completed/${res.data.tokenUrl}`);
                Swal.fire({
                    icon: 'success',
                    title: 'Pago aprobado',
                    text: 'Su pago fue aprobado exitosamente',
                  });
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Algo salió mal',
                    text: textToTranslate[res.data.message],
                  });
            }
        })
        .catch(err => {
            setIsBooleanButton(false);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Algo salió mal',
              });
        })
        .finally(() => {
            dispatch(setIsLoading(false));
        })
    }
    
    const CheckExternalPayment = (token) => {
        dispatch(setIsLoading(true));
        axios.post(`${import.meta.env.VITE_APP_API_URL}/account/checkExternalPayment`, { token } , { headers: {'Content-Type': 'application/json'} } )
        .then(res => {
            deleteCredentials();
            localStorage.setItem('name', res.data.displayName);
            localStorage.setItem('token', res.data.token);
            abreviattedName(res.data.displayName);
            dispatch(setIsLoading(false));
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data.message || 'Algo salió mal',
              });
              dispatch(setIsLoading(false));
        });
    }

    const GetPaymentStatus = (token, navigate, safeDate) => {
        dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/payment/GetPaymentStatus/${token}`, getConfig())
        .then(res => {
            setDataPayment(res.data)
            if(safeDate){
                localStorage.setItem('nicCode', res.data.nicCode);
                setTimeout(() => {
                    navigate(`/panel/${res.data.nicCodeId}/pay-completed/${token}`);
                }, 3000);
            }
            dispatch(setIsLoading(false));
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data.message || 'Algo salió mal',
              });
              dispatch(setIsLoading(false));
        })
    }

    const GetCardMasked = (isTrue) => {
        axios.get(`${import.meta.env.VITE_APP_API_URL}/card/GetCardsByCustomer`, getConfig())
        .then(res => {
            setGetCard(res.data);
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Algo salió mal',
              });
        })
    }

    const GetCardToken = () => {
        axios.get(`${import.meta.env.VITE_APP_API_URL}/payment/GetPaymentsToken`, getConfig())
        .then(res => {
            setGetCardToken(res.data);
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Algo salió mal con el token de pago',
              });
        })
    }

    const DeleteCardCustomer = (id) => {
        axios.delete(`${import.meta.env.VITE_APP_API_URL}/card/DeleteOptionCard/${id}`, getConfig())
        .then(res => {
            Swal.fire({
                icon: 'success',
                title: 'Tarjeta eliminada',
                text: 'Tarjeta eliminada sastifactoriamente',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
              });
        
              setTimeout(() => {
                window.location.reload();
              }, 2001);
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Algo salió mal durante la eliminación de la tarjeta',
              });
        })
    }

    const GetInvoice = (nic, setStateForApi, navigate) => {
        dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/invoice/GetInvoice/${nic}`, getConfig())
        .then(res => {        
            setGetInvoice(res.data);
            dispatch(setIsLoading(false));
            setStateForApi(true);
        })
        .catch(err => {
            dispatch(setIsLoading(false));
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Algo salió mal en el proceso de obtener la factura',
              });
            navigate('/');
        })
    }

    return { getPaymentByNic, paymentByNic, getLastInvoiceByNic, invoiceByNic, createPayment, GetPaymentStatus, paymentCode, CheckExternalPayment, dataPayment, GetCardMasked, getCard, GetCardToken, getCardToken, DeleteCardCustomer, GetInvoice, getInvoice };
    
}

export default usePayment;