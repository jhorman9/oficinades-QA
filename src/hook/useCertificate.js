import axios from "axios";
import getConfig from "../assets/components/utils/getConfig";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../store/slice/isLoading.slice";
import { useState } from "react";
import Swal from "sweetalert2";
import generateCertificated from "../assets/components/utils/generateCertificated";
import deleteCredentials from "../assets/components/utils/deleteCredentials";

const useCertificate = () => {

    const dispatch = useDispatch();
    const [responseCertificate, setResponseCertificate] = useState();
    const [allCertificate, setAllCertificate] = useState([]);
    const rol = useSelector(state=> state?.getRol);

    const GetAllCertificateByNicCode = (nic, navigate) => {
        dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/certificate/GetAllCertificateByNicCode/${nic}`, getConfig())
        .then(res => {
            setAllCertificate(res.data)
            dispatch(setIsLoading(false));
            })
            .catch(error => {
                dispatch(setIsLoading(false));
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Algo salió mal',
                });
                rol == 'Customer' && (
                    deleteCredentials()
                  )
            })
        };
        
        const CreateCertificateH = (data, reset, nic) => {
            dispatch(setIsLoading(true));
          
            const formData = new FormData();
            formData.append('NicCode', data.NicCode);
            formData.append('FincaCode', data.FincaCode);
            formData.append('FolioCode', data.FolioCode);
            formData.append('TomoCode', data.TomoCode);
            formData.append('Quantity', data.Quantity);
            formData.append('DocumentData', data.DocumentData?.[0]);
          
            axios.post(
              `${import.meta.env.VITE_APP_API_URL}/certificate/CreateCertificate`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
              .then(res => {
                Swal.fire({
                  icon: 'success',
                  title: 'Certificado creado',
                  text: 'El certificado debe ser aprobado, por favor espere con paciencia',
                  timer: 2000,
                  timerProgressBar: true,
                  showConfirmButton: false,
                });
          
                setTimeout(() => {
                  window.location.reload();
                }, 2001);
          
                dispatch(setIsLoading(false));
                reset();
              })
              .catch(error => {
                dispatch(setIsLoading(false));
                rol == 'Customer' && (
                    deleteCredentials()
                  )
              });
          };

    const GetCertificateByRequestId = (RequestId) => {
        dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/certificate/GetCertificate/${RequestId}`,  getConfig())
        .then(res => {
            generateCertificated(res.data);
            dispatch(setIsLoading(false));
        })
        .catch(error => {
            dispatch(setIsLoading(false));
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Algo salió mal',
            });
            rol == 'Customer' && (
                deleteCredentials()
              )
        })
    };

    const GetValidateCertificate = (tokenId) => {
        dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/certificate/GetValidateCertificate/${tokenId}` ,  getConfig())
        .then(res => {
            setResponseCertificate(res.data);
            dispatch(setIsLoading(false));
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data.message || error.response?.data || 'Algo salió mal',
            });
            rol == 'Customer' && (
                deleteCredentials()
              )
            dispatch(setIsLoading(false));
        })
    };

    const DeleteCertificate = (nic,id) => {
        dispatch(setIsLoading(true));
        axios.delete(`${import.meta.env.VITE_APP_API_URL}/certificate/DeleteCertificateRequest/${nic}/${id}`, getConfig())
        .then(res => {
            Swal.fire({
                icon: 'success',
                title: 'Certificado eliminado',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false,
            })
                setTimeout(() => {
                    window.location.reload();
                }, 1001)
                dispatch(setIsLoading(false));
            })
            .catch(error => {
            rol == 'Customer' && (
                deleteCredentials()
                )
            dispatch(setIsLoading(false));
        });
    };

    return { GetAllCertificateByNicCode, CreateCertificateH, allCertificate, GetCertificateByRequestId, GetValidateCertificate, responseCertificate, DeleteCertificate }

}

export default useCertificate;