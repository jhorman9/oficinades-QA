import React, { useEffect } from 'react'
import useFormattedDate from '../../components/useFormattedDate'
import useNotifications from '../../../hook/useNotifications';
import { useNavigate, useParams } from 'react-router-dom';
import SVGArrowRight from '../../images/icons/SVGArrowRight';
import FileComponent from '../../components/FileComponent';
import { useSelector } from 'react-redux';

const AdminNotificationDetail = () => {

  const rol = useSelector(state => state.getRol);
  const navigate = useNavigate();

  const { IDNotificationAdmin } = useParams();
  const { GetNotificationByIdAdmin, getNotificationByIdStateAdmin } = useNotifications();

    useEffect(() => {
        GetNotificationByIdAdmin(IDNotificationAdmin);
    }, []);

  return (
    <>
    {
      rol == 'Super' || rol == 'Admin' ? (
      <section className='notification container'>
      <div className="notification__content">
        <div className="btn-back mb-3" onClick={()=> navigate('/admin/notifications')}>
            <SVGArrowRight />
            <span className='color-primary ms-2'>Volver</span>
        </div>
      </div>
      <div className='notification__table'>
        <div className="notification__top">
          <div className="notification__title__date">
            <h4>{getNotificationByIdStateAdmin?.subject}</h4>
            <span>{useFormattedDate(getNotificationByIdStateAdmin?.createAt)}</span>
          </div>
          <p>{getNotificationByIdStateAdmin?.contentBody}</p>
        </div>
        {
          getNotificationByIdStateAdmin?.notificationDetails.length > 0 ? (
            <div className="notification__file">
              <h5 className='fs-5'>Archivos adjuntos</h5>
              {
                getNotificationByIdStateAdmin?.notificationDetails.map((notification, index) => (
                  <FileComponent key={index} fileDetails={notification} index={index} />
                ))
              } 
            </div>
          ) : (
            null
          )
        }
      </div>
    </section>
      ) : (
        null
      )
    }
  </>
  )
}

export default AdminNotificationDetail