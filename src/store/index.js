import { configureStore } from '@reduxjs/toolkit'
import isLoadingSlice from './slice/isLoading.slice';
import handleClickSideBar from './slice/handleClickSideBar';
import getRol from './slice/rol.slice';
import isTokenSlice from './slice/isToken.slice';
import qtyNotificationSlice from './slice/qtyNotification';

export default configureStore({
  reducer: {
    isToken: isTokenSlice,
    isLoading: isLoadingSlice,
    getRol: getRol,
    handleClickSideBar: handleClickSideBar,
    qtyNotification: qtyNotificationSlice,
	}
});