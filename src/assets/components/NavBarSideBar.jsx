import React, { useEffect, useState } from 'react'
import { Container, Dropdown, Navbar } from 'react-bootstrap'
import NavTopInfoToggle from './NavTopInfoToggle'
import ModalButton from './ModalButton'
import ModalChooseNic from './ModalChooseNic'
import useNic from '../../hook/useNic'
import { useNavigate, useParams } from 'react-router-dom'
import SVGBurguer from '../images/icons/SVGBurguer'
import { useDispatch, useSelector } from 'react-redux'
import { setHandleClick } from '../../store/slice/handleClickSideBar'
import useWindowDimensions from '../../hook/useWindowDimension'

const NavBarSideBar = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const { getAllNIC, allNic } = useNic();
    const {id} = useParams();
    const { width } = useWindowDimensions();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const rol = useSelector(state => state.getRol);

    const filteredNic = allNic.filter(nics => nics?.status !== 'Rejected' && nics?.status !== 'Pending');
    const orderedNic = filteredNic.sort((a, b) => a?.status?.localeCompare(b?.status));
    const getAllNicFiltered = orderedNic;
    
    useEffect(() => {
        getAllNIC();
    },[id]);
    
    const changeNIC = (nicData) => {
        if (nicData) {
          navigate(`/panel/${nicData.contractId}/home`);
        }
    }

    const handleClick = () => {
        dispatch(setHandleClick(true));
    }

  return (
    <>
    <Navbar className='NavBarTop sticky'>
        <Container>
            <div className='d-flex gap-2 align-items-center'>
                {
                    width <= 1199 ? (
                    <div className='main_burguer' onClick={handleClick}>
                        <SVGBurguer/>
                    </div>
                    ) : (null)
                }
                {
                    width >= 1199 && rol == 'Customer' ? (
                        <>
                        <Navbar.Brand>
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">NIC : {localStorage.getItem('nicCode')}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                {
                                    getAllNicFiltered.map((nic) => (
                                        <Dropdown.Item
                                        onClick={() => changeNIC(nic)}
                                        key={nic.nicCode}
                                        >
                                        {nic.nicCode}
                                        </Dropdown.Item>
                                    ))
                                }
                                </Dropdown.Menu>
                            </Dropdown>
                        </Navbar.Brand>
                        <ModalButton handleShow={handleShow} text={'Crear NIC'}/>
                        </>
                    ) : (null)
                }
            </div>
            <NavTopInfoToggle />
        </Container>
    </Navbar>  
    <ModalChooseNic handleClose={handleClose} show={show} />
    </>
    )
}

export default NavBarSideBar