import { createSlice } from '@reduxjs/toolkit';

export const isTokenSlice = createSlice({
    name: 'isToken',
    initialState: false,
    reducers: {
        setIsToken: (state, action) => {
            return action.payload
        }
    }
})

export const { setIsToken } = isTokenSlice.actions;

export default isTokenSlice.reducer;