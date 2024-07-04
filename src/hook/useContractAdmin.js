import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '../store/slice/isLoading.slice';
import getConfig from '../assets/components/utils/getConfig';
import Swal from 'sweetalert2';
import axios from 'axios';

const useContractAdmin = () => {
    const dispatch = useDispatch();

    const [contractByStatusAndProvince, setContractByStatusAndProvince] = useState([]);
    const [nicById, setNicById] = useState({});
    const [ getPagination, setGetPagination] = useState({});
  
    const GetContractByStatusNicAndProvince = (itemPerPageState, pageNumberState, statusState, provinceState, isSort, valueTypeEmailOrNic, valueEmailOrNic) => {
        dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/contract/GetContracts/?pageSize=${itemPerPageState}&pageNumber=${pageNumberState + 1}&status=${statusState}&provinceId=${provinceState}&orderType=${isSort}&TypeFilter=${valueTypeEmailOrNic}&Search=${valueEmailOrNic}`, getConfig())
        .then(res => {
            setGetPagination(JSON.parse(res.headers['paginations']));
            setContractByStatusAndProvince(res.data);
            dispatch(setIsLoading(false));
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data.message || error.response?.data || 'Algo salió mal',
                confirmButtonColor: 'var(--primary)',
              });
            dispatch(setIsLoading(false));
        })
      };

      const ApprovedContract = (data, setIsRefresh, text) => {
        dispatch(setIsLoading(true));
         axios.post(`${import.meta.env.VITE_APP_API_URL}/contract/UpdateContractStatus`, { ContractStatus:data }, getConfig())
         .then(res => {
             setIsRefresh(true);
             setContractByStatusAndProvince(res.data);
             dispatch(setIsLoading(false));
             Swal.fire({
                 icon: 'success',
                 title: text == 'Rejected' ? 'Contrato rechazado' : 'Contrato aprobado',
                 text: text == 'Rejected' ? 'El contrato ha sido rechazado con éxito' : 'El contrato ha sido aprobado con éxito',
                 timer: 2000,
                 timerProgressBar: true,
                 showConfirmButton: false,
               });
                setTimeout(() => {
                  window.location.reload();
              }, 2001)
               dispatch(setIsLoading(false));
         })
         .catch(error => {
             Swal.fire({
                 icon: 'error',
                 title: 'Error',
                 text: error.response?.data.message || error.response?.data || 'Algo salió mal',
                 confirmButtonColor: 'var(--primary)',
               });
             dispatch(setIsLoading(false));
         })
       };

       const getAllNICById = (id, setIsRefresh) => {
        dispatch(setIsLoading(true));
          axios.get(`${import.meta.env.VITE_APP_API_URL}/contract/GetContract/${id}`, getConfig())
          .then((res) => {
            setIsRefresh(true);
            setNicById(res.data);
              localStorage.setItem('nicCode', res.data.contractDetailSistem.nicCode);
              dispatch(setIsLoading(false));
          })
          .catch((error) => {
              dispatch(setIsLoading(false));
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data.message || error.response?.data || 'Algo salió mal',
                confirmButtonColor: 'var(--primary)',
              });
              // deleteCredentials();
          })
      }

      const DeleteNicByAdmin = (nic) => {
        dispatch(setIsLoading(true));
          axios.delete(`${import.meta.env.VITE_APP_API_URL}/contract/DeleteContractByCustomer/${nic}`, getConfig())
          .then((res) => {
              dispatch(setIsLoading(false));
              Swal.fire({
                icon: 'success',
                title: 'NIC eliminado',
                text: `El NIC ${nic} ha sido eliminado exitosamente`,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
              });
              setTimeout(() => {
                window.location.reload();
            }, 2001)
          })
          .catch((error) => {
              dispatch(setIsLoading(false));
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data.message || error.response?.data || 'Algo salió mal',
                confirmButtonColor: 'var(--primary)',
              });
              // deleteCredentials();
          })
      }

      return { GetContractByStatusNicAndProvince, contractByStatusAndProvince, ApprovedContract, getAllNICById, nicById, DeleteNicByAdmin, getPagination };
}

export default useContractAdmin