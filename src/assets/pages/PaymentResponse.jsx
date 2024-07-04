import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import usePayment from '../../hook/usePayment';
import { IconIDAAN } from '../components/IconIDAAN';
import logoIdaan from '../images/logo.svg';

const PaymentResponse = () => {
  const [text, setText] = useState("Procesando...");
  const elapsedTimeRef = useRef(0);
  const { token } = useParams();
  const { GetPaymentStatus, CheckExternalPayment } = usePayment();
  const navigate = useNavigate();
  const safeDate = true;
  
  useEffect(() => {
    CheckExternalPayment(token);
    GetPaymentStatus(token, navigate, safeDate);
  }, [token, safeDate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setText(prevText => {
        const firstChar = prevText.charAt(0);
        const restOfString = prevText.slice(1);
        const newText = restOfString + firstChar;
        return newText;
      });

      elapsedTimeRef.current += 250;

      if (elapsedTimeRef.current >= 20000) {
        clearInterval(intervalId);
        setText('Procesando...')
      }
    }, 250);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='payment-response bg__gray'>
      <div>
        <IconIDAAN logo={logoIdaan}/>
        <p className="color-change">
        {text.split('').map((char, index) => (
          <span key={index}>{char}</span>
        ))}
      </p>
      </div>
    </div>
  )
}

export default PaymentResponse;