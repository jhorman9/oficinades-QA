import React from 'react'
import '../styles/NotFound.css'
import { Link } from 'react-router-dom'
import { IconIDAAN } from './IconIDAAN';
import logo from '../images/logo.svg';
import PNGNotFound from '../images/404 2-01.png';

const NotFound = () => {
  return (
    <section className='NotFound'>
        <IconIDAAN logo={logo}/>
        <img className='notFoundPNG' src={PNGNotFound} alt="" />
        <Link to="/" className='btn btn-primary'>Regresar al inicio</Link>
    </section>
  )
}

export default NotFound;