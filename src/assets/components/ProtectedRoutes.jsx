import { Navigate, Outlet } from 'react-router-dom';
import NavbarTop from './NavbarTop';
import { useSelector } from 'react-redux';

const ProtectedRoutes = () => {

    const token = localStorage.getItem('token');
    const rol = useSelector(state => state.getRol);

    if(token && rol == "Customer"){
        return (
            <>
                <NavbarTop/>
                <Outlet />            
            </>
            )
    } else if (!rol) { 
        return;
    }else  { 
        return <Navigate to='/' />
    }

};

export default ProtectedRoutes;