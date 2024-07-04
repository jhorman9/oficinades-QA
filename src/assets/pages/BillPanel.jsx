import React, { useEffect, useRef } from 'react';
import 'datatables.net-dt/css/jquery.dataTables.css'; // Importa los estilos CSS de DataTables
import 'datatables.net-responsive-dt/css/responsive.dataTables.css'; // Importa los estilos CSS responsive de DataTables
import $ from 'jquery'; // Importa jQuery
import 'datatables.net'; // Importa DataTables
import 'datatables.net-responsive'; // Importa el complemento Responsive de DataTables
import '../styles/BillPanel.css';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import SVGFaucet from '../images/icons/SVGFaucet';
import SVGBash from '../images/icons/SVGBash';
import SVGDownload from '../images/icons/SVGDownload';
import SVGCard from '../images/icons/SVGCard';
import usePayment from '../../hook/usePayment';
import useNic from '../../hook/useNic';
import { Link, useParams } from 'react-router-dom';

const BillPanel = () => {
  
  const tableRef = useRef(null);
  
  const nic = localStorage.getItem('nicCode');
  const { getLastInvoiceByNic, invoiceByNic } = usePayment();
  const { balance, getBalance } = useNic();
  const { id } = useParams();

  useEffect(() => {
    if (nic) {
      getBalance(nic);
      getLastInvoiceByNic(nic);
    }
  }, []);

  
  useEffect(() => {
    if (Array.isArray(invoiceByNic) && invoiceByNic.length > 0) {
      const table = $(tableRef.current).DataTable({
        responsive: true,
        paging: false,
        info: false,
        searching: false,
        columnDefs: [
          { responsivePriority: 1, targets: 0 },
          { responsivePriority: 2, targets: -1 }
        ],
        sortable: false,
        ordering: false // Esta línea desactiva el ordenamiento por defecto
      });
    
      // Limpiar la tabla antes de agregar nuevos datos
      table.clear().draw();
    
      // Agregar filas a la tabla
      invoiceByNic.forEach(invoice => {
        const formattedStartDate = invoice?.startDate || '';
        const formattedEndDate = invoice?.endDate || '';
        const formattedInvoiceDate = invoice?.invoiceDate || '';
        const formattedDueDate = invoice?.dueDate || '';
    
        table.row.add([
          formattedStartDate,
          formattedEndDate,
          formattedInvoiceDate,
          formattedDueDate,
          `B./${invoice.totalIdaan || ''}`,
          `B./${invoice.totalAseo || ''}`
        ]).draw(false); // Dibujar la tabla sin recargarla completamente
      });
    
      return () => {
        if (table) {
          table.destroy();
        }
      };
    }
    
  }, [invoiceByNic]);
  
  return (
    <section className='panel__bill container'>
      <div className="panel__bill__container">
        <h5 className='panel__title mb-3'>FACTURAS</h5>
        <div className='panel__bill__info__header mb-3'>
          <ul className="panel__bill__billing p-0 list-unstyled mb-0 bill__item1">
            <li className="panel__bill__billing_item">
              <span className='color-primary mb-0 fw-bold'>Última facturación:</span><br />
              <span className='mb-2'>{balance?.lastInvoice}</span>
            </li>
            <li className="panel__bill__billing_item">
              <span className='color-primary mb-0 fw-bold'>Fecha de vencimiento:</span><br />
              <span className='mb-2'>{balance?.invoiceDueDate}</span>
            </li>
            <li className="panel__bill__billing_item">
              <span className='color-primary mb-0 fw-bold'>Nro de factura:</span> <br />
              <span className='mb-2'>{`#${balance?.lastInvoiceNumber}`}</span>
            </li>
          </ul>
          <div className="panel__bill__water bill__item2">
            <SVGFaucet />
            <h3 className='mb-0 fw-bold'>B./{balance?.total}</h3>
            <p className='color-primary fw-bold mb-0'>Consumo de agua</p>
          </div>
          <div className="panel__bill__cleanliness bill__item3">
            <SVGBash />
            <h3 className='mb-0 fw-bold'>B./{balance?.totalSanitation}</h3>
            <p className='color-primary fw-bold mb-0'>Tasa de aseo</p>
          </div>
          <div className="panel__bill__toggle bill__item4">
            <button className='btn btn-primary d-flex justify-content-between'><Link className='d-flex justify-content-between align-items-center text-decoration-none color-inherit w-100' target='_blank' to={`/bill-to-customer?nic=${nic}`}>Descargar factura <SVGDownload /> </Link></button>
            <button className='btn btn-secondary'><Link className='d-flex justify-content-between align-items-center text-decoration-none color-inherit w-100' to={`/panel/${id}/pay`}>Pagar factura <SVGCard /></Link></button>
          </div>
        </div>
        <div className="table__bill">
          <h6 className='color-primary fw-bold mb-2'>Historial de facturas</h6>
          {
            invoiceByNic.length > 0 ? (
              <table ref={tableRef} className='display responsive w-100'>
                <thead>
                  <tr className='table__bill__header'>
                    <th>Desde</th>
                    <th>Hasta</th>
                    <th>Fecha de facturación</th>
                    <th>Fecha de vencimiento</th>
                    <th>Total IDAAN</th>
                    <th>Total aseo</th>
                  </tr>
                </thead>
                <tbody>

                </tbody>
              </table>
            ) : (
              <p className='pt-4 text-center'>No hay historial de facturas</p>
            )
          }
        </div>
      </div>
    </section>
  );
}

export default BillPanel;
