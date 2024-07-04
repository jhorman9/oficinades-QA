import React, { useEffect } from 'react';
import '../styles/ChooseNIC.css';
import { useState } from 'react';
import '../styles/modal.css'
import ModalChooseNic from '../components/ModalChooseNic';
import ModalButton from '../components/ModalButton';
import CardNic from '../components/CardNic';
import closedSvg from '../images/icons/icon _close circle.svg';
import moneySvg from '../images/icons/money.svg';
import useNic from '../../hook/useNic';
import Swal from 'sweetalert2';

const ChooseNIC = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [isRefresh, setIsRefresh] = useState(false);

    const {getAllNIC, allNic, DeleteNIC} = useNic();
    
    useEffect(() => {
        getAllNIC();
    },[show, isRefresh]);
    
    const handleNicDelete = (nic) => {
        Swal.fire({
            title: "Eliminar NIC",
            html: `<p>Desea eliminar el NIC ${nic} de su cuenta?</p>`,
            icon: "question",
            iconColor: 'var(--primary)',
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "var(--primary)",
            cancelButtonText: 'Cancelar',
            confirmButtonText: "Eliminar"
          }).then((result) => {
            if (result.isConfirmed) {
              DeleteNIC(nic, setIsRefresh);
            }
          });
    };

    const filteredNic = allNic.filter(nics => nics?.status !== 'Rejected');
    const orderedNic = filteredNic.sort((a, b) => a?.status?.localeCompare(b?.status));

    const getAllNicFiltered = orderedNic;
    
    return (
        <section className='choose__nic container section'>
            <div className="choose__nic__header">
                <div className="choose__nic__header__text">
                    <h2>SELECCIONAR NIC</h2>
                    <p className='mb-0'>Seleccione un NIC para ingresar</p>
                </div>
                <div className="choose__nic__header__btn ">
                    <ModalButton handleShow={handleShow} text={'+ Agregar NIC'} />
                </div>
            </div>
            <div className="choose__nic__body" style={{ gridTemplateColumns: allNic.length <= 3 ? 'repeat(3, 275px)' : 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                 {getAllNicFiltered.map(info => (
                    <CardNic key={info?.contractId} moneySvg={moneySvg} closedSvg={closedSvg} params={info?.contractId} info={info} handleNicDelete={handleNicDelete} />
                ))}
            </div>
            <ModalChooseNic handleClose={handleClose} show={show}/>
        </section>
    );
};

export default ChooseNIC;