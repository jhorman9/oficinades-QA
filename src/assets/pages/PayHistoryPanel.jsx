import React, { useEffect, useRef, useState } from 'react'
import usePayment from '../../hook/usePayment';
import PayTable from '../components/PayTable';
import $ from 'jquery';
import '../styles/PayHistoryPanel.css';

const PayHistoryPanel = () => {

  const tableRef = useRef(null);
  const [tableInitialized, setTableInitialized] = useState(false);
  const nic = localStorage.getItem('nicCode');
  const { getPaymentByNic, paymentByNic } = usePayment();

  useEffect(() => {
      getPaymentByNic(nic);
  },[nic]); 

  useEffect(() => {
    if (!tableInitialized) {
      const table = $(tableRef.current).DataTable({
        responsive: true,
        search: false,
        paging: false,
        info: false,
        searching: false,
        sortable: false,
        ordering: false, // Esta línea desactiva el ordenamiento por defecto
        language: {
          url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        columnDefs: [
          { orderable: false, targets: '_all'},
          { responsivePriority: 1, targets: 0 },
          { responsivePriority: 2, targets: -1 }
        ],
        initComplete: function () {
          $(this.api().table().container()).addClass('no-ordering-icons');
        }
      });
      setTableInitialized(true);
    }
    
    return () => {
      if (tableInitialized) {
        const table = $(tableRef.current).DataTable();
        if(table){
          table.destroy();
          setTableInitialized(false);
        }
      }
    };
    
  }, [paymentByNic, tableInitialized]);

  return (
    <section className="pay__history__panel container">
        <h5 className='pay__history__panel__title mb-3'>HISTORIAL DE PAGOS</h5>
      <div className="table__bill">
          <h6 className='color-primary fw-bold mb-2'>Historial de pagos</h6>
          {
            paymentByNic.length > 0 ? (
            <table ref={tableRef} className='display responsive w-100'>
              <thead>
                <tr className='table__bill__header'>
                  <th className='sorting_disabled'>Fecha del pago</th>
                  <th>Fecha aplicacion</th>
                  <th>Agencia de pago</th>
                  <th>Tipo de pago</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {
                  paymentByNic.map((payment, index) => (
                    <tr key={index}>
                    <td>{payment?.paymentDate}</td>
                    <td>{payment?.processDate}</td>
                    <td>{payment?.office}</td>
                    <td>{payment?.paymentType}</td>
                    <td>B./{payment?.paymentAmount}</td>
                  </tr>                  
                ))
                }
              </tbody>
            </table>
            ) : (
              <p className='pt-4 text-center'>No hay historial de pagos</p>
            )
          }
        </div>
      </section>
  )
}

export default PayHistoryPanel;