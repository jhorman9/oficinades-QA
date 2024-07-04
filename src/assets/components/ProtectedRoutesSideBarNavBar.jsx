import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import NavBarSideBar from './NavBarSideBar';
import { useSelector } from 'react-redux';

const ProtectedRoutesSideBarNavBar = () => {
    const token = localStorage.getItem('token');
    const rol = useSelector(state => state.getRol);

    if (token && rol === 'Customer') {
        return (
            <div className='Panel d-flex'>
                <SideBar />
                <div className='w-100 bg__gray overflow-auto'>
                    <NavBarSideBar />
                    <Outlet />
                </div>
            </div>
        );
    } else if (!rol) { 
        return;
    } else {
        return <Navigate to='/' />;
    }
}

export default ProtectedRoutesSideBarNavBar;
