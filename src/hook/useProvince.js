import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import getConfig from '../assets/components/utils/getConfig';
import axios from 'axios';
import deleteCredentials from '../assets/components/utils/deleteCredentials';

const useProvince = () => {

    const [provinces, setProvinces] = useState([]);
    const dispatch = useDispatch();
  
    const GetProvinces = () => {
        axios.get(`${import.meta.env.VITE_APP_API_URL}/province/GetAllProvinces`, getConfig())
        .then((res) => {
            setProvinces(res.data);
        })
        .catch((err) => {
            deleteCredentials();
        })
    };

    return { GetProvinces, provinces };

}

export default useProvince;