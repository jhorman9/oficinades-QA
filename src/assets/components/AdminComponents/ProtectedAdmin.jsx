import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SideBar from '../SideBar';
import NavBarTop from '../NavbarTop';
import { useEffect } from 'react';

const ProtectedAdmin = () => {

    const token = localStorage.getItem('token');
    const rol = useSelector(state => state.getRol);
    
    if(token && rol == "Super" || token && rol == "Admin" || token && rol == "Assistant"){
        return (
            <div className='Panel d-flex'>
                <SideBar />
                <div className='w-100 bg__gray overflow-auto'>
                    <NavBarTop />
                    <Outlet />
                </div>
            </div>
            )
    }else if (!rol) { 
        return;
    } else { 
        return <Navigate to='/' />
    }
};

export default ProtectedAdmin;