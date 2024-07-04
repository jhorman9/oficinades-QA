import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getConfig from "../assets/components/utils/getConfig";
import { setIsLoading } from "../store/slice/isLoading.slice";
import Swal from "sweetalert2";
import deleteCredentials from "../assets/components/utils/deleteCredentials";

const useNic = () => {
  const dispatch = useDispatch();
  const [allNic, setAllNic] = useState([]);
  const [nicById, setNicById] = useState({});
  const [balance, setBalance] = useState({});
  const rol = useSelector(state=> state?.getRol);

  const getAllNIC = () => {
    dispatch(setIsLoading(true));
    axios
      .get(`${import.meta.env.VITE_APP_API_URL}/contract/GetContractByCustomerId`, getConfig())
      .then((res) => {
        setAllNic(res.data);
        dispatch(setIsLoading(false))
      })
      .catch((err) => {
        // rol == 'Customer' && (
        //   deleteCredentials()
        // )
        dispatch(setIsLoading(false))
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Algo salió mal',
          confirmButtonColor: 'var(--primary)',
        });
      })
  };

  const getAllNICById = (id) => {
    dispatch(setIsLoading(true));
      axios.get(`${import.meta.env.VITE_APP_API_URL}/contract/GetContract/${id}`, getConfig())
      .then((res) => {
        setNicById(res.data);
          localStorage.setItem('nicCode', res.data.contractDetailSistem.nicCode);
          dispatch(setIsLoading(false));
      })
      .catch((err) => {
          dispatch(setIsLoading(false));
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Algo salió mal',
            confirmButtonColor: 'var(--primary)',
          });
          rol == 'Customer' && (
            deleteCredentials()
          )
      })
  }

  const getBalance = (nic) => {
    dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/contract/GetCurrentBalance/${nic}`, getConfig())
          .then((res) => {
              setBalance(res.data);
              dispatch(setIsLoading(false))
          })
        .catch((err) => {
              dispatch(setIsLoading(false));
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Algo salió mal',
                confirmButtonColor: 'var(--primary)',
              });
              rol == 'Customer' && (
                deleteCredentials()
              )
          })
    }

    const createNic = (ContractByCustomer, reset) => {
      dispatch(setIsLoading(true));
      axios.post(`${import.meta.env.VITE_APP_API_URL}/contract/CreateContractByCustomer`, { ContractByCustomer }, getConfig())
      .then(res => {
        Swal.fire({
          icon: 'success',
          title: 'NIC creado',
          text: 'Ahora solo falta ser aprobado por el IDAAN',
          confirmButtonColor: 'var(--primary)',
        });
        reset();
        dispatch(setIsLoading(false));
        getAllNIC();
      })
      .catch(error => {
        dispatch(setIsLoading(false));
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Algo salió mal',
          confirmButtonColor: 'var(--primary)',
        });
        if(error.response?.data.message.includes('El contrato NIC')){
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `El contrato NIC ${ContractByCustomer?.NicCode} ya fue registrado previamente para otro usuario, validar!`,
            confirmButtonColor: 'var(--primary)',
          });
        }
      })
      .finally(setIsLoading(false));
    }

    const DeleteNIC = (nic, setIsRefresh) => {
      dispatch(setIsLoading(true));
      axios
        .delete(`${import.meta.env.VITE_APP_API_URL}/contract/DeleteContract/${nic}`, getConfig())
        .then((res) => {
          dispatch(setIsLoading(false));
          setIsRefresh(true);
          Swal.fire({
            icon: 'success',
            title: 'NIC eliminado',
            text: `El nic ${nic} ha sido eliminado exitosamente`,
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          setTimeout(() => {
            window.location.reload();
          }, 2001);
        })
        .catch((err) => {
          rol == 'Customer' && (
            deleteCredentials()
          )
          dispatch(setIsLoading(false))
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Algo salió mal',
            confirmButtonColor: 'var(--primary)',
          });
        })
    };

  return { getAllNIC, allNic, getAllNICById, nicById, getBalance, balance, createNic, DeleteNIC };

};

export default useNic;