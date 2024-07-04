import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { IconIDAAN } from './IconIDAAN';
import '../styles/NavBarTop.css';
import NavTopInfoToggle from './NavTopInfoToggle';
import logo from '../images/white-logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import useWindowDimensions from '../../hook/useWindowDimension';
import { setHandleClick } from '../../store/slice/handleClickSideBar';
import SVGBurguer from '../images/icons/SVGBurguer';

const NavBarTop = ( ) => {

  const rol = useSelector(state => state.getRol);
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(setHandleClick(true));
}

  return (
    <Navbar className='NavBarTop sticky'>
      <Container style={rol !== 'Customer' && width > 1199 ? {justifyContent: 'flex-end'} : {justifyContent: 'space-between'}}>
        {
          rol == 'Customer' ? (
            <Navbar.Brand className='d-flex gap-2 align-items-center main_burguer'>
            <IconIDAAN logo={logo}/>
          </Navbar.Brand>
          ): (
            null
            )
          }
          {
          width <= 1199 && rol !== 'Customer' ? (
          <div className='main_burguer cursor-pointer' onClick={handleClick}>
            <SVGBurguer/>
          </div>
          ) : (null)
          }
        <NavTopInfoToggle />
      </Container>
  </Navbar>
  )
}

export default NavBarTop;