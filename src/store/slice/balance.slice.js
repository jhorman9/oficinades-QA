import { createSlice } from '@reduxjs/toolkit';
import { setIsLoading } from './isLoading.slice';
import getConfig from '../../assets/components/utils/getConfig';
import axios from 'axios';

export const balanceSlice = createSlice({
    name: 'balance',
    initialState: '',
    reducers: {
        getBalance: (state, action) => {
            return action.payload
        }
    }
})

export const getBalanceByNic = (nic) => dispatch => {
    dispatch(setIsLoading(true));
    axios.get(`http://oficinades.idaan.gob.pa:5001/api/contract/GetCurrentBalance/${nic}`, getConfig())
    .then((res) => {
        dispatch(getBalance(res.data));
    })
    .catch((err) => {
        dispatch(setIsLoading(false));
    })
    .finally(dispatch(setIsLoading(false)));
};

export const { getBalance } = balanceSlice.actions;

export default balanceSlice.reducer;