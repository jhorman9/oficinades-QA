import axios from "axios";
import getConfig from "../assets/components/utils/getConfig";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../store/slice/isLoading.slice";
import { useState } from "react";
import Swal from "sweetalert2";

const useCertificateAdmin = () => {

    const dispatch = useDispatch();
    const [certificateByID, setCertificateByID] = useState();
    const [allCertificate, setAllCertificate] = useState([]);
    const [ getPagination, setGetPagination] = useState({});

    const GetAllCertificate = (statusState, provinceState, valueSearch, typeOfSearhState, pageNumberState, itemPerPageState, isSort) => {
        dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/certificate/GetAllCertificates?pageSize=${itemPerPageState}&pageNumber=${pageNumberState + 1 || 1}&status=${statusState}&provinceId=${provinceState}&orderType=${isSort}&typeFilter=${typeOfSearhState || 0}&search=${valueSearch}`, getConfig())
        .then(res => {
            setGetPagination(JSON.parse(res.headers['paginations']));
            setAllCertificate(res.data)
            dispatch(setIsLoading(false));
            })
            .catch(error => {
                dispatch(setIsLoading(false));
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data.message || error.response?.data || 'Algo salió mal',
                    confirmButtonColor: 'var(--primary)',
                });
            })
        };
        
    const GetCertificateDetailByRequestId = (nic) => {
        dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/certificate/GetCertificateDetailByRequestId/${nic}`, getConfig())
        .then(res => {
            setCertificateByID(res.data);
            dispatch(setIsLoading(false));
        })
        .catch(error => {
            dispatch(setIsLoading(false));
        })
    };

    const ApprovedCertificateAdmin = (data, setIsRefresh, handleClose) => {
        dispatch(setIsLoading(true));
        axios.post(`${import.meta.env.VITE_APP_API_URL}/certificate/SetCertificateStatus`,data, getConfig())
        .then(res => {
            setIsRefresh(true);
            dispatch(setIsLoading(false));
            handleClose();
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

    return { GetAllCertificate, allCertificate, GetCertificateDetailByRequestId, certificateByID, ApprovedCertificateAdmin, getPagination }

}

export default useCertificateAdmin;