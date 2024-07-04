import { createSlice } from '@reduxjs/toolkit';
import getConfig from '../../assets/components/utils/getConfig';
import axios from 'axios';

export const rolSlice = createSlice({
    name: 'nic',
    initialState: '',
    reducers: {
        getRol: (state, action) => {
            return action.payload;
        },
    }
});

const unauthorizedPaths = [
    '/',
    '/certificate-verification/:tokenId',
    '/panel/payment-responsed/:token',
    '/terms-service',
    '/verifyEmail',
    '/forgot-password',
    '/resetPassword',
    '/register'
];

const isUnauthorizedPath = (path, currentPath) => {
    const regex = new RegExp(`^${path.replace(/:[^/]+/g, '[^/]+')}$`);
    return regex.test(currentPath);
};

export const getRolThunk = () => dispatch => {
    axios.get(`${import.meta.env.VITE_APP_API_URL}/Account/getUserRol`, getConfig())
        .then((res) => {
            dispatch(getRol(res.data));
        })
        .catch((err) => {
            const currentPath = window.location.pathname;
            const unauthorizedPathMatch = unauthorizedPaths.some(path => isUnauthorizedPath(path, currentPath));
            if (err.response?.status === 401 && !unauthorizedPathMatch) {
                window.location.href = '/';
            }
        });
};


export const { getRol } = rolSlice.actions;

export default rolSlice.reducer;