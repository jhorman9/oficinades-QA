import React, { useEffect, useState } from 'react'
import logo from '../images/logo.svg';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/SideBar.css'
import { useSelector } from 'react-redux';
import useWindowDimensions from '../../hook/useWindowDimension';
import ModalButton from './ModalButton';
import { Accordion } from 'react-bootstrap';
import useNic from '../../hook/useNic';
import ModalChooseNic from './ModalChooseNic';
import CustomerSideBar from './CustomerSideBar';
import AdminSideBar from './AdminComponents/AdminSideBar';

const SideBar = () => {

    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const { getAllNIC, allNic } = useNic();
    const { id } = useParams();
    const { width } = useWindowDimensions();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleClickSideBar = useSelector(state => state.handleClickSideBar);

    const filteredNic = allNic.filter(nics => nics?.status !== 'Rejected' && nics?.status !== 'Pending');
    const orderedNic = filteredNic.sort((a, b) => a?.status?.localeCompare(b?.status));
    const getAllNicFiltered = orderedNic;
    const rol = useSelector(state => state.getRol);
    
    useEffect(() => {
        getAllNIC();
    },[id]);

    const changeNIC = (nicData) => {
        if (nicData) {
          navigate(`/panel/${nicData.contractId}/home`);
        }
    }

  return (
    <>
        <div className='SideBar' style={handleClickSideBar === true ? { left: '0' } : { left: '-300px' }}>
            <div className='SideBar-logo'>
                <img src={logo} alt='Logo de IDAAN' />
            </div>
            <nav className='SideBar__content addScrollBar'>
                {
                    rol === 'Customer' 
                        ? <CustomerSideBar id={id} />
                        : rol === 'Super' || rol === 'Admin' || rol === 'Assistant'
                        ? <AdminSideBar />
                        : null
                    }
                {
                    width < 1199 && rol == 'Customer'? (
                        <>
                        <Accordion defaultActiveKey={null}>
                            <Accordion.Item eventKey="0">
                                <Accordion.Button>NIC: {localStorage.getItem('nicCode')}</Accordion.Button>
                                <Accordion.Body>
                                    <ul className='sideBar_changeNic list-unstyled p-0 m-0'>
                                    {
                                    getAllNicFiltered.map((nic) => (
                                        <li
                                        onClick={() => changeNIC(nic)}
                                        key={nic.nicCode}
                                        >
                                        {nic.nicCode}
                                        </li>
                                    ))
                                }
                                    </ul>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        <ModalButton text={'Crear NIC'} className='buttonSideBar' handleShow={handleShow}/>
                        </>
                    ) : (null)
                }
            </nav>
        </div>
        <ModalChooseNic handleClose={handleClose} show={show} />
        </>
        )
}

export default SideBar