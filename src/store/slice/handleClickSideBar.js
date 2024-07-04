import { createSlice } from '@reduxjs/toolkit';

export const handleClickSideBar = createSlice({
    name: 'handleClickSideBar',
    initialState: false,
    reducers: {
        setHandleClick: (state, action) => {
            return action.payload
        }
    }
})

export const { setHandleClick } = handleClickSideBar.actions;

export default handleClickSideBar.reducer;