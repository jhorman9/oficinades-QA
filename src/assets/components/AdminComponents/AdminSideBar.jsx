import React from 'react'
import { NavLink } from 'react-router-dom'
import SVGHome from '../../images/icons/SVGHome'
import SVGPay from '../../images/icons/SVGPay'
import SVGDebFree from '../../images/icons/SVGDebFree'
import SVGClaim from '../../images/icons/SVGClaim'
import { SVGNotification } from '../../images/icons/SVGNotification'
import SVGUsers from '../../images/icons/SVGUsers'
import { useSelector } from 'react-redux'
import SVGUserPlus from '../../images/icons/SVGUserPlus'

const AdminSideBar = () => {

    const rol = useSelector(state => state.getRol);

  return (
    <ul>
        <li>
            <NavLink to={`admin/home`} className={({ isActive, isPending }) =>isPending ? "pending" : isActive ? "active" : ""}>
                <span>
                    <SVGHome />
                </span>Inicio
            </NavLink>
        </li>
        {
            rol == 'Admin' || rol == 'Super' ? (
                <li>
                    <NavLink to={`admin/users`} className={({ isActive, isPending }) =>isPending ? "pending" : isActive ? "active" : ""}>
                        <span>
                            <SVGUserPlus />
                        </span>Administradores
                    </NavLink>
                </li>
            ) : (
                null
            )
        }
        <li>
            <NavLink to={`admin/customer`} className={({ isActive, isPending }) =>isPending ? "pending" : isActive ? "active" : ""}>
                <span>
                    <SVGUsers />
                </span>Clientes
            </NavLink>
        </li>
        <li>
            <NavLink to={`admin/pays`} className={({ isActive, isPending }) =>isPending ? "pending" : isActive ? "active" : ""}>
                <span>
                    <SVGPay />
                </span>Pagos
            </NavLink>
        </li>
        <li>
            <NavLink to={`admin/debt-free`} className={({ isActive, isPending }) =>isPending ? "pending" : isActive ? "active" : ""}>
                <span>
                    <SVGDebFree />
                </span>Paz y salvo
            </NavLink>
        </li>
        <li>
            <NavLink to={`admin/claims`} className={({ isActive, isPending }) =>isPending ? "pending" : isActive ? "active" : ""}>
                <span>
                    <SVGClaim />
                </span>Reclamos
            </NavLink>
        </li>
        <li>
            <NavLink to={`admin/nics`} className={({ isActive, isPending }) =>isPending ? "pending" : isActive ? "active" : ""}>
                <span>
                    <SVGHome />
                </span>Gestión de NIC
            </NavLink>
        </li>
        {
            rol == 'Super' || rol == 'Admin' ? (
                <li>
                    <NavLink to={`admin/notifications`} className={({ isActive, isPending }) =>isPending ? "pending" : isActive ? "active" : ""}>
                        <span>
                            <SVGNotification />
                        </span>Notificaciones
                    </NavLink>
                </li>
            ) : (
                null
            )
        }
    </ul>
  )
}

export default AdminSideBar;