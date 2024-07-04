import { createSlice } from '@reduxjs/toolkit';

export const currencyNicSlice = createSlice({
    name: 'currencyNic',
    initialState: null,
    reducers: {
        currencyNIC: (state, action) => {
            return action.payload
        }
    }
})

export const { currencyNIC } = currencyNicSlice.actions;

export default currencyNicSlice.reducer;