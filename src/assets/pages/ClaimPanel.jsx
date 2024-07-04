import React, { useEffect, useRef, useState } from 'react';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';
import '../styles/payPanel.css';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import '../styles/ClaimPanel.css';
import SVGArrowRight from '../images/icons/SVGArrowRight';
import { Link, useNavigate } from 'react-router-dom';
import useComplaints from '../../hook/useComplaints';
import { isValid, parseISO, format } from 'date-fns';

const ClaimPanel = () => {
  
  const { getAllComplaintsByNic, getAllComplaintById } = useComplaints();
  const [tableInitialized, setTableInitialized] = useState(false);
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const nic = localStorage.getItem('nicCode');

  useEffect(() => {
    if (!tableInitialized) {
      const table = $(tableRef.current).DataTable({
        responsive: true,
        info: false,
        language: {
          url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        columnDefs: [
          { targets: 0, orderable: true }, 
          { targets: '_all', orderable: false },
          { responsivePriority: 1, targets: 0 },
          { responsivePriority: 2, targets: -1 }
        ],
      });
      setTableInitialized(true);
    }
    
    return () => {
      if (tableInitialized) {
        const table = $(tableRef.current).DataTable();
        table.destroy();
        setTableInitialized(false);
      }
    };
    
  }, [getAllComplaintById, tableInitialized]);

    useEffect(() => {
      getAllComplaintsByNic(nic);
    }, [])

    const handleRouteMakeClaim = () => {
      navigate('make-claim')
    };

    getAllComplaintById.forEach(element => {
      if (element.createAt) {
        const parsedDate = parseISO(element.createAt);
        if (isValid(parsedDate)) {
          element.createAt = format(parsedDate, 'dd/MM/yyyy HH:mm:ss');
        }
      }
    });    

  return (
    <section className='claim__panel container'>
      <div className="claim__panel__container">
        <div className="claim__panel__title__top">
          <h5 className='mb-3 fw-bold title__panel'>RECLAMOS</h5>
        </div>
        <div className="table__claim">
          <div className="title__button">
            <h6 className='color-primary fw-bold'>Historial de reclamos</h6>
            <div className="table__claim__button__header mb-2">
              <button className="btn btn-primary" onClick={handleRouteMakeClaim}>Hacer reclamo</button>
            </div>
          </div>
          {
            getAllComplaintById.length > 0 ? (
              <table ref={tableRef} className='display responsive w-100'>
                <thead>
                  <tr className='table__bill__header'>
                    <th>#</th>
                    <th>Número de reclamo</th>
                    <th>Tipo de reclamo</th>
                    <th>Fecha de registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    getAllComplaintById?.map(complaint => (
                    <tr key={complaint.complaintId}>
                      <td>{complaint.complaintId}</td>
                      <td>#{complaint.obsId}</td>
                      <td>{complaint.complaintTypeDescription}</td>
                      <td>{complaint.createAt}</td>
                      <td className='text-center'><Link className='cursor-pointer' to={`${complaint.obsId}`}><SVGArrowRight /></Link></td>
                    </tr>
                    ))
                  }
                </tbody>
              </table>
            ) : (
              <p className='pt-4 text-center'>No hay historial de reclamos</p>
            )
          }
        </div>
      </div>
    </section>
  )
}

export default ClaimPanel;