import React, { useEffect, useState } from 'react';
import SVGHome from '../images/icons/SVGHome';
import SVGPay from '../images/icons/SVGPay';
import SVGBill from '../images/icons/SVGBill';
import SVGPayHistory from '../images/icons/SVGPayHistory';
import SVGDebFree from '../images/icons/SVGDebFree';
import SVGClaim from '../images/icons/SVGClaim';
import { SVGNotification } from '../images/icons/SVGNotification';
import { NavLink, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AnonymousSVG from '../images/icons/AnonymousSVG';


const CustomerSideBar = () => {

  const { id } = useParams();
  const qty = useSelector(state=> state.qtyNotification);

  return (
    <>
    <ul>
        <li>
            <NavLink to={`panel/${id}/home`} className={({ isActive, isPending }) =>isPending ? "pending" : isActive ? "active" : ""}>
                <span>
                    <SVGHome />
                </span>
                Inicio
            </NavLink>
        </li>
        <li>
            <NavLink to={`panel/${id}/pay`} className={({ isActive, isPending }) =>isPending ? "pending" : isActive ? "active" : ""}>
                <span>
                    <SVGPay />
                </span>
                Pago en linea
            </NavLink>
        </li>
        <li>
            <NavLink to={`https://clickpago.merchantprocess.net/clientv2/client/IDAAN`} target='_blank' className={({ isActive, isPending }) =>isPending ? "pending" : isActive ? "active" : ""}>
                <span>
                    <AnonymousSVG />
                </span>
                Pago anónimo
            </NavLink>
        </li>
        <li>
            <NavLink to={`panel/${id}/bill`} className={({ isActive, isPending }) =>isPending ? "pending" : isActive ? "active" : ""}>
                <span>
                    <SVGBill />
                </span>
                Facturas
            </NavLink>
        </li>
        <li>
            <NavLink to={`panel/${id}/pay-history`} className={({ isActive, isPending }) =>isPending ? "pending" : isActive ? "active" : ""}>
                <span>
                    <SVGPayHistory />
                </span>
                Historial de pagos
            </NavLink>
        </li>
        <li>
            <NavLink to={`panel/${id}/debt-free`} className={({ isActive, isPending }) =>isPending ? "pending" : isActive ? "active" : ""}>
                <span>
                    <SVGDebFree />
                </span>Paz y salvo
            </NavLink>
        </li>
        <li>
            <NavLink to={`panel/${id}/claim`} className={({ isActive, isPending }) =>isPending ? "pending" : isActive ? "active" : ""}>
                <span>
                    <SVGClaim />
                </span>Reclamos
            </NavLink>
        </li>
        <li>
            <NavLink to={`panel/${id}/notification`} className={({ isActive, isPending }) =>isPending ? "pending" : isActive ? "active" : ""}>
                <div className='position-relative'>
                    <span>
                        <SVGNotification />
                    </span>Notificaciones
                     <span className='qty-notification'>{qty}</span>
                </div>
            </NavLink>
        </li>
    </ul>
    </>
  )
}

export default CustomerSideBar