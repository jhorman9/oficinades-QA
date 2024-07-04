import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './assets/pages/Login';
import './assets/styles/App.css';
import './assets/styles/modal.css';
import { Register } from './assets/pages/Register';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ForgotPassword from './assets/pages/ForgotPassword';
import TermsServices from './assets/pages/TermsServices';
import ResetPassword from './assets/pages/ResetPassword';
import ChooseNIC from './assets/pages/ChooseNIC';
import VerifyEmail from './assets/pages/VerifyEmail';
import Profile from './assets/pages/Profile';
import ClaimPanelChat from './assets/pages/ClaimPanelChat';
import MakeClaimPanel from './assets/pages/MakeClaimPanel';
import HomePanel from './assets/pages/HomePanel';
import PayPanel from './assets/pages/PayPanel';
import BillPanel from './assets/pages/BillPanel';
import PayHistoryPanel from './assets/pages/PayHistoryPanel';
import ClaimPanel from './assets/pages/ClaimPanel';
import DebtFreePanel from './assets/pages/DebtFreePanel';
import NotificationPanel from './assets/pages/NotificationPanel';
import NotificationById from './assets/pages/NotificationById';
import NotFound from './assets/components/NotFound';
import ProtectedRoutes from './assets/components/ProtectedRoutes';
import ProtectedRoutesSideBarNavBar from './assets/components/ProtectedRoutesSideBarNavBar';
import IsLoadingComponent from './assets/components/IsLoadingComponent';
import eyeOnSvg from '../src/assets/images/icons/eye-show.svg';
import eyeOffSvg from '../src/assets/images/icons/eye-off.svg';
import EmailSvg from '../src/assets/images/icons/email.svg';
import CertificateVerification from './assets/pages/CertificateVerification';
import PayCompletedPanel from './assets/pages/PayCompletedPanel';
import { setHandleClick } from './store/slice/handleClickSideBar';
import useWindowDimensions from './hook/useWindowDimension';
import PaymentResponse from './assets/pages/PaymentResponse';
import { getRolThunk } from './store/slice/rol.slice';
import ProtectedAdmin from './assets/components/AdminComponents/ProtectedAdmin';
import AdminHome from './assets/pages/Admin/AdminHome';
import AdminPay from './assets/pages/Admin/AdminPay';
import { AdminDebtFree } from './assets/pages/Admin/AdminDebtFree';
import AdminClaim from './assets/pages/Admin/AdminClaim';
import AdminClaimId from './assets/pages/Admin/AdminClaimId';
import AdminNotification from './assets/pages/Admin/AdminNotification';
import AdminProfile from './assets/pages/Admin/AdminProfile';
import AdminNotificationDetail from './assets/pages/Admin/AdminNotificationDetail';
import AdminUsers from './assets/pages/Admin/AdminUsers';
import AdminNic from './assets/pages/Admin/AdminNic';
import AdminCustomer from './assets/pages/Admin/AdminCustomer';
import AdminCustomerId from './assets/pages/Admin/AdminCustomerId';
import CardCustomer from './assets/pages/CardCustomer';
import BillToCustomer from './assets/pages/BillToCustomer';
import axios, { isAxiosError } from 'axios';

function App() {
  
  const [isInput, setIsInput] = useState(true);
  const { width } = useWindowDimensions(); 
  const dispatch = useDispatch();
  const handleClickSideBar = useSelector(state => state.handleClickSideBar);
  const isLoading = useSelector(state => state.isLoading);
  const isAuthenticated = localStorage.getItem('token') !== null && localStorage.getItem('name') !== null && localStorage.getItem('abreviation') !== null;
  
  const api = axios.create({
    baseURL: `${import.meta.env.VITE_APP_API_URL}`,
  });

  const handleInput = () => {
    setIsInput(!isInput);
  };

  const props= { handleInput, setIsInput, isInput, eyeOffSvg, eyeOnSvg, EmailSvg };
  
  const handleClick = () => {
    dispatch(setHandleClick(false));
  }

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

  const currentPath = window.location.pathname;
  const unauthorizedPathMatch = unauthorizedPaths.some(path => isUnauthorizedPath(path, currentPath));  

  
  useEffect(() => {
    if((isAuthenticated)){
      dispatch(getRolThunk());
    }

    if (!isAuthenticated && !unauthorizedPathMatch) {
        window.location.href = '/';
    }

  },[isAuthenticated, window.location.pathname]);

    return (
    <>
      <div className='app'>
          { isLoading && <IsLoadingComponent />}
        <Routes >
          <Route path="/" element={<Login handleInput={handleInput} isInput={isInput}/>}/>
          <Route path='/register' element={<Register props={props} />} />
          <Route element={<ProtectedRoutes />}>
            <Route path='/choose-nic' element={<ChooseNIC />} />
          </Route>
          <Route element={<ProtectedRoutesSideBarNavBar />}>
            <Route path="/panel/:id/home" element={<HomePanel />} />
            <Route path='/panel/:id/pay' element={<PayPanel />} />
            <Route path='/panel/:id/bill' element={<BillPanel />} />
            <Route path='/panel/:id/pay-history' element={<PayHistoryPanel />} />
            <Route path='/panel/:id/debt-free' element={<DebtFreePanel />} />
            <Route path='/panel/:id/claim' element={<ClaimPanel />} />
            <Route path='/panel/:id/claim/:chatId' element={<ClaimPanelChat />} />
            <Route path='/panel/:id/claim/make-claim' element={<MakeClaimPanel />} />
            <Route path='/panel/:id/notification' element={<NotificationPanel />} />
            <Route path='/panel/:id/notification/:notificationID' element={<NotificationById />} />
            <Route path='panel/:id/profile' element={<Profile />}/>
            <Route path="/panel/:id/pay-completed/:payID" element={<PayCompletedPanel />} />
            <Route path='panel/:id/cards' element={<CardCustomer />}/>
          </Route>
          <Route element={<ProtectedAdmin />}>
            <Route path='/admin/home' element={<AdminHome />}/>
            <Route path='/admin/pays' element={<AdminPay />}/>
            <Route path='/admin/debt-free' element={<AdminDebtFree />}/>
            <Route path='/admin/claims' element={<AdminClaim />}/>
            <Route path='/admin/claims/:claimId' element={<AdminClaimId />}/>
            <Route path='/admin/notifications' element={<AdminNotification />}/>
            <Route path='/admin/notifications/:IDNotificationAdmin' element={<AdminNotificationDetail />}/>
            <Route path='/admin/profile' element={<AdminProfile />}/>
            <Route path='/admin/users' element={<AdminUsers />}/>
            <Route path='/admin/nics' element={<AdminNic />}/>
            <Route path='/admin/customer' element={<AdminCustomer />}/>
            <Route path='/admin/customer/:customerId' element={<AdminCustomerId />}/>
          </Route>
          {
            isAuthenticated && (
              <Route path="/bill-to-customer" element={<BillToCustomer />} />
            )
          }
          <Route path="/certificate-verification/:tokenId" element={<CertificateVerification />} />
          <Route path="/terms-service" element={<TermsServices />} />
          <Route path='/verifyEmail' element={<VerifyEmail />} />
          <Route path='/forgot-password' element={ <ForgotPassword props={props} /> } />
          <Route path='/resetPassword' element={ <ResetPassword props={props} /> } />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {
          width <= 1550 ? (
            <div
              className="shadow"
              onClick={handleClick}
              style={{
                display: handleClickSideBar ? 'block' : 'none',
              }}
            ></div>
          ) : null
        }
      </div>
    </>
  )
}

export default App;
