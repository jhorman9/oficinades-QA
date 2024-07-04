import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInSeconds } from "date-fns";
import { useEffect, useState } from "react";

const timeElapsed = ({ createAt }) => {
    const [tiempoTranscurrido, setTiempoTranscurrido] = useState('');
  
    useEffect(() => {
      if (!createAt) {
        return;
      }
  
      try {
        const fecha = new Date(createAt);
        const fechaActual = new Date();
  
        const segundos = differenceInSeconds(fechaActual, fecha);
        const minutos = differenceInMinutes(fechaActual, fecha);
        const horas = differenceInHours(fechaActual, fecha);
        const dias = differenceInDays(fechaActual, fecha);
        const meses = differenceInMonths(fechaActual, fecha);
  
        let tiempoFormateado = '';
        if(segundos < 60){
          tiempoFormateado = `hace ${segundos} ${segundos === 1 ? 'segundo' : 'segundos'}`;
        }else if (minutos < 60) {
          tiempoFormateado = `hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
        } else if (horas < 24) {
          tiempoFormateado = `hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
        } else if (dias < 30) {
          tiempoFormateado = `hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
        } else {
          tiempoFormateado = `hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
        }
  
        setTiempoTranscurrido(tiempoFormateado);
      } catch (error) {
      }
    }, [createAt, tiempoTranscurrido]);
  
    return <span>{tiempoTranscurrido}</span>;
  };

export default timeElapsed;
