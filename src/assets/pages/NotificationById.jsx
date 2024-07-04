import React, { useEffect } from 'react'
import SVGArrowRight from '../images/icons/SVGArrowRight';
import { useNavigate, useParams } from 'react-router-dom';
import useNotifications from '../../hook/useNotifications';
import useFormattedDate from '../components/useFormattedDate';
import FileComponent from '../components/FileComponent';

const NotificationById = () => {

  const { GetNotificationById, notificationById } = useNotifications();

  const { notificationID, id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    GetNotificationById(notificationID);
  },[notificationID])

  const backToClaim = () => {
    navigate(`/panel/${id}/notification`);
  }

  return (
    <section className='notification container'>
    <div className="notification__content">
      <div className="btn-back mb-3" onClick={backToClaim}>
          <SVGArrowRight />
          <span className='color-primary ms-2'>Volver</span>
      </div>
    </div>
    <div className='notification__table'>
      <div className="notification__top">
        <div className="notification__title__date">
          <h4>{notificationById?.subject}</h4>
          <span>{useFormattedDate(notificationById?.createAt)}</span>
        </div>
        <p>{notificationById?.contentBody}</p>
      </div>
      {
        notificationById?.notificationDetails.length > 0 ? (
          <div className="notification__file">
            <h5 className='fs-5'>Archivos adjuntos</h5>
            {
              notificationById?.notificationDetails.map((notification, index) => (
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
  )
} 

export default NotificationById;