import axios from "axios";
import getConfig from "../assets/components/utils/getConfig";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../store/slice/isLoading.slice";
import { useState } from "react";
import Swal from "sweetalert2";

const useDashboard = () => {

    const [allDashboard, setAllDashboard] = useState([]);
    const dispatch = useDispatch();

    const GetAllDataDashboard = (data, status) => {
        dispatch(setIsLoading(true));
        axios.get(`${import.meta.env.VITE_APP_API_URL}/management/GetDashBoard/${data.start}/${data.end}/${status}`, getConfig())
        .then(res => {
            setAllDashboard(res.data)
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

        return { GetAllDataDashboard, allDashboard }
}

export default useDashboard