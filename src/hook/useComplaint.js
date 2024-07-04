import React from 'react'
import axios from "axios";
import getConfig from "../assets/components/utils/getConfig";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../store/slice/isLoading.slice";
import { useState } from "react";
import Swal from "sweetalert2";

const useComplaint = () => {

    const dispatch = useDispatch();

    const [getAllComplaint, setGetAllComplaint] = useState([]);
    const [getComplaintByID, setGetComplaintByID] = useState();
    const [ getPagination, setGetPagination] = useState({});
  
    const GetAllComplaint = (itemPerPageState, pageNumberState, searchState, isSort) => {
        dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/complaint/GetAllComplaints?pageSize=${itemPerPageState}&pageNumber=${pageNumberState + 1 || 1}${searchState && searchState.searchOption && searchState.searchValue ? `&type=${searchState.searchOption}&value=${searchState.searchValue}` : ''}&orderType=${isSort}`, getConfig())
        .then(res => {
            setGetPagination(JSON.parse(res.headers['paginations']));
            setGetAllComplaint(res.data)
            dispatch(setIsLoading(false));
            })
            .catch(error => {
                dispatch(setIsLoading(false));
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data.message || error.response?.data || 'Algo salió mal',
                });
            })
        };

        const GetComplaintById = (obsID) => {
            dispatch(setIsLoading(true));
            axios.get(`${import.meta.env.VITE_APP_API_URL}/complaint/GetComplaintDetail/${obsID}`, getConfig())
            .then(res => {
                setGetComplaintByID(res.data)
                dispatch(setIsLoading(false));
                })
                .catch(error => {
                    dispatch(setIsLoading(false));
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.response?.data.message || error.response?.data || 'Algo salió mal',
                    });
                })
            };

    return { GetAllComplaint, getAllComplaint, GetComplaintById, getComplaintByID, getPagination }

}

export default useComplaint