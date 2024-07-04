import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const verifyLogin = () => {

  const isAuthenticated = localStorage.getItem('token') !== null && localStorage.getItem('name') !== null && localStorage.getItem('abreviation') !== null;
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if(isAuthenticated && rol === 'Customer'){
        navigate('/choose-nic');
    }
  }, [isAuthenticated, rol]);

  useEffect(() => {
    dispatch(getRolThunk(navigate))
  }, [token, rol])

  return (
    <div>verifyLogin</div>
  )
}

export default verifyLogin;