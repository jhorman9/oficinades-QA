import { createSlice } from "@reduxjs/toolkit";

export const qtyNotificationSlice = createSlice({
    name: 'QtyNotification',
    initialState: 0,
    reducers: {
        qtyNotificationState: (state, action) => {
            return action.payload;
        },
    }
});

export const { qtyNotificationState } = qtyNotificationSlice.actions;

export default qtyNotificationSlice.reducer;