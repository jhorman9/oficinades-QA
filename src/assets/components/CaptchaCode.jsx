import React, { useState } from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import { createRef } from 'react';
import '../styles/ReCAPTCHA.css';
import Swal from 'sweetalert2';

const CaptchaCode = ( ) => {

  const [isInfo, setIsInfo] = useState(false);

    function onChange(value) {
      if(value){
        setIsInfo(true);
      }
    }

  return (
    <div className='captcha'>
      <div >
        <ReCAPTCHA
          sitekey={import.meta.env.VITE_APP_GOOGLE_KEY}
          onChange={onChange}
        />
      </div>
    </div>
  )
}


export default CaptchaCode;