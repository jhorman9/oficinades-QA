import React, { useEffect, useRef } from 'react';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';
import '../styles/payPanel.css';
import 'datatables.net-buttons-dt';
import 'datatables.net-responsive-dt';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import '../styles/notificationPanel.css';
import iconDelete from '../images/icons/icon _close circle.svg';
import useNotifications from '../../hook/useNotifications';
import { useNavigate } from 'react-router-dom';

const NotificationPanel = () => {

  const tableRef = useRef(null);
  const navigate = useNavigate();
  const { GetNotificationsByUser, notificationsCustomers, DeleteUserNotification } = useNotifications();
  const getCountNotification = localStorage.getItem('qtyNotification');

  useEffect(() => {
    GetNotificationsByUser();
  }, [getCountNotification]);

  useEffect(() => {
    const isDataTable = $.fn.DataTable.isDataTable(tableRef.current);

    if (!isDataTable && notificationsCustomers) {
      const dataTable = $(tableRef.current).DataTable({
        responsive: true,
        info: false,
        ordering: false,
        process: true,
        language: {
          url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        columnDefs: [
          { responsivePriority: 1, targets: 0 },
          { responsivePriority: 2, targets: -1 }
        ],
        drawCallback: function () {
          $(tableRef.current).find('tbody tr').removeClass('odd even');
          $(tableRef.current).find('tbody tr:odd').addClass('odd');
          $(tableRef.current).find('tbody tr:even').addClass('even');
        }
      });

      dataTable.clear().draw();

      notificationsCustomers.forEach((item, index) => {
        try {
          const fecha = new Date(item.createAt);
          const fechaActual = new Date();

          const diferencia = fechaActual.getTime() - fecha.getTime();
          const segundos = Math.floor(diferencia / 1000);
          const minutos = Math.floor(segundos / 60);
          const horas = Math.floor(minutos / 60);
          const dias = Math.floor(horas / 24);
          const meses = Math.floor(dias / 30);

          let tiempoFormateado = '';
          if (segundos < 60) {
            tiempoFormateado = `hace ${segundos} ${segundos === 1 ? 'segundo' : 'segundos'}`;
          } else if (minutos < 60) {
            tiempoFormateado = `hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
          } else if (horas < 24) {
            tiempoFormateado = `hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
          } else if (dias < 30) {
            tiempoFormateado = `hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
          } else {
            tiempoFormateado = `hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
          }

          item.tiempoFormateado = tiempoFormateado;

        } catch (error) {
        }

        const trClass = `cursor-pointer ${index % 2 === 0 ? 'even' : 'odd'} ${item.isRead === false ? 'noRead' : 'read'}`;

        const row = [
          `<td class='item1'>${item.tiempoFormateado}</td>`,
          `<td class='item2'>${item.subject}</td>`,
          `<td class='item3 text-center' title='Eliminar'><img src="${iconDelete}" class='cursor-pointer' alt="icono para eliminar" /></td>`
        ];

        const tr = $(`<tr class='${trClass}'>${row.join('')}</tr>`);

        tr.find('.item1').on('click', () => navigateToDetails(item.notificationId));
        tr.find('.item2').on('click', () => navigateToDetails(item.notificationId));
        tr.find('.item3').on('click', (e) => {
          e.stopPropagation();
          deleteNotification(item.notificationId);
        });
        dataTable.rows.add(tr);
      });

      dataTable.draw();
    }
  }, [notificationsCustomers, GetNotificationsByUser, tableRef]);
  
  notificationsCustomers?.sort((a, b) => {
    // if (a.isRead === false && b.isRead === true) {
    //   return -1;
    // } else if (a.isRead === true && b.isRead === false) {
    //   return 1;
    // }
  
    const secondsA = new Date(a.createdAt).getTime() / 1000;
    const secondsB = new Date(b.createdAt).getTime() / 1000;
  
    return secondsA - secondsB;
  });


  const navigateToDetails = ( notificationId ) => {
    navigate(`${notificationId}`);
  }

  const deleteNotification = (id) =>{
    DeleteUserNotification(id);
  }

  return (
    <section className='notification container'>
      <div className="notification__content">
        <h5 className='mb-3 fw-bold title__panel'>NOTIFICACIONES</h5>
      </div>
      <div className='notification__table'>
        <table ref={tableRef} className="display notification__table__c">
          <thead>
            <tr>
              <th>Tiempo</th>
              <th>Título</th>
              <th>Acción</th>
            </tr>
          </thead>
        </table>
      </div>
    </section>
  );
}

export default NotificationPanel;
