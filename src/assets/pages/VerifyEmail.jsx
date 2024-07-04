import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import verifyEmailHook from '../../hook/verifyEmailHook';
import { IconIDAAN } from '../components/IconIDAAN';
import logo from '../images/logo.svg';
import '../styles/verifyEmail.css';

const Verifymail = () => {
    
    const { validateEmail, resendEmail, isVerified } = verifyEmailHook();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    useEffect(() => {
      validateEmail(token, email, navigate);
    },[token,email]);

    const reSendEmail = () => {
      resendEmail(email);
    } ;

  return (
    <>
      {isVerified === false && email && (
        <div className="verifyEmail">
          <div className="verifyEmailContent container">
            <IconIDAAN logo={logo} />
            <span>
              Dar click <button onClick={reSendEmail}>AQUÍ</button> para reenviar el correo
            </span>
          </div>
        </div>
      )}
    </>
  )
}

export default Verifymail